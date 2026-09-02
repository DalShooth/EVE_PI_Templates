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
- **Factory (P1→P2 / P2→P3 / P3→P4)**: advanced / high-tech factories with **two launchpad-array modes**:
  - `Efficiency` – 1 launchpad feeds every factory (link count = N)
  - `Long-maintenance` – 1 launchpad per input type (P1P2/P2P3 = 2, P3P4 = 3), every factory links to every pad (link count = K·N); the **no-maintenance span** (days until input runs out) is shown
  - Factory mode uses launchpad↔factory links only (no storage hub); routes are fully game-legal
- **5 layout topologies** (selectable):
  - `Full Star` – compact ring, every factory links directly (most robust)
  - `Hub Pair` – hub + paired factories
  - `Semi-Star` / `Serial (Legacy)` / `Hub (Line)` – legacy chain/line variants (use for mining; for factories a serial line makes far-end links much longer and is **not** recommended — see the length column)
- **Link accounting**: the link table shows **length (km)** and **per-link build + upgrade CPU/PG** per row; serial/line layouts are charged by real per-factory placement distance, so the data exposes when a topology is inefficient
- **Link version switch**: legacy (2022, base 250 m³/h) vs new (2026, base 1,250 m³/h) link capacity models, with upgrade-cost tables
- **ml-spacing aware layout**: factories are auto-spaced ≥ the minimum link distance so structures never overlap
- **Auto-fit factory count** to CCU/config (toggleable)
- English and Chinese UI versions (`pi_calculator_en.html` / `pi_calculator.html`)

### Reference operating points — radius 4390 km, CCU5 (budget 25415 CPU / 19000 PG), new link model
Default commodity volumes (P0 0.005 / P1 0.19 / P2 0.75 / P3 6 / P4 50 m³ — all editable). At these sizes every link sits on the base tier (≤ 1250 m³/h), so cost is dominated by structures + link count, not distance (except serial).

| Tier | Mode | Max N | Recommended N | CPU / PG @ rec | CPU% / PG% | No-maintenance @ rec | CCU 1–5 max N |
|---|---|---|---|---|---|---|---|
| P1→P2 | Efficiency | 19 | 18 | 20,004 / 17,598 | 79 / 93 | 1.5 d | 3 / 9 / 15 / 17 / 19 |
| P1→P2 | Long-maint (2 pads) | 13 | 12 | 22,850 / 15,363 | 90 / 81 | 9.1 d | − / 3 / 7 / 10 / 13 |
| P2→P3 | Efficiency | 19 | 18 | 20,004 / 17,598 | 79 / 93 | 1.5 d | 3 / 9 / 15 / 17 / 19 |
| P2→P3 | Long-maint (2 pads) | 13 | 12 | 22,850 / 15,363 | 90 / 81 | 9.3 d | − / 3 / 7 / 10 / 13 |
| P3→P4 | Efficiency | 14 | 12 | 21,625 / 8,282 | 85 / 44 | 0.3 d | − / 5 / 9 / 11 / 14 |
| P3→P4 | Long-maint (3 pads) | 6 | 5 | 22,331 / 7,577 | 88 / 40 | 6.9 d | − / − / 2 / 4 / 6 |

Takeaways:
- Efficiency is **PG-limited** (93–98% at max), Long-maintenance is **CPU-limited** (95–97% at max).
- Long-maintenance multiplies the no-maintenance span by ~6× (P1P2: 1.5 → 9 days at the recommended points) at the cost of ~2 pads + one extra link per factory.
- Prefer `Full Star` (compact ring, ~105 km links at N ≤ 12); at N ≥ 13 the ring is pushed outward to ~160 km. Do **not** use `Serial` for factory planets — the far end of a 4390 km serial chain is ~900 km away.

### Radius effect (full sweep 2,000–14,000 km, step 500, CCU2–5)
Full numeric sweep: [`radius_sweep_ccu2-5.csv`](radius_sweep_ccu2-5.csv) (500 rows). Max structurally-feasible factory count N (CPU/PG at that N, budget usage %, no-maintenance days, link count, and representative/farthest link length per row). Cells below show max N at r=2,000 km and each radius where N steps down (`x → y @ r≥…km`).

| CCU | P1P2 Eff (ring) | P1P2 Long (2 pads) | P1P2 Eff (serial) | P3P4 Eff | P3P4 Long (3 pads) |
|---|---|---|---|---|---|
| 2 | 9 | 3 | 9 →8 @3.5k →7 @10k | 5 | 0 (pads only) |
| 3 | 15 →14 @5k | 7 | 14 →13 @3.5k →12 @6.5k →11 @10.5k | 9 →8 @7k | 2 |
| 4 | 17 →16 @9k | 11 →10 @2.5k | 16 →15 @5k →14 @8.5k →13 @12.5k | 11 | 4 |
| 5 | 19 →18 @9k | 14 →13 @4k →12 @14k | 18 →17 @4.5k →16 @7k →15 @10.5k | 14 | 6 →5 @13.5k |

