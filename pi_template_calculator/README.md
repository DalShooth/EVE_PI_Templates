# EVE PI Template Limit Calculator

A standalone, offline HTML tool for planning and generating **EVE Online Planetary Industry (PI)** templates — from P0 mining colonies to P4 factory planets.

---

## English

### What it does
Given your skill level (Command Center Upgrades), planet size, layout, and target product, the calculator:

- Checks **CPU / Powergrid** feasibility against the CCU budget
- Detects **link throughput bottlenecks** (m³/h vs link capacity) and suggests **link upgrade levels**
- Shows **max factory count** per CCU level 0–5 (auto-fit to your CCU/skill)
- For mining colonies: estimates **P0 supply vs factory demand** and buffer days
- **Exports / copies** a ready-to-import template JSON (byte-compatible with the in-game export format)

### Features
- **Mining (P0→P1)**: extractor + extractor heads + P1 factories + storage + launchpad
- **Factory (P1→P2 / P2→P3 / P3→P4)**: advanced / high-tech factories on a launchpad hub
- **5 layout topologies** (selectable):
  - `Full Star` – each factory links directly to storage + launchpad (most robust)
  - `Hub Pair` – storage/launchpad hub, factories attach in pairs (fewer links, rarely needs upgrades)
  - `Semi-Star` – factories link to storage, P1 via storage→launchpad
  - `Serial (Legacy)` – factories daisy-chained (concentrated flow)
  - `Hub (Line)` – hub topology laid out in a line
- **Link version switch**: legacy (2022, base 250 m³/h) vs new (2026, base 1,250 m³/h) link capacity models, with upgrade-cost tables
- **Min-spacing aware layout**: factories are auto-spaced ≥ the minimum link distance so structures never overlap
- **Auto-fit factory count** to CCU/config (toggleable)

### How to use
1. Open `pi_calculator_en.html` (English)
2. Select your CCU level (0–5) from "Command Center Level"
3. Choose **Mode**: Mining (P0 extraction) or Factory (P1/P2/P3/P4 processing)
4. For Mining: select extractor count, heads per extractor, and expected P0 yield
5. For Factory: choose target product and factory count
6. Set **Planet Radius** (km) and **Layout** (Star/Chain, Full/Hub/Semi/Serial)
7. Click **"Export Template JSON"** to download or **"Copy JSON"** to paste into the game

The tool validates CPU/Powergrid budget, flags bottlenecks, and auto-estimates if you want.

### Data Included
- All P0 mining recipes (14 types)
- All P1→P2 products (22 types)
- All P2→P3 products (22 types)
- All P3→P4 products (8 types)
- Planet-specific structure type IDs (Barren, Temperate, Ice, Gas, Oceanic, Lava, Storm, Plasma)
- Link upgrade tiers (legacy & 2026 new version)
- CPU/Powergrid budgets for CCU 0–5

### Example: P2 Factory on Barren
1. Mode: **Factory**, Tier: **P1→P2**, Product: **Consumer Electronics**
2. CCU: **5**, Radius: **10,000 km**
3. Factory count: **10** (auto-fit on)
4. Layout: **Star → Full Star**
5. Export → Copy to in-game Planetary Industry template editor
6. Check results: CPU 14,241 / 18,600 (OK), PG 11,889 / 19,000 (OK), No bottlenecks

---

## 中文 (Chinese)

### 功能
给定你的技能等级（命令中心升级），行星大小，布局和目标产品，计算器可以：

- 检查 **CPU/电力网格** 可行性（对比 CCU 预算）
- 检测 **链接吞吐量瓶颈** (m³/h vs 链容量) 并建议 **链接升级等级**
- 显示每个 CCU 等级 0–5 的 **最大工厂数** (自动适配到你的 CCU/技能)
- 对于采矿殖民地：估算 **P0 供应 vs 工厂需求** 和缓冲天数
- **导出/复制** 现成的模板 JSON (与游戏内导出格式字节兼容)

### 特性
- **采矿 (P0→P1)**: 采集器 + 采集头 + P1 工厂 + 存储 + 发射台
- **工厂 (P1→P2 / P2→P3 / P3→P4)**: 先进/高科技工厂在发射台中心
- **5 种拓扑**（可选）:
  - `Full Star` – 每个工厂直接连接到存储+发射台 (最稳定)
  - `Hub Pair` – 存储/发射台中心，工厂成对连接 (更少链接，通常不需要升级)
  - `Semi-Star` – 工厂连接到存储，P1 通过存储→发射台
  - `Serial (Legacy)` – 工厂菊花链 (集中流)
  - `Hub (Line)` – 中心拓扑按线性排列
- **链接版本切换**: 旧版 (2022, 基础 250 m³/h) vs 新版 (2026, 基础 1,250 m³/h) 链接容量模型，带升级成本表
- **最小间距感知布局**: 工厂自动间隔 ≥ 最小链接距离，结构永不重叠
- **自动调整工厂数** 到 CCU/配置 (可切换)

### 如何使用
1. 打开 `pi_calculator.html` (中文)
2. 从"命令中心等级"选择你的 CCU 等级 (0–5)
3. 选择 **模式**: 采矿 (P0 提取) 或 工厂 (P1/P2/P3/P4 加工)
4. 采矿模式: 选择采集器数量，每个采集器的头数，和预期 P0 产率
5. 工厂模式: 选择目标产品和工厂数
6. 设置 **行星半径** (公里) 和 **布局** (Star/Chain, Full/Hub/Semi/Serial)
7. 点击 **"导出模板 JSON"** 下载或 **"复制 JSON"** 粘贴到游戏

计算器验证 CPU/电力网格预算，标记瓶颈，并自动估算（如果你想要的话）。

---

## Files
- `pi_calculator_en.html` – Full calculator in English
- `pi_calculator.html` – Full calculator in Chinese (simplified)
- `README.md` – This file

## Browser Compatibility
Works in any modern browser (Chrome, Firefox, Safari, Edge). No server required — run locally offline.

## Data Sources
- EVE University wiki (Planetary Industry buildings, structure IDs)
- ESI type data (structure costs, link types)
- Game mechanics (CPU/PG budgets, link capacity tiers)
