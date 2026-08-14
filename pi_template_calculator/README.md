# EVE PI Template Limit Calculator

A standalone, offline HTML tool for planning and generating **EVE Online Planetary Industry (PI)** templates — from P0 mining colonies to P4 factory planets.

一个独立的、离线可用的 HTML 工具，用于规划和生成《EVE Online》行星工业（PI）模板——从 P0 矿点到 P4 工厂行星。

---

## English / English

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
- **ml-spacing aware layout**: factories are auto-spaced ≥ the minimum link distance so structures never overlap
- **Auto-fit factory count** to CCU/config (toggleable)
- English and Chinese UI versions (`pi_calculator_en.html` / `pi_calculator.html`)

### How to use
1. Open `pi_calculator_en.html` (or `pi_calculator.html`) in any browser — no server, no dependencies, fully offline.
2. Set your Command Center level, planet radius, layout, target product, etc.
3. Review CPU/PG, link bottlenecks, and max-factory suggestions.
4. Click **Copy JSON to Clipboard** (test in-game) or **Export Template JSON** (save file).
5. In-game: put the `.json` into `Documents/EVE/PlanetaryInteractionTemplates`, then refresh your template list.
   - Mining templates still require setting extractor heads and the ECU→storage route in-game (CCP mechanic).

### Data sources
- EVE University wiki (Planetary buildings / Setting up a planetary colony / Planetary Industry)
- ESI type data (structure IDs, commodity IDs, volumes)
- Cross-validated against the README tables in this repository

---

## 中文 / Chinese

### 功能简介
根据你的技能等级（指挥中心升级）、行星尺寸、布局与目标产物，计算器会：

- 对照 CCU 预算检查 **CPU / 电力（PG）** 是否可行
- 检测**链路吞吐瓶颈**（m³/h 与链路容量对比），并给出**链路升级等级**建议
- 给出 **CCU 0-5 各等级的最大厂数**（可自动适配你的 CCU/配置）
- 矿点模式下估算 **P0 产量与工厂需求**是否匹配、缓冲可用天数
- **导出 / 复制** 可直接导入游戏的模板 JSON（与游戏导出格式逐字节兼容）

### 功能特性
- **矿点（P0→P1）**：采集器 + 提取头 + P1 工厂 + 仓库 + 发射台
- **工厂（P1→P2 / P2→P3 / P3→P4）**：高级厂 / 高科技厂，发射台枢纽
- **5 种布局拓扑**（可选）：
  - `全直连` —— 每厂直连仓库+发射台（最鲁棒）
  - `枢纽成对` —— 仓库/发射台为枢纽，工厂成对挂接（链路少、通常免升级）
  - `半星型` —— 工厂直连仓库，P1 经仓库→发射台
  - `串联式（旧）` —— 工厂一线接力（流量集中）
  - `枢纽式（线）` —— 枢纽拓扑线性排布
- **链路版本切换**：旧版（2022，基础 250 m³/h）与新版（2026，基础 1,250 m³/h）链路容量模型及升级成本表
- **ml 间距自适应布局**：工厂自动保持 ≥ 最小结构间距，避免重叠
- **工厂数自动适配 CCU/配置**（可开关）
- 中英双语界面（`pi_calculator_en.html` / `pi_calculator.html`）

### 使用方法
1. 用任意浏览器打开 `pi_calculator.html`（或英文版）——无需服务器、无依赖、可离线。
2. 设置指挥中心等级、行星半径、布局、目标产物等。
3. 查看 CPU/PG、链路瓶颈与最大厂数建议。
4. 点 **复制 JSON 到剪贴板**（游戏内先测试）或 **导出模板 JSON**（保存文件）。
5. 游戏内把 `.json` 放入 `Documents/EVE/PlanetaryInteractionTemplates`，刷新模板列表即可。
   - 矿点模板仍需在游戏内自行设置提取头与 采集器→仓库 路线（CCP 机制）。

### 数据来源
- EVE University 维基（Planetary buildings / Setting up a planetary colony / Planetary Industry）
- ESI 类型数据（建筑 ID、物品 ID、体积）
- 与本仓库 README 表反推交叉验证一致

---

## Files / 文件

| File | Description / 说明 |
|-|-|
| `pi_calculator.html` | 中文版（Chinese UI） |
| `pi_calculator_en.html` | 英文版（English UI） |
| `悬浮等离子.json` | 示例：国服矿点模板（CN mining template example） |
| `消费级电器.json` | 示例：国服 P2 工厂模板（CN P2 factory template example） |

## License / 许可

Refer to the repository root license.