Takeaways:
- Cost is dominated by structures + the fixed link upgrade tier (Lv0 366 CPU / 206 PG); **radius only raises the linear "build" term** (per link +0.2 CPU / +0.15 PG per km). On a compact ring (link ≈ 0.024·r, up to 0.038·r as N grows), total CPU/PG move only a few percent across the whole 2,000–14,000 km range — N steps down by 1–3 near the largest radii.
- `Serial` behaves differently: far-end links grow as ≈(0.05+0.013(i−1))·r, so it loses N steadily and becomes PG-starved (e.g. CCU5 r=14,000: 15 factories at 99% PG vs 18 on the ring) — another reason to keep factory planets on `Full Star`.

### Why shared / ring-connect links are usually MORE expensive (counter-intuitive)
People assume fewer links = cheaper, so a factory ring that daisy-chains ("few pipes") should beat one direct link per factory. It usually does **not**, because EVE link cost is not a function of link count but of **flow × hops × per-hop capacity price**:

- **Direct** (each factory one link to the launchpad): each factory's goods travel **1 hop**, per-factory flow is decoupled, and every link stays on the base tier (≤ 1,250 m³/h → Lv0, 366/206). Aggregate capacity demand ≈ O(N).
- **Ring/chain** (factories interconnected, one return to the pad): a segment near the pad relays **every** downstream factory, so segment flow = m × single-factory flow and total demand = single-flow × N(N+1)/2 ≈ **O(N²)** — each shipment occupies capacity on every hop it crosses. Sharing doesn't amortize; it compounds.
- Capacity is tiered (Lv0 1,250 → Lv1 2,500 → Lv2 5,000 → …), so once the pad-side segment exceeds 1,250 m³/h that segment jumps 366 → 598 → 853… and every extra factory adds another escalated segment.

Link-upgrade CPU (P3P4, per-factory 158 m³/h, radius 4390): direct vs chain —

| N | Direct (all Lv0) | Chain | Delta |
|---|---|---|---|
| 8 | 2,928 | 3,160 | +232 |
| 13 | 4,758 | 6,150 | +1,392 |
| 19 | 6,954 | 10,758 | +3,804 (+55%) |

The only regime where the ring/chain wins is when flows are so small that **no segment reaches the 1,250 m³/h tier** (N × single-factory flow ≤ 1,250): upgrades stay identical and the ring's short chords beat the longer spokes by a few percent. Otherwise direct wins, and the gap widens super-linearly with N and flow. Practical bottom line: **one direct link per factory keeps every link at base tier (O(N), 1 hop each) and is the structurally cheapest and safest choice for factory planets.**

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
- **工厂（P1→P2 / P2→P3 / P3→P4）**：高级厂 / 高科技厂，**发射台阵列双模式**：
  - `效率模式` —— 单发射台直供全部厂（链路数 = N）
  - `长维护模式` —— 每输入类型 1 台（P1P2/P2P3 = 2、P3P4 = 3），每厂连全部台（链路数 = K·N），并给出**免维护天数**（输入耗尽前可离线多久）
  - 工厂只用 发射台↔工厂 路由（无仓库中转），路由全部游戏合法
- **5 种布局拓扑**（可选）：
  - `全直连` —— 紧凑环布、每厂直连（最鲁棒）
  - `枢纽成对` / `半星型` / `串联式（旧）` / `枢纽式（线）` —— 串联/线性变体（矿点适用；工厂层串联会显著拉长远端链路，**不建议**，见长度列）
- **链路核算**：链路表逐行显示**长度(km)**与**单条建造+升级 CPU/PG**；串联/线性按真实逐厂布点距离计费，数据可直接暴露低效拓扑
- **链路版本切换**：旧版（2022，基础 250 m³/h）与新版（2026，基础 1,250 m³/h）链路容量模型及升级成本表
- **ml 间距自适应布局**：工厂自动保持 ≥ 最小结构间距，避免重叠
- **工厂数自动适配 CCU/配置**（可开关）
- 中英双语界面（`pi_calculator_en.html` / `pi_calculator.html`）

### 参考档位 —— 半径 4390 km、CCU5（预算 25415 CPU / 19000 PG）、新版链路
默认体积口径（P0 0.005 / P1 0.19 / P2 0.75 / P3 6 / P4 50 m³，均可编辑）。该尺寸下每条链路都在基础档（≤ 1250 m³/h），成本主要由结构与链路条数决定（串联除外，受距离影响）。

| 层级 | 模式 | 上限 N | 推荐 N | 推荐 N 的 CPU/PG | CPU% / PG% | 推荐 N 免维护 | CCU1–5 上限 N |
|---|---|---|---|---|---|---|---|
| P1→P2 | 效率 | 19 | 18 | 20,004 / 17,598 | 79 / 93 | 1.5 天 | 3 / 9 / 15 / 17 / 19 |
| P1→P2 | 长维护(2台) | 13 | 12 | 22,850 / 15,363 | 90 / 81 | 9.1 天 | − / 3 / 7 / 10 / 13 |
| P2→P3 | 效率 | 19 | 18 | 20,004 / 17,598 | 79 / 93 | 1.5 天 | 3 / 9 / 15 / 17 / 19 |
| P2→P3 | 长维护(2台) | 13 | 12 | 22,850 / 15,363 | 90 / 81 | 9.3 天 | − / 3 / 7 / 10 / 13 |
| P3→P4 | 效率 | 14 | 12 | 21,625 / 8,282 | 85 / 44 | 0.3 天 | − / 5 / 9 / 11 / 14 |
| P3→P4 | 长维护(3台) | 6 | 5 | 22,331 / 7,577 | 88 / 40 | 6.9 天 | − / − / 2 / 4 / 6 |

