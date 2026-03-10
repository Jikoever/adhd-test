# ADHD Bingo - Stop thinking, start clicking

## Product Vision
为 ADHD 人群提供低负担、即时反馈的任务游戏化工具。  
核心目标是把“开始困难”变成“点击即行动”。

## Phase 1: Bingo Core (MVP)
- [x] 任务输入：手动添加 + 随机任务池
- [x] 棋盘尺寸：3x3 / 4x4 / 5x5
- [x] Bingo 判定：横/竖/斜连线即触发 Bingo
- [x] 基础持久化：Supabase 保存账号与每日 Bingo 次数
- [x] 统计页：Calendar 按天查看 Bingo 历史

## Phase 2: ADHD Reinforcement (Current Focus)
- [x] Bingo 视觉庆祝：接入 `canvas-confetti`（并保留降级方案）
- [x] 任务完成音效：短促 “ding” 音（Web Audio）
- [x] Bingo 音效：上行音阶 + 全屏庆祝
- [ ] 音效开关（Mute / Unmute）
- [ ] 主题和白噪音播放器（Zen Environments）

## Phase 3: AI Task Breakdown (Pro)
- [ ] “AI 拆解”按钮
- [ ] 大任务自动拆分为 5 个可执行小任务
- [ ] Pro 权限控制与配额

## Auth / Data Plan
- [x] 已迁移到 Supabase Auth 原生方案
  - [x] 邮箱密码登录
- 下一步：
  - 邮箱 OTP / Passwordless
  - RLS 策略按 `auth.uid()` 控制数据访问

## UI/UX Guardrails (ADHD Friendly)
- Mobile first，单手可点，按钮留足触控空间
- 主色：Forest Green + Cream White，降低视觉噪声
- 只显示当前关键操作，减少分散注意力元素
- 所有正反馈尽量 “短、快、明确”

## Suggested Next Milestones
1. 完善 Supabase Email 登录体验（确认邮件文案、错误提示）  
2. 增加音效开关 + 白噪音播放器  
3. 接入 AI 拆解 API（先英文，再多语言）
