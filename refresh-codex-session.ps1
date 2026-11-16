param(
    [int]$HealthTimeoutSeconds = 120
)

$ErrorActionPreference = 'Stop'
Push-Location -LiteralPath $PSScriptRoot
try {
    # Recreate kills old Codex PTYs. Crewly has its own persistent Codex home,
    # so its refresh token never races with the Windows CLI.
    docker compose up -d --build --force-recreate
    if ($LASTEXITCODE -ne 0) { throw 'Không thể dựng lại Crewly.' }

    $deadline = (Get-Date).AddSeconds($HealthTimeoutSeconds)
    do {
        $health = docker inspect --format '{{.State.Health.Status}}' crewly 2>$null
        if ($LASTEXITCODE -eq 0 -and $health -eq 'healthy') { break }
        Start-Sleep -Seconds 3
    } while ((Get-Date) -lt $deadline)
    if ($health -ne 'healthy') { throw "Crewly chưa healthy sau $HealthTimeoutSeconds giây." }

    docker exec -it crewly codex login --device-auth
    if ($LASTEXITCODE -ne 0) { throw 'Đăng nhập Codex riêng cho Crewly chưa hoàn tất.' }
    docker exec crewly codex login status
    if ($LASTEXITCODE -ne 0) { throw 'Codex CLI trong Crewly chưa đăng nhập thành công.' }

    # `login status` only checks local sign-in state. A revoked refresh token can
    # still report "Signed in", so verify an actual model request before agents start.
    docker exec -w /home/node/project/AtelierX crewly codex exec --model gpt-6-luna --skip-git-repo-check --sandbox read-only 'Reply with exactly OK'
    if ($LASTEXITCODE -ne 0) { throw 'Đăng nhập có trong container nhưng model chưa trả lời. Kiểm tra quota của tài khoản trong Crewly; nếu token bị từ chối, đăng nhập lại Codex trong container.' }

    # The fallback service persists provider exhaustion across container restarts.
    # Clear only the Codex flag after a real successful model call, while the
    # service is stopped so it cannot write the stale state back.
    docker compose stop crewly
    if ($LASTEXITCODE -ne 0) { throw 'Không dừng được Crewly để cập nhật trạng thái quota cũ.' }
    docker compose run --rm --no-deps --entrypoint node crewly /home/node/project/crewly-docker/clear-stale-codex-quota.cjs
    if ($LASTEXITCODE -ne 0) { throw 'Không xóa được cờ quota Codex cũ.' }
    docker compose up -d
    if ($LASTEXITCODE -ne 0) { throw 'Không khởi động lại được Crewly.' }

    docker exec crewly node /home/node/project/crewly-docker/start-atelierx-team.cjs
    if ($LASTEXITCODE -ne 0) { throw 'Không khởi động được nhóm AtelierX.' }
    Write-Host 'Crewly đã đăng nhập Codex riêng và khởi động lại session AtelierX.'
} finally {
    Pop-Location
}