要点：
- 效率模式被 **PG** 卡住（满配 93–98%）；长维护被 **CPU** 卡住（95–97%）。
- 长维护用 ~2 台发射台 + 每厂多 1 条链路，把免维护时长拉长约 6 倍（P1P2 推荐点：1.5 → 9 天）。
- 工厂推荐 `全直连` 紧凑环（N≤12 链路 ~105 km；N≥13 环被推到 ~160 km）；4390 半径下 **串联末段厂距发射台簇可达 ~900 km**，工厂行星勿用串联。

### 半径影响（全扫描 2000–14000 km，步进 500，CCU2–5）
完整数值表见 [`radius_sweep_ccu2-5.csv`](radius_sweep_ccu2-5.csv)（500 行）。每行给该半径/CCU/组合下的结构可行最大厂数 N，及对应 CPU/PG、对预算占用 %、免维护天、链路条数、代表/最远链路长。下表每格为 r=2000 时的 N 及发生掉档的半径（`x → y @ r≥…km`）。

| CCU | P1P2 效率(环) | P1P2 长维护(2台) | P1P2 效率(串联) | P3P4 效率 | P3P4 长维护(3台) |
|---|---|---|---|---|---|
| 2 | 9 | 3 | 9 →8 @3.5k →7 @10k | 5 | 0（只剩发射台） |
| 3 | 15 →14 @5k | 7 | 14 →13 @3.5k →12 @6.5k →11 @10.5k | 9 →8 @7k | 2 |
| 4 | 17 →16 @9k | 11 →10 @2.5k | 16 →15 @5k →14 @8.5k →13 @12.5k | 11 | 4 |
| 5 | 19 →18 @9k | 14 →13 @4k →12 @14k | 18 →17 @4.5k →16 @7k →15 @10.5k | 14 | 6 →5 @13.5k |

结论：
- 成本主体是结构 + 链路固定基础升级（Lv0 366 CPU / 206 PG）；**半径只线性抬升“建造”项**（每链路 +0.2 CPU / +0.15 PG × km）。紧凑环（链路 ≈ 0.024·r，N 增大至多 0.038·r）下，全 2000–14000 km 区间 CPU/PG 总耗仅变动几个百分点，N 只在最大半径段掉 1–3 档。
- `串联` 不同：远端链路长 ≈(0.05+0.013(i−1))·r，随半径 N 持续走低且被 PG 饿死（如 CCU5 r=14000：串联 15 厂已 99% PG，环布还能 18 厂）——工厂行星保持 `全直连` 的又一理由。

### 为什么"环状/逐级互连共享链路"通常反而更费（反直觉）
直觉是"管线少 = 省料"，于是工厂互相逐级连成环、单点回台，应比"每厂一条直连"省。但多数情况下并不省，因为 EVE 链路成本不是看条数，而是看 **流量 × 跳数 × 每跳容量单价**：

- **直连**（每厂 1 条到发射台）：每厂一份货只走 **1 跳**，流量彼此解耦，每条链路永远停在基础档（≤ 1,250 m³/h → Lv0，366/206）。总链路容量需求 ≈ **O(N)**。
- **环/链**（厂厂相连、单点回台）：靠台那一段要替**下游所有厂**中继，段流量 = m × 单厂流，各段累加 = 单厂流 × N(N+1)/2 ≈ **O(N²)** —— 同一份货每过一个跳点就重新占一次容量。共享没有摊销，反而放大成平方级。
- 容量按档跳涨（Lv0 1250 → Lv1 2500 → Lv2 5000 → …），靠台段一旦超 1,250 就 366 → 598 → 853…，每多一个厂就多一段被迫升档。

链路升级 CPU 对比（P3P4、单厂 158 m³/h、r=4390）：直连 vs 链式

| N | 直连(全 Lv0) | 链式 | 差距 |
|---|---|---|---|
| 8 | 2,928 | 3,160 | +232 |
| 13 | 4,758 | 6,150 | +1,392 |
| 19 | 6,954 | 10,758 | +3,804（+55%） |

环/链只在一种区间才赢：**任何一段都摸不到 1250 档**（N × 单厂流 ≤ 1250）时升级档位与直连相同，此时环边弦(短)比辐条(长)略省几个百分点；否则直连胜，且差距随 N 与流量**超线性扩大**。实用结论：**每厂一条直连 = 链路全停基础档（O(N)、每份货 1 跳），是工厂行星结构性最省、最不易超预算的布法。**

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
| `radius_sweep_ccu2-5.csv` | 半径 2000–14000 km × CCU2–5 工厂核算扫描（radius × CCU × mode sweep data） |

## License / 许可

Refer to the repository root license.
