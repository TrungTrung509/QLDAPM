---
name: Post Team Chat
description: "Send a message to the team's group chat (#general) to delegate tasks, report completions, hand over work, or report blockers/bugs."
version: 1.0.0
category: communication
skillType: claude-skill
assignableRoles:
  - team-leader
  - tpm
  - designer
  - frontend-developer
  - backend-developer
  - fullstack-dev
  - qa
  - developer
triggers:
  - post team chat
  - group chat
  - chat group
  - report in group
  - delegate in group
  - handover in group
tags:
  - communication
  - chat
  - team
  - general
execution:
  type: script
  script:
    file: execute.sh
    interpreter: bash
    timeoutMs: 30000
---

# Post Team Chat Skill

Use this skill whenever you:
1. **Delegate a task**: Notify the recipient and the team in the group chat.
2. **Hand over work**: Hand over completed specifications, APIs, or designs to the next developer.
3. **Report task completion**: Notify the Team Leader and QA that your task is ready for review.
4. **Report bugs or blockers**: Alert the team immediately about critical issues or dependencies.
5. **Team discussions**: Post general architectural or progress updates.

## CLI Usage

```bash
# 1. Giao việc (Delegate)
bash execute.sh --type delegate --ticket BBS-2 --to "@UI UX Designer" --message "Bàn giao yêu cầu thiết kế UI cho luồng đặt lịch cắt tóc. Xem chi tiết tại ticket BBS-2."

# 2. Hoàn thành task (Complete)
bash execute.sh --type complete --ticket BBS-3 --to "@Team Leader @Tester" --message "Đã hoàn thành Schema DB SQLite và migrations. Sẵn sàng cho QA review."

# 3. Báo lỗi / Chặn việc (Bug / Blocker)
bash execute.sh --type bug --ticket BBS-4 --to "@BE Developer" --message "API /api/bookings trả về lỗi 500 khi trùng giờ hẹn. Cần BE fix gấp."

# 4. Review nghiệm thu (Review)
bash execute.sh --type review --ticket BBS-3 --to "@All" --message "Đã pass 100% 12 test cases cho Database schema."
```

## Options

| Flag | Short | Description |
|------|-------|-------------|
| `--message` | `-m` | Nội dung tin nhắn (Bắt buộc) |
| `--type` | `-t` | Loại tin nhắn: `delegate`, `handover`, `complete`, `bug`, `review`, `update` (Mặc định: `update`) |
| `--ticket` | | Mã ticket liên quan (VD: `BBS-1`, `BBS-2`) |
| `--to` | | Tên người nhận hoặc tag đồng nghiệp (VD: `@FE Developer`) |
| `--sender` | `-s` | Tên người gửi (Nếu để trống sẽ tự lấy từ session hiện tại) |
| `--channel`| `-c` | Kênh chat (Mặc định: `#general` của QLDA Team) |

