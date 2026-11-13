---
name: Manage Ticket Spec
description: "Create or update project tickets with full structured descriptions, acceptance criteria, priority, and assignees adhering strictly to Crewly parser rules."
version: 1.0.0
category: task-management
skillType: claude-skill
assignableRoles:
  - team-leader
  - tpm
  - developer
  - frontend-developer
  - backend-developer
  - fullstack-dev
  - designer
  - qa
triggers:
  - create ticket
  - update ticket
  - ticket spec
  - detailed ticket
tags:
  - ticket
  - spec
  - task
  - management
execution:
  type: script
  script:
    file: execute.sh
    interpreter: bash
    timeoutMs: 30000
---

# Manage Ticket Spec Skill

Use this skill to create or update project tickets. It ensures that the ticket file:
1. Has a complete, comprehensive **Description** divided into 5 standard sections:
   - `### 1. Bối cảnh & Mục tiêu (Context & Goal)`
   - `### 2. Phạm vi kỹ thuật & Kiến trúc (Technical Scope)`
   - `### 3. Hợp đồng dữ liệu (Data Contracts)`
   - `### 4. Xử lý ngoại lệ & Trường hợp biên (Edge Cases)`
   - `### 5. Tiêu chuẩn bàn giao & Nghiệm thu (Deliverables)`
2. Strictly uses `###` (H3) for subheadings so Crewly's markdown parser never drops the description.
3. Contains actionable, testable `Acceptance criteria` (Given / When / Then).
4. Accurately sets `priority` (`P0`..`P3`), `assignee`, and `labels`.

## CLI Usage

```bash
# Update an existing ticket with full structured description
manage-ticket-spec update --id BBS-6 \
  --context "Kiểm thử E2E toàn bộ luồng đặt lịch cắt tóc và bảo vệ admin..." \
  --scope "Viết automated tests, kiểm tra race condition, kiểm tra restart..." \
  --contracts "Request booking -> 201 Created / 409 Conflict..." \
  --edge-cases "Đặt trùng giờ, đặt ngày quá khứ, token hết hạn..." \
  --deliverables "Báo cáo test matrix, defect report..."
```

