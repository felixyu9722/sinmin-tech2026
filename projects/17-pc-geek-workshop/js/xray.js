/**
 * 独中高中资讯科技 - 电脑硬件互动教育游戏
 * 微观原理透视与存储层次速度天梯引擎 (X-Ray & Speed Ladder)
 * 1. 冯·诺依曼指令周期 (Fetch ➔ Decode ➔ Execute ➔ Store) 完整数据路线重构：
 *    - 彻底修正写回总线 (Store / Writeback): 起点严谨锚定为右上角 ALU 累加器 ACC，终点精准流向左下角目标寄存器 R1
 *    - 彻底重构执行通路 (Execute): 由左下角寄存器 R1、R2 沿内部数据总线平滑流向右上角运算器 ALU
 *    - 彻底重构取指通路 (Fetch): 由顶部外部主存储器 RAM 垂直注入指令寄存器 IR，PC 自动递增
 *    - 彻底重构译码通路 (Decode): 由指令寄存器 IR 向上注入控制单元 CU 指令译码器，触发时序微指令
 *    - 全程采用 3.8s 教学慢速（2.0s 粒子平滑滑翔 + 1.8s 部件解析驻留），支持单步步进、暂停与速度切换
 *    - 新增四阶段顶层导航步进器 (Stepper Bar) 与 物理总线永久导轨及图例
 * 2. 存储层次速度大对决 (Cache vs RAM vs Virtual Memory/M.2 NVMe vs SATA SSD vs SATA HDD)
 * 3. CPU vs GPU 并行对决
 */

class XRayEngine {
    constructor() {
        this.currentTab = 'cpu'; // 'cpu' | 'storage' | 'gpu'
        this.isAutoPlaying = false;
        this.isPaused = false;
        this.currentStep = 0; // 0: 就绪, 1: Fetch, 2: Decode, 3: Execute, 4: Store
        this.stepDuration = 3800; // 教学慢速模式 (3.8秒/步)
        this.glideDuration = 2000; // 激光粒子沿线平滑飞行时间 (2.0秒)
        this.activeTimer = null;
        this.animFrameId = null;
        this.resizeObserver = null;
    }

    init() {
        this.bindEvents();
        this.renderCurrentView();
        window.addEventListener('resize', () => {
            if (this.currentTab === 'cpu') {
                this.updateActivePathCoords();
            }
        });
    }

    bindEvents() {
        const navBtns = document.querySelectorAll('.xray-nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                this.stopFdeAnimation();
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTab = btn.dataset.xray;
                this.renderCurrentView();
            });
        });
    }

    stopFdeAnimation() {
        if (this.activeTimer) {
            clearTimeout(this.activeTimer);
            this.activeTimer = null;
        }
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        this.isAutoPlaying = false;
        this.isPaused = false;
    }

    renderCurrentView() {
        const container = document.getElementById('xray-content-stage');
        if (!container) return;

        if (this.currentTab === 'cpu') {
            this.renderCpuAnatomy(container);
        } else if (this.currentTab === 'storage') {
            this.renderStorageHierarchy(container);
        } else if (this.currentTab === 'gpu') {
            this.renderGpuVsCpu(container);
        }
    }

    // 获取元素相对于容器的绝对几何中心与边缘坐标 (100% 动态精准计算，杜绝错位)
    getCoords(el, container) {
        if (!el || !container) return { x: 100, y: 100, top: 100, bottom: 100, left: 100, right: 100, w: 20, h: 20 };
        const r = el.getBoundingClientRect();
        const c = container.getBoundingClientRect();
        if (c.width === 0) {
            return { x: 100, y: 100, top: 100, bottom: 100, left: 100, right: 100, w: 20, h: 20 };
        }
        return {
            x: Math.round(r.left - c.left + r.width / 2),
            y: Math.round(r.top - c.top + r.height / 2),
            top: Math.round(r.top - c.top),
            bottom: Math.round(r.bottom - c.top),
            left: Math.round(r.left - c.left),
            right: Math.round(r.right - c.left),
            w: Math.round(r.width),
            h: Math.round(r.height)
        };
    }

    // 1. CPU 内部微架构与机器指令周期演示
    renderCpuAnatomy(container) {
        this.currentStep = 0;
        this.stopFdeAnimation();

        container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.1rem;">
            
            <!-- 头部说明与操作控制栏 -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.85rem;">
                <div>
                    <h3 style="color:#ffffff; font-size:1.15rem; font-weight:700; display:flex; align-items:center; gap:0.5rem;">
                        <span>🔬</span> CPU 内部微架构与指令执行周期 (Machine Cycle)
                    </h3>
                    <p style="color:var(--text-secondary); font-size:0.8rem; margin-top:2px;">
                        生动呈现物理总线与数据流向：主存储器 (RAM) ➔ 指令寄存器 (IR) ➔ 控制单元 (CU) ➔ 运算器 (ALU) ➔ 写回寄存器 (R1)
                    </p>
                </div>

                <!-- 执行控制按钮组 (支持自动连续演示、单步步进、暂停与速度调节) -->
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
                    <button id="btn-auto-fde" class="ctrl-btn" style="background:linear-gradient(135deg, rgba(0,243,255,0.25), rgba(0,245,155,0.3)); border-color:var(--cyan-primary); color:#ffffff; font-weight:bold; padding:0.55rem 1.15rem;">
                        <span>▶</span> 自动连续演示
                    </button>
                    <button id="btn-pause-fde" class="ctrl-btn" style="background:rgba(30,41,59,0.8); border-color:#f59e0b; color:#fbbf24; font-size:0.82rem; display:none;">
                        <span>⏸️</span> 暂停
                    </button>
                    <button id="btn-step-next" class="ctrl-btn" style="background:rgba(30,41,59,0.8); border-color:#38bdf8; color:#38bdf8; font-size:0.82rem;">
                        <span>⏭️</span> 单步执行
                    </button>
                    <button id="btn-reset-fde" class="ctrl-btn" style="background:rgba(30,41,59,0.8); border-color:#94a3b8; color:#cbd5e1; font-size:0.82rem;">
                        <span>🔄</span> 重置
                    </button>
                    <button id="btn-fde-speed" class="ctrl-btn" style="border-color:#fbbf24; color:#fbbf24; font-size:0.78rem;">
                        <span>🐢</span> 速度: 慢速 (3.8s)
                    </button>
                </div>
            </div>

            <!-- 四阶段机器周期顶层步进指示条 (Stepper Bar) -->
            <div class="fde-stepper-bar">
                <div class="fde-step-pill" id="pill-step-1" data-step="1" title="点击跳转至第 1 阶段：取指">
                    <span class="pill-badge">1</span>
                    <div class="pill-info">
                        <span class="pill-title">取指 (Fetch)</span>
                        <span class="pill-desc">RAM ➔ IR</span>
                    </div>
                </div>
                <div class="fde-step-arrow">➔</div>
                <div class="fde-step-pill" id="pill-step-2" data-step="2" title="点击跳转至第 2 阶段：译码">
                    <span class="pill-badge">2</span>
                    <div class="pill-info">
                        <span class="pill-title">译码 (Decode)</span>
                        <span class="pill-desc">IR ➔ CU 译码器</span>
                    </div>
                </div>
                <div class="fde-step-arrow">➔</div>
                <div class="fde-step-pill" id="pill-step-3" data-step="3" title="点击跳转至第 3 阶段：执行">
                    <span class="pill-badge">3</span>
                    <div class="pill-info">
                        <span class="pill-title">执行 (Execute)</span>
                        <span class="pill-desc">R1,R2 ➔ ALU</span>
                    </div>
                </div>
                <div class="fde-step-arrow">➔</div>
                <div class="fde-step-pill" id="pill-step-4" data-step="4" title="点击跳转至第 4 阶段：写回">
                    <span class="pill-badge">4</span>
                    <div class="pill-info">
                        <span class="pill-title">写回 (Store)</span>
                        <span class="pill-desc">ACC ➔ 寄存器 R1</span>
                    </div>
                </div>
            </div>

            <!-- CPU 芯片内部架构视觉舞台 (集成动态总线 SVG 画布) -->
            <div id="cpu-diagram-box" style="background:#090d16; border:1px solid rgba(0,243,255,0.25); border-radius:var(--radius-lg); padding:1.4rem; position:relative; box-shadow:inset 0 0 30px rgba(0,0,0,0.85); overflow:hidden;">
                
                <!-- 顶部外部总线交互通道：外部主存储器 (RAM) -->
                <div id="node-ram-box" style="display:flex; justify-content:space-between; align-items:center; background:#101726; border:1px dashed #334155; padding:0.75rem 1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem; position:relative; z-index:5;">
                    <div style="font-size:0.85rem; color:#94a3b8; font-family:var(--font-mono); display:flex; align-items:center; gap:0.6rem; position:relative;">
                        <span>外部主存储器 (RAM):</span>
                        <span id="fde-ram-data" style="color:#00f59b; font-weight:bold; background:rgba(0,245,155,0.15); border:1px solid rgba(0,245,155,0.3); padding:4px 12px; border-radius:4px; position:relative;">
                            [0x0040]: ADD R1, R2
                            <!-- 物理引出端口 -->
                            <span id="port-ram-out" class="bus-port-dot cyan" style="bottom:-5px; left:50%; transform:translateX(-50%);"></span>
                        </span>
                    </div>
                    <div id="fde-bus-indicator" style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono);">
                        系统总线待命中...
                    </div>
                </div>

                <!-- 芯片内部四大核心部件 (微架构 2x2 网格) -->
                <div id="die-grid-box" style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; position:relative; z-index:5;">
                    
                    <!-- 左列：控制单元 CU (上) 与 高频寄存器组 Registers (下) -->
                    <div style="display:flex; flex-direction:column; gap:1.25rem;">
                        
                        <!-- 控制单元 CU (左上) -->
                        <div id="die-cu" class="die-block" style="border:1px solid rgba(176,102,255,0.3); position:relative;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div class="die-block-title" style="color:#b066ff;">控制单元 (Control Unit - CU)</div>
                                <span style="font-size:1.3rem;">🧠</span>
                            </div>
                            <div class="die-block-desc">大脑总指挥部：译码操作码、发出时序控制脉冲、指挥各部件协同。</div>
                            <div id="cu-status" style="margin-top:8px; font-size:0.75rem; font-family:var(--font-mono); color:#94a3b8;">状态: 空闲 (IDLE)</div>
                            
                            <!-- 译码总线输入端口 (底端) -->
                            <span id="port-cu-in" class="bus-port-dot purple" style="bottom:-5px; left:35%;" title="CU 指令译码输入端口"></span>
                        </div>

                        <!-- 寄存器组 Registers (左下) -->
                        <div id="die-reg" class="die-block" style="border:1px solid rgba(56,189,248,0.3); position:relative;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div class="die-block-title" style="color:#38bdf8;">高频通用寄存器组 (Registers)</div>
                                <span style="font-size:1.3rem;">⏱️</span>
                            </div>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px; font-size:0.72rem; font-family:var(--font-mono);">
                                <div id="reg-box-pc" style="background:#090d16; padding:6px 8px; border-radius:4px; border:1px solid #1e293b; position:relative;">
                                    PC (计数器): <span id="reg-pc" style="color:#38bdf8; font-weight:bold;">0x0040</span>
                                </div>
                                <div id="reg-box-ir" style="background:#090d16; padding:6px 8px; border-radius:4px; border:1px solid #1e293b; transition:all 0.3s ease; position:relative;">
                                    IR (指令暂存): <span id="reg-ir" style="color:#38bdf8; font-weight:bold;">---</span>
                                    <!-- IR 输入端口 (顶端) -->
                                    <span id="port-ir-in" class="bus-port-dot cyan" style="top:-5px; left:50%; transform:translateX(-50%);" title="IR 指令输入端"></span>
                                </div>
                                <div id="reg-box-r1" style="background:#090d16; padding:6px 8px; border-radius:4px; border:1px solid #1e293b; transition:all 0.3s ease; position:relative;">
                                    R1 (操作数A): <span id="val-r1" style="color:#fbbf24; font-weight:bold;">15</span>
                                    <!-- R1 写回总线输入端口 (底端精准接收 ACC 写回) -->
                                    <span id="port-r1-in" class="bus-port-dot green" style="bottom:-5px; left:50%; transform:translateX(-50%);" title="R1 专属写回接收端口"></span>
                                </div>
                                <div id="reg-box-r2" style="background:#090d16; padding:6px 8px; border-radius:4px; border:1px solid #1e293b; position:relative;">
                                    R2 (操作数B): <span id="val-r2" style="color:#fbbf24; font-weight:bold;">27</span>
                                </div>
                            </div>
                            <!-- 通用操作数输出端口 (右侧，向 ALU 发送操作数) -->
                            <span id="port-reg-out" class="bus-port-dot gold" style="right:-5px; top:65%;" title="寄存器组操作数输出端口"></span>
                        </div>
                    </div>

                    <!-- 右列：算术逻辑单元 ALU (右上) 与 高速缓存 Cache (右下) -->
                    <div style="display:flex; flex-direction:column; gap:1.25rem;">
                        
                        <!-- 算术逻辑单元 ALU (右上) -->
                        <div id="die-alu" class="die-block" style="border:1px solid rgba(251,191,36,0.3); position:relative;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div class="die-block-title" style="color:#fbbf24;">算术逻辑单元 (ALU)</div>
                                <span style="font-size:1.3rem;">⚡</span>
                            </div>
                            <div class="die-block-desc">核心计算引擎：执行二进制加减运算、AND/OR 逻辑判断。</div>
                            <div id="alu-calc" style="margin-top:8px; font-size:0.75rem; font-family:var(--font-mono); color:#94a3b8; display:flex; align-items:center; gap:0.5rem; position:relative;">
                                <span>累加器:</span>
                                <span id="reg-acc" style="color:#00f59b; font-weight:bold; background:#020617; border:1px solid #1e293b; padding:2px 10px; border-radius:4px; position:relative;">
                                    ACC = --
                                    <!-- ACC 写回总线输出端口 (底端，将结果写入写回总线) -->
                                    <span id="port-acc-out" class="bus-port-dot green" style="bottom:-5px; left:50%; transform:translateX(-50%);" title="ACC 写回总线输出端口"></span>
                                </span>
                            </div>
                            <!-- ALU 操作数输入端口 (左侧，接收 R1,R2 操作数) -->
                            <span id="port-alu-in" class="bus-port-dot gold" style="left:-5px; top:50%; transform:translateY(-50%);" title="ALU 运算输入端口"></span>
                        </div>

                        <!-- 高速缓存 Cache Hierarchy (右下 - 带动态光晕与快取命中动效) -->
                        <div id="die-cache" class="die-block cache-block-enhanced" style="border:1px solid rgba(0,245,155,0.4); position:relative; overflow:hidden;">
                            <!-- 动态微光扫描线 -->
                            <div class="cache-sweep-beam"></div>

                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div class="die-block-title" style="color:#00f59b; display:flex; align-items:center; gap:6px;">
                                    <span class="cache-pulse-radar"></span>
                                    <span>高速缓冲存储器 (Cache)</span>
                                </div>
                                <span class="cache-hit-rate-badge" title="绝大多数指令与数据由快取直接响应">命中率 95%+</span>
                            </div>
                            
                            <div style="display:flex; flex-direction:column; gap:5px; margin-top:8px; font-size:0.72rem; font-family:var(--font-mono);">
                                <div id="cache-row-l1" class="cache-level-row" title="L1 核心独享静态 SRAM，延迟仅 1ns">
                                    <div style="display:flex; align-items:center; gap:6px;">
                                        <span class="cache-level-dot dot-l1"></span>
                                        <span style="font-weight:bold; color:#f8fafc;">L1 快取 (SRAM 独享)</span>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:6px;">
                                        <span class="cache-badge-speed">1 ns</span>
                                        <span class="cache-hit-tag">95% 命中 ★</span>
                                    </div>
                                </div>
                                
                                <div id="cache-row-l2" class="cache-level-row" title="L2 独立二级快取，延迟 3ns">
                                    <div style="display:flex; align-items:center; gap:6px;">
                                        <span class="cache-level-dot dot-l2"></span>
                                        <span>L2 独立二级快取</span>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:6px;">
                                        <span class="cache-badge-speed">3 ns</span>
                                        <span style="color:#94a3b8; font-size:0.65rem;">2MB</span>
                                    </div>
                                </div>
                                
                                <div id="cache-row-l3" class="cache-level-row" title="L3 芯片共享大容量三级快取，延迟 12ns">
                                    <div style="display:flex; align-items:center; gap:6px;">
                                        <span class="cache-level-dot dot-l3"></span>
                                        <span>L3 共享三级快取</span>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:6px;">
                                        <span class="cache-badge-speed">12 ns</span>
                                        <span style="color:#94a3b8; font-size:0.65rem;">33MB</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 底部快取动态演练交互按钮 -->
                            <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center; gap:6px;">
                                <button id="btn-cache-hit-sim" class="cache-action-btn" type="button" title="点击模拟 CPU 极速命中 L1 快取过程">
                                    <span>⚡</span> 模拟快取命中 (Cache Hit 极速 1ns)
                                </button>
                                <span id="cache-sim-indicator" style="font-size:0.68rem; color:#00f59b; font-family:var(--font-mono); font-weight:bold; display:none;">
                                    ★ 命中！耗时 1ns
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- 🌟 动态重构：纯动态计算激光叠加 SVG 图层 🌟 -->
                <svg id="fde-laser-canvas" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:15;" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <!-- 动态箭头标记 -->
                        <marker id="arrow-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#00f3ff" />
                        </marker>
                        <marker id="arrow-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#b066ff" />
                        </marker>
                        <marker id="arrow-gold" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#fbbf24" />
                        </marker>
                        <marker id="arrow-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#00f59b" />
                        </marker>
                        <filter id="laserGlowEffect" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="4.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    <!-- 永久物理总线导轨 (常态半透明展示 CPU 内部总线脉络) -->
                    <g id="fde-bg-bus-network">
                        <path id="bg-bus-fetch" d="" fill="none" stroke="#00f3ff" stroke-width="2" stroke-dasharray="5,4" opacity="0.22" />
                        <path id="bg-bus-decode" d="" fill="none" stroke="#b066ff" stroke-width="2" stroke-dasharray="5,4" opacity="0.22" />
                        <path id="bg-bus-exec" d="" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="5,4" opacity="0.22" />
                        <path id="bg-bus-store" d="" fill="none" stroke="#00f59b" stroke-width="2" stroke-dasharray="5,4" opacity="0.22" />
                    </g>

                    <!-- 动态高亮激光轨迹线 (由 JS 动态注入精准贝塞尔曲线路径) -->
                    <path id="active-laser-path" d="" fill="none" stroke="#00f3ff" stroke-width="3.8" stroke-dasharray="10,6" filter="url(#laserGlowEffect)" style="display:none;" />
                    
                    <!-- 动态沿线飞行的脉冲粒子球 -->
                    <circle id="active-laser-orb" cx="0" cy="0" r="8" fill="#ffffff" stroke="#00f3ff" stroke-width="3" filter="url(#laserGlowEffect)" style="display:none;" />
                    
                    <!-- 动态悬浮跟随数据包标签卡片 -->
                    <g id="active-laser-badge" style="display:none;">
                        <rect id="active-badge-bg" x="0" y="0" width="220" height="28" rx="6" fill="#020617" stroke="#00f3ff" stroke-width="1.8" filter="url(#laserGlowEffect)" />
                        <text id="active-badge-txt" x="110" y="18" fill="#00f3ff" font-size="9.5" font-family="'JetBrains Mono', Consolas, monospace" font-weight="bold" text-anchor="middle">数据流动中...</text>
                    </g>
                </svg>

                <!-- 流程状态实时解说气泡 -->
                <div id="fde-step-desc-box" style="margin-top:1.25rem; background:rgba(0,243,255,0.08); border-left:4px solid var(--cyan-primary); padding:0.85rem 1.25rem; border-radius:0 var(--radius-md) var(--radius-md) 0; position:relative; z-index:5;">
                    <div style="font-size:0.95rem; font-weight:bold; color:#ffffff;" id="fde-phase-title">当前状态: 准备就绪</div>
                    <div style="font-size:0.82rem; color:#cbd5e1; margin-top:4px; line-height:1.6;" id="fde-phase-detail">
                        点击上方 <strong>“▶ 自动连续演示”</strong> 或 <strong>“⏭️ 单步执行”</strong>，激光导轨将实时动态计算位置，生动呈现：<br>
                        <strong>① 取指 (RAM ➔ IR)</strong> ➔ <strong>② 译码 (IR ➔ CU)</strong> ➔ <strong>③ 执行 (R1,R2 ➔ ALU)</strong> ➔ <strong>④ 写回 (ACC ➔ R1)</strong> 的完整指令执行周期！
                    </div>
                </div>

                <!-- 物理总线图例栏 -->
                <div class="fde-bus-legend-bar">
                    <div class="legend-item"><span class="legend-dot cyan"></span> 外部系统数据总线 (RAM ➔ IR 取指)</div>
                    <div class="legend-item"><span class="legend-dot purple"></span> 内部控制总线 (IR ➔ CU 译码)</div>
                    <div class="legend-item"><span class="legend-dot gold"></span> 内部数据总线 (R1,R2 ➔ ALU 执行)</div>
                    <div class="legend-item"><span class="legend-dot green"></span> 内部写回总线 (ACC ➔ R1 写回)</div>
                </div>

            </div>
        </div>
        `;

        this.bindCpuActions();
        
        // 使用 ResizeObserver 确保在任何排版渲染完成与尺寸变化时自动校准导轨
        if (window.ResizeObserver) {
            const diagramBox = document.getElementById('cpu-diagram-box');
            if (diagramBox) {
                if (this.resizeObserver) this.resizeObserver.disconnect();
                this.resizeObserver = new ResizeObserver(() => {
                    this.drawBackgroundBuses();
                });
                this.resizeObserver.observe(diagramBox);
            }
        }
        setTimeout(() => this.drawBackgroundBuses(), 120);
    }

    bindCpuActions() {
        const autoBtn = document.getElementById('btn-auto-fde');
        const pauseBtn = document.getElementById('btn-pause-fde');
        const nextBtn = document.getElementById('btn-step-next');
        const resetBtn = document.getElementById('btn-reset-fde');
        const speedBtn = document.getElementById('btn-fde-speed');

        if (autoBtn) {
            autoBtn.addEventListener('click', () => {
                this.playFullFdeAuto();
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.togglePauseFde();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.stepFdeNext();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFdeState();
            });
        }

        if (speedBtn) {
            speedBtn.addEventListener('click', () => {
                if (this.stepDuration === 3800) {
                    this.stepDuration = 2000;
                    this.glideDuration = 1100;
                    speedBtn.innerHTML = `<span>⚡</span> 速度: 常规 (2.0s)`;
                } else {
                    this.stepDuration = 3800;
                    this.glideDuration = 2000;
                    speedBtn.innerHTML = `<span>🐢</span> 速度: 慢速 (3.8s)`;
                }
            });
        }

        // 快取 Cache 交互按钮模拟动效
        const cacheSimBtn = document.getElementById('btn-cache-hit-sim');
        if (cacheSimBtn) {
            cacheSimBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.triggerCacheHitAnimation();
            });
        }

        // 顶层 4 阶段 Stepper 药丸按钮点击直接跳转
        document.querySelectorAll('.fde-step-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const step = parseInt(pill.dataset.step, 10);
                if (step >= 1 && step <= 4) {
                    this.stopFdeAnimation();
                    this.currentStep = step;
                    this.executeStep(step, true);
                }
            });
        });
    }

    // 触发 Cache 快取极速命中的动效与原理精析
    triggerCacheHitAnimation() {
        if (window.soundEngine) window.soundEngine.playSnap();
        const dieCache = document.getElementById('die-cache');
        const rowL1 = document.getElementById('cache-row-l1');
        const indicator = document.getElementById('cache-sim-indicator');
        const descBox = document.getElementById('fde-phase-detail');

        if (dieCache) {
            dieCache.classList.add('cache-hit-flash');
            setTimeout(() => dieCache.classList.remove('cache-hit-flash'), 1200);
        }
        if (rowL1) {
            rowL1.classList.add('row-hit-active');
            setTimeout(() => rowL1.classList.remove('row-hit-active'), 1200);
        }
        if (indicator) {
            indicator.style.display = 'inline-block';
            indicator.textContent = '★ L1 命中！耗时仅 1ns';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 2500);
        }
        if (descBox) {
            descBox.innerHTML = `⚡ <strong>【快取局部性原理 (Cache Hit)】</strong> CPU 核心在发起访问时首先检索片上 L1 快取，命中率高达 <strong>95%</strong>！SRAM 触发器结构使得数据在 <strong>1ns (极速单时钟周期)</strong> 内即可直接送达 ALU 与寄存器，完全无需通过慢速外部总线等待内存 (RAM 15ns)，彻底消除处理器“存储器速度鸿沟”！`;
        }
    }

    // 绘制常态半透明物理总线导轨 (展示芯片内部物理总线骨架)
    drawBackgroundBuses() {
        const container = document.getElementById('cpu-diagram-box');
        if (!container) return;

        const portRam = document.getElementById('port-ram-out') || document.getElementById('fde-ram-data');
        const portIr = document.getElementById('port-ir-in') || document.getElementById('reg-box-ir');
        const portCu = document.getElementById('port-cu-in') || document.getElementById('die-cu');
        const portRegOut = document.getElementById('port-reg-out') || document.getElementById('reg-box-r2');
        const portAluIn = document.getElementById('port-alu-in') || document.getElementById('die-alu');
        const portAcc = document.getElementById('port-acc-out') || document.getElementById('reg-acc');
        const portR1In = document.getElementById('port-r1-in') || document.getElementById('reg-box-r1');

        const bgFetch = document.getElementById('bg-bus-fetch');
        const bgDecode = document.getElementById('bg-bus-decode');
        const bgExec = document.getElementById('bg-bus-exec');
        const bgStore = document.getElementById('bg-bus-store');

        const pRam = this.getCoords(portRam, container);
        const pIr = this.getCoords(portIr, container);
        const pCu = this.getCoords(portCu, container);
        const pRegOut = this.getCoords(portRegOut, container);
        const pAluIn = this.getCoords(portAluIn, container);
        const pAcc = this.getCoords(portAcc, container);
        const pR1In = this.getCoords(portR1In, container);

        // 1. 取指总线: RAM ➔ IR
        if (bgFetch) {
            bgFetch.setAttribute('d', `M ${pRam.x} ${pRam.bottom} C ${pRam.x} ${pRam.bottom + 50}, ${pIr.x} ${pIr.top - 50}, ${pIr.x} ${pIr.top}`);
        }
        // 2. 译码总线: IR ➔ CU
        if (bgDecode) {
            bgDecode.setAttribute('d', `M ${pIr.x} ${pIr.top} C ${pIr.x} ${pIr.top - 40}, ${pCu.x} ${pCu.bottom + 40}, ${pCu.x} ${pCu.bottom}`);
        }
        // 3. 执行总线: Registers (R1,R2) ➔ ALU
        if (bgExec) {
            const startX = pRegOut.right;
            const startY = pRegOut.y;
            const endX = pAluIn.left;
            const endY = pAluIn.y;
            const midX = (startX + endX) / 2;
            bgExec.setAttribute('d', `M ${startX} ${startY} C ${midX - 25} ${startY - 40}, ${midX + 25} ${endY + 40}, ${endX} ${endY}`);
        }
        // 4. 写回总线 (ACC ➔ R1): 从右上角 ALU 累加器精准引向左下角 R1 寄存器
        if (bgStore) {
            const startX = pAcc.x;
            const startY = pAcc.bottom;
            const endX = pR1In.x;
            const endY = pR1In.bottom;
            const midX = (startX + endX) / 2;
            bgStore.setAttribute('d', `M ${startX} ${startY} C ${midX + 35} ${startY + 80}, ${midX - 35} ${endY + 70}, ${endX} ${endY}`);
        }
    }

    // 重新校准当前激活轨迹的坐标 (窗口尺寸改变或排版刷新时调用)
    updateActivePathCoords() {
        this.drawBackgroundBuses();
        if (this.currentStep > 0 && this.currentStep <= 4) {
            this.executeStep(this.currentStep, false);
        }
    }

    // 更新 Stepper 药丸按钮的高亮状态
    updateStepperPills(activeStep) {
        for (let i = 1; i <= 4; i++) {
            const pill = document.getElementById(`pill-step-${i}`);
            if (!pill) continue;
            pill.classList.remove('active', 'step-fetch', 'step-decode', 'step-exec', 'step-store');
            if (i === activeStep) {
                pill.classList.add('active');
                if (i === 1) pill.classList.add('step-fetch');
                else if (i === 2) pill.classList.add('step-decode');
                else if (i === 3) pill.classList.add('step-exec');
                else if (i === 4) pill.classList.add('step-store');
            }
        }
    }

    // 重置所有寄存器与视觉状态
    resetFdeState() {
        this.stopFdeAnimation();
        this.currentStep = 0;
        this.updateStepperPills(0);

        const regPc = document.getElementById('reg-pc');
        const regIr = document.getElementById('reg-ir');
        const valR1 = document.getElementById('val-r1');
        const valR2 = document.getElementById('val-r2');
        const regAcc = document.getElementById('reg-acc');
        const cuStatus = document.getElementById('cu-status');
        const busInd = document.getElementById('fde-bus-indicator');

        const regBoxIr = document.getElementById('reg-box-ir');
        const regBoxR1 = document.getElementById('reg-box-r1');

        const activePath = document.getElementById('active-laser-path');
        const activeOrb = document.getElementById('active-laser-orb');
        const activeBadge = document.getElementById('active-laser-badge');

        const phaseTitle = document.getElementById('fde-phase-title');
        const phaseDetail = document.getElementById('fde-phase-detail');

        const autoBtn = document.getElementById('btn-auto-fde');
        const pauseBtn = document.getElementById('btn-pause-fde');

        if (regPc) regPc.textContent = '0x0040';
        if (regIr) regIr.textContent = '---';
        if (valR1) {
            valR1.textContent = '15';
            valR1.style.color = '#fbbf24';
        }
        if (valR2) valR2.textContent = '27';
        if (regAcc) {
            regAcc.textContent = 'ACC = --';
            regAcc.style.borderColor = '#1e293b';
            regAcc.style.color = '#94a3b8';
        }
        if (cuStatus) cuStatus.textContent = '状态: 空闲 (IDLE)';
        if (busInd) busInd.textContent = '系统总线待命中...';

        if (regBoxIr) {
            regBoxIr.style.borderColor = '#1e293b';
            regBoxIr.style.boxShadow = 'none';
        }
        if (regBoxR1) {
            regBoxR1.style.borderColor = '#1e293b';
            regBoxR1.style.boxShadow = 'none';
        }

        document.querySelectorAll('.die-block').forEach(b => {
            b.classList.remove('active');
            b.style.borderColor = '';
            b.style.boxShadow = '';
        });

        if (activePath) activePath.style.display = 'none';
        if (activeOrb) activeOrb.style.display = 'none';
        if (activeBadge) activeBadge.style.display = 'none';

        if (phaseTitle) phaseTitle.textContent = '当前状态: 已重置就绪';
        if (phaseDetail) phaseDetail.innerHTML = `点击上方 <strong>“▶ 自动连续演示”</strong> 或 <strong>“⏭️ 单步执行”</strong> 开始演示！`;

        if (autoBtn) {
            autoBtn.disabled = false;
            autoBtn.innerHTML = `<span>▶</span> 自动连续演示`;
        }
        if (pauseBtn) pauseBtn.style.display = 'none';
    }

    // 暂停 / 继续控制
    togglePauseFde() {
        const pauseBtn = document.getElementById('btn-pause-fde');
        const autoBtn = document.getElementById('btn-auto-fde');
        if (!this.isAutoPlaying) return;

        if (!this.isPaused) {
            // 暂停
            this.isPaused = true;
            if (this.activeTimer) {
                clearTimeout(this.activeTimer);
                this.activeTimer = null;
            }
            if (pauseBtn) pauseBtn.innerHTML = `<span>▶</span> 继续播放`;
            if (autoBtn) autoBtn.innerHTML = `<span>⏸️</span> 演示已暂停 (${this.currentStep}/4)`;
        } else {
            // 继续
            this.isPaused = false;
            if (pauseBtn) pauseBtn.innerHTML = `<span>⏸️</span> 暂停`;
            if (autoBtn) autoBtn.innerHTML = `<span>⏳</span> 正在自动演示中 (${this.currentStep}/4)...`;
            this.scheduleNextStep();
        }
    }

    // 单步步进执行
    stepFdeNext() {
        this.stopFdeAnimation();
        this.currentStep++;
        if (this.currentStep > 4) {
            this.currentStep = 1; // 循环演示
        }
        this.executeStep(this.currentStep, true);
    }

    // 全自动连续慢速执行
    playFullFdeAuto() {
        if (this.isAutoPlaying && !this.isPaused) return;
        this.isAutoPlaying = true;
        this.isPaused = false;

        const autoBtn = document.getElementById('btn-auto-fde');
        const pauseBtn = document.getElementById('btn-pause-fde');

        if (autoBtn) {
            autoBtn.disabled = false;
            autoBtn.innerHTML = `<span>⏳</span> 正在自动演示中 (1/4)...`;
        }
        if (pauseBtn) {
            pauseBtn.style.display = 'inline-flex';
            pauseBtn.innerHTML = `<span>⏸️</span> 暂停`;
        }

        this.currentStep = 1;
        this.executeStep(1, true);
        this.scheduleNextStep();
    }

    // 规划下一步调度计时器
    scheduleNextStep() {
        if (!this.isAutoPlaying || this.isPaused) return;

        this.activeTimer = setTimeout(() => {
            if (!this.isAutoPlaying || this.isPaused) return;
            this.currentStep++;
            const autoBtn = document.getElementById('btn-auto-fde');
            const pauseBtn = document.getElementById('btn-pause-fde');

            if (this.currentStep <= 4) {
                if (autoBtn) autoBtn.innerHTML = `<span>⏳</span> 正在自动演示中 (${this.currentStep}/4)...`;
                this.executeStep(this.currentStep, true);
                this.scheduleNextStep();
            } else {
                if (autoBtn) {
                    autoBtn.disabled = false;
                    autoBtn.innerHTML = `<span>✓</span> 演示圆满完成！点击再次回放`;
                }
                if (pauseBtn) pauseBtn.style.display = 'none';
                this.isAutoPlaying = false;
            }
        }, this.stepDuration);
    }

    // 执行具体步骤 (1: Fetch, 2: Decode, 3: Execute, 4: Store)
    executeStep(step, animateGlide = true) {
        const container = document.getElementById('cpu-diagram-box');
        if (!container) return;

        this.updateStepperPills(step);

        const portRam = document.getElementById('port-ram-out') || document.getElementById('fde-ram-data');
        const portIr = document.getElementById('port-ir-in') || document.getElementById('reg-box-ir');
        const regIr = document.getElementById('reg-ir');
        const regPc = document.getElementById('reg-pc');
        const portCu = document.getElementById('port-cu-in') || document.getElementById('die-cu');
        const dieCu = document.getElementById('die-cu');
        const cuStatus = document.getElementById('cu-status');
        const regBoxR1 = document.getElementById('reg-box-r1');
        const portR1In = document.getElementById('port-r1-in') || regBoxR1;
        const valR1 = document.getElementById('val-r1');
        const portRegOut = document.getElementById('port-reg-out') || document.getElementById('reg-box-r2');
        const dieAlu = document.getElementById('die-alu');
        const portAluIn = document.getElementById('port-alu-in') || dieAlu;
        const regAcc = document.getElementById('reg-acc');
        const portAcc = document.getElementById('port-acc-out') || regAcc;
        const dieReg = document.getElementById('die-reg');
        const busInd = document.getElementById('fde-bus-indicator');

        const activePath = document.getElementById('active-laser-path');
        const activeOrb = document.getElementById('active-laser-orb');
        const activeBadge = document.getElementById('active-laser-badge');
        const activeBadgeBg = document.getElementById('active-badge-bg');
        const activeBadgeTxt = document.getElementById('active-badge-txt');

        const phaseTitle = document.getElementById('fde-phase-title');
        const phaseDetail = document.getElementById('fde-phase-detail');

        // 清除上一步的高亮状态
        document.querySelectorAll('.die-block').forEach(b => {
            b.style.borderColor = '';
            b.style.boxShadow = '';
        });
        const regBoxIr = document.getElementById('reg-box-ir');
        if (regBoxIr) regBoxIr.style.borderColor = '#1e293b';
        if (regBoxR1) regBoxR1.style.borderColor = '#1e293b';

        // 动态获取精准锚点
        const pRam = this.getCoords(portRam, container);
        const pIr = this.getCoords(portIr, container);
        const pCu = this.getCoords(portCu, container);
        const pRegOut = this.getCoords(portRegOut, container);
        const pAluIn = this.getCoords(portAluIn, container);
        const pAcc = this.getCoords(portAcc, container);
        const pR1In = this.getCoords(portR1In, container);

        let pathData = '';
        let strokeColor = '#00f3ff';
        let markerId = 'url(#arrow-cyan)';
        let badgeLabel = '';

        if (step === 1) {
            // ================= 阶段 1: 取指 (Fetch) [RAM ➔ IR] =================
            pathData = `M ${pRam.x} ${pRam.bottom} C ${pRam.x} ${pRam.bottom + 50}, ${pIr.x} ${pIr.top - 50}, ${pIr.x} ${pIr.top}`;
            strokeColor = '#00f3ff';
            markerId = 'url(#arrow-cyan)';
            badgeLabel = '① 取指: RAM ➔ IR [ADD R1, R2]';

            if (phaseTitle) phaseTitle.innerHTML = `<span style="color:#00f3ff;">第 1 阶段：取出指令 (Fetch)</span> —— 【主存储器 RAM ➔ 指令暂存器 IR】`;
            if (phaseDetail) phaseDetail.innerHTML = `★ <strong>物理流向</strong>：CPU 根据程序计数器 PC (<code style="color:#38bdf8;">0x0040</code>) 的寻址指针，通过<strong>外部系统数据总线</strong>从主存储器 (RAM) 中读取指令 <code>ADD R1, R2</code>，精准送入芯片内部的 <strong>IR 指令暂存寄存器</strong>！随后 PC 自动加 1 指向下一条指令地址 (0x0044)。`;
            if (busInd) busInd.innerHTML = `<span style="color:#00f3ff; font-weight:bold;">【系统数据总线】RAM [0x0040] ➔ 写入 IR 暂存器</span>`;
            if (cuStatus) cuStatus.textContent = '状态: 正在接收新指令...';

            if (dieReg) dieReg.style.borderColor = '#00f3ff';
            const dieCacheFetch = document.getElementById('die-cache');
            if (dieCacheFetch) {
                dieCacheFetch.classList.add('cache-glow-fetch');
                setTimeout(() => dieCacheFetch.classList.remove('cache-glow-fetch'), 2500);
            }

            setTimeout(() => {
                if (regIr) regIr.textContent = 'ADD R1, R2';
                if (regBoxIr) {
                    regBoxIr.style.borderColor = '#00f3ff';
                    regBoxIr.style.boxShadow = '0 0 14px rgba(0,243,255,0.5)';
                }
                if (regPc) regPc.textContent = '0x0044';
            }, animateGlide ? this.glideDuration : 0);

            if (window.soundEngine) window.soundEngine.playClick();

        } else if (step === 2) {
            // ================= 阶段 2: 译码 (Decode) [IR ➔ CU] =================
            pathData = `M ${pIr.x} ${pIr.top} C ${pIr.x} ${pIr.top - 40}, ${pCu.x} ${pCu.bottom + 40}, ${pCu.x} ${pCu.bottom}`;
            strokeColor = '#b066ff';
            markerId = 'url(#arrow-purple)';
            badgeLabel = '② 译码: IR ➔ 控制单元 CU 译码器';

            if (phaseTitle) phaseTitle.innerHTML = `<span style="color:#b066ff;">第 2 阶段：指令译码 (Decode)</span> —— 【指令寄存器 IR ➔ 控制单元 CU】`;
            if (phaseDetail) phaseDetail.innerHTML = `★ <strong>物理流向</strong>：IR 暂存器将指令的操作码 (Opcode: ADD) 向上送入<strong>控制单元 (CU - Control Unit)</strong>！CU 内部译码逻辑对指令进行分析，识别出是加法运算，并确定操作数来自于通用寄存器 <strong>R1</strong> 与 <strong>R2</strong>，发出微操作时序控制脉冲。`;
            if (busInd) busInd.innerHTML = `<span style="color:#b066ff; font-weight:bold;">【内部控制总线】IR ➔ CU 控制单元译码中</span>`;

            if (dieCu) {
                dieCu.style.borderColor = '#b066ff';
                dieCu.style.boxShadow = '0 0 20px rgba(176,102,255,0.45)';
            }

            setTimeout(() => {
                if (cuStatus) cuStatus.textContent = '状态: 【译码完成】操作码=ADD(加法)，调度 ALU';
            }, animateGlide ? this.glideDuration : 0);

            if (window.soundEngine) window.soundEngine.playClick();

        } else if (step === 3) {
            // ================= 阶段 3: 执行 (Execute) [R1,R2 ➔ ALU] =================
            const startX = pRegOut.right;
            const startY = pRegOut.y;
            const endX = pAluIn.left;
            const endY = pAluIn.y;
            const midX = (startX + endX) / 2;
            pathData = `M ${startX} ${startY} C ${midX - 25} ${startY - 40}, ${midX + 25} ${endY + 40}, ${endX} ${endY}`;
            strokeColor = '#fbbf24';
            markerId = 'url(#arrow-gold)';
            badgeLabel = '③ 执行: R1(15) + R2(27) ➔ ALU';

            if (phaseTitle) phaseTitle.innerHTML = `<span style="color:#fbbf24;">第 3 阶段：执行指令 (Execute)</span> —— 【寄存器 R1、R2 ➔ 算术逻辑单元 ALU】`;
            if (phaseDetail) phaseDetail.innerHTML = `★ <strong>物理流向</strong>：控制单元发出读取控制脉冲，通用寄存器 <strong>R1 (15)</strong> 与 <strong>R2 (27)</strong> 的操作数数值沿着内部数据总线向右上飞入<strong>算术逻辑单元 (ALU)</strong>！ALU 硬件加法器执行二进制加法，运算结果 <code>42</code> 暂存入累加器 ACC！`;
            if (busInd) busInd.innerHTML = `<span style="color:#fbbf24; font-weight:bold;">【内部数据总线】R1(15)、R2(27) ➔ 送入 ALU 加法器</span>`;

            if (dieAlu) {
                dieAlu.style.borderColor = '#fbbf24';
                dieAlu.style.boxShadow = '0 0 20px rgba(251,191,36,0.45)';
            }

            setTimeout(() => {
                if (regAcc) {
                    regAcc.textContent = 'ACC = 42 (00101010)';
                    regAcc.style.borderColor = '#00f59b';
                    regAcc.style.color = '#00f59b';
                }
                if (cuStatus) cuStatus.textContent = '状态: 【ALU加法中】15 + 27 = 42';
            }, animateGlide ? this.glideDuration : 0);

            if (window.soundEngine) window.soundEngine.playClick();

        } else if (step === 4) {
            // ================= 阶段 4: 写回 (Store / Writeback) [ALU ACC ➔ R1] =================
            // 彻底修正：起点严谨为 ALU 累加器 ACC (右上)，终点精准流向目标寄存器 R1 (左下)
            const startX = pAcc.x;
            const startY = pAcc.bottom;
            const endX = pR1In.x;
            const endY = pR1In.bottom;
            const midX = (startX + endX) / 2;
            // 优雅的向下方避让弧线，避开 CU 与 R2，精准接入 R1 底端写回端口
            pathData = `M ${startX} ${startY} C ${midX + 35} ${startY + 80}, ${midX - 35} ${endY + 70}, ${endX} ${endY}`;
            strokeColor = '#00f59b';
            markerId = 'url(#arrow-green)';
            badgeLabel = '④ 写回: ACC (42) ➔ 目标寄存器 R1';

            if (phaseTitle) phaseTitle.innerHTML = `<span style="color:#00f59b;">第 4 阶段：存回结果 (Store / Writeback)</span> —— 【ALU 累加器 ACC ➔ 寄存器 R1】`;
            if (phaseDetail) phaseDetail.innerHTML = `★ <strong>物理流向</strong>：最终计算结果 <code>42</code> 从 ALU 的 ACC 累加器沿着专用的<strong>内部写回总线 (Writeback Bus)</strong> 精准飞回并保存至左下角的目标寄存器 <strong>R1</strong>（绝非 PC，也绝非来自 CU）！R1 数值从 15 刷新为 42，一个完整的指令执行周期圆满结束！`;
            if (busInd) busInd.innerHTML = `<span style="color:#00f59b; font-weight:bold;">【内部写回总线】计算结果 42 从 ACC ➔ 存回 R1</span>`;

            if (dieReg) {
                dieReg.style.borderColor = '#00f59b';
                dieReg.style.boxShadow = '0 0 20px rgba(0,245,155,0.45)';
            }

            setTimeout(() => {
                if (valR1) {
                    valR1.textContent = '42 ✓';
                    valR1.style.color = '#00f59b';
                }
                if (regBoxR1) {
                    regBoxR1.style.borderColor = '#00f59b';
                    regBoxR1.style.boxShadow = '0 0 14px rgba(0,245,155,0.6)';
                }
                if (cuStatus) cuStatus.textContent = '状态: 【写回完成】R1=42，就绪执行下一条';
            }, animateGlide ? this.glideDuration : 0);

            if (window.soundEngine) window.soundEngine.playSuccessChord();
        }

        // 渲染与平滑动效
        if (!activePath || !activeOrb || !activeBadge) return;

        activePath.setAttribute('d', pathData);
        activePath.setAttribute('stroke', strokeColor);
        activePath.setAttribute('marker-end', markerId);
        activePath.style.display = 'block';

        activeOrb.setAttribute('stroke', strokeColor);
        activeOrb.style.display = 'block';

        activeBadgeBg.setAttribute('stroke', strokeColor);
        activeBadgeTxt.setAttribute('fill', strokeColor);
        activeBadgeTxt.textContent = badgeLabel;
        activeBadge.style.display = 'block';

        if (animateGlide) {
            this.animateLaserGlide(activePath, activeOrb, activeBadge, this.glideDuration);
        } else {
            const totalLen = activePath.getTotalLength();
            const endPt = activePath.getPointAtLength(totalLen);
            activeOrb.setAttribute('cx', endPt.x);
            activeOrb.setAttribute('cy', endPt.y);
            activeBadge.setAttribute('transform', `translate(${endPt.x - 110}, ${endPt.y - 36})`);
        }
    }

    // 平滑流畅的沿线粒子飞行动画 (使用 requestAnimationFrame 保持 60 FPS)
    animateLaserGlide(pathEl, orbEl, badgeEl, duration) {
        if (!pathEl || !orbEl || !badgeEl) return;
        const totalLen = pathEl.getTotalLength();
        const startTime = performance.now();

        const updateFrame = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // 缓动平滑函数 (Ease-in-out)
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

            const pt = pathEl.getPointAtLength(ease * totalLen);
            orbEl.setAttribute('cx', pt.x);
            orbEl.setAttribute('cy', pt.y);
            badgeEl.setAttribute('transform', `translate(${pt.x - 110}, ${pt.y - 36})`);

            if (progress < 1) {
                this.animFrameId = requestAnimationFrame(updateFrame);
            }
        };

        this.animFrameId = requestAnimationFrame(updateFrame);
    }

    // =========================================================================
    // 2. 存储层次速度大对决 (Memory & Storage Hierarchy Speed Race)
    // =========================================================================
    renderStorageHierarchy(container) {
        container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                <div>
                    <h3 style="color:#ffffff; font-size:1.15rem; font-weight:700;">存储体系层次与读写速度大对决 (Storage Hierarchy)</h3>
                    <p style="color:var(--text-secondary); font-size:0.8rem;">
                        速度：快取 (Cache) > 主存 (RAM) > 固态 (NVMe/SATA SSD) > 机械 (HDD)。容量与价格则反之！
                    </p>
                </div>
                <button id="btn-run-race" class="ctrl-btn" style="background:linear-gradient(135deg, rgba(255,183,3,0.25), rgba(0,243,255,0.25)); border-color:var(--amber-warning); color:#ffffff; font-weight:bold; padding:0.6rem 1.4rem;">
                    <span>🏁</span> 启动 1GB 数据读取竞速赛 (Speed Race)
                </button>
            </div>

            <!-- 存储天梯视觉卡片组 -->
            <div style="display:flex; flex-direction:column; gap:0.85rem; background:#080c16; border:1px solid #334155; border-radius:var(--radius-lg); padding:1.25rem;">
                
                <!-- 1. CPU Cache 快取内存 -->
                <div class="storage-race-row">
                    <div class="storage-meta-box">
                        <span style="font-size:1.2rem;">⚡</span>
                        <div>
                            <div style="font-size:0.88rem; font-weight:bold; color:#00f59b;">CPU 快取内存 (Cache Memory)</div>
                            <div style="font-size:0.72rem; color:var(--text-muted);">SRAM 静态内存 • 延迟 ~1 ns • 极其昂贵</div>
                        </div>
                    </div>
                    <div class="storage-bar-wrap">
                        <div class="storage-bar-fill" id="bar-cache" style="width:0%; background:linear-gradient(90deg, #00f59b, #38bdf8);"></div>
                    </div>
                    <div class="storage-speed-tag" style="color:#00f59b;" id="tag-cache">~1,200 GB/s</div>
                </div>

                <!-- 2. 主内存 RAM (DDR5) -->
                <div class="storage-race-row">
                    <div class="storage-meta-box">
                        <span style="font-size:1.2rem;">💾</span>
                        <div>
                            <div style="font-size:0.88rem; font-weight:bold; color:#38bdf8;">主内存 (RAM Memory - DDR5)</div>
                            <div style="font-size:0.72rem; color:var(--text-muted);">DRAM 动态内存 (易失性 Volatile) • 延迟 ~15 ns</div>
                        </div>
                    </div>
                    <div class="storage-bar-wrap">
                        <div class="storage-bar-fill" id="bar-ram" style="width:0%; background:linear-gradient(90deg, #38bdf8, #818cf8);"></div>
                    </div>
                    <div class="storage-speed-tag" style="color:#38bdf8;" id="tag-ram">96 GB/s (双通道)</div>
                </div>

                <!-- 3. M.2 NVMe PCIe 4.0 SSD -->
                <div class="storage-race-row">
                    <div class="storage-meta-box">
                        <span style="font-size:1.2rem;">🚀</span>
                        <div>
                            <div style="font-size:0.88rem; font-weight:bold; color:#b066ff;">M.2 NVMe SSD (PCIe 4.0 高速固态)</div>
                            <div style="font-size:0.72rem; color:var(--text-muted);">3D NAND 闪存 (非易失性) • 承载虚拟内存 (Virtual Memory)</div>
                        </div>
                    </div>
                    <div class="storage-bar-wrap">
                        <div class="storage-bar-fill" id="bar-nvme" style="width:0%; background:linear-gradient(90deg, #b066ff, #ec4899);"></div>
                    </div>
                    <div class="storage-speed-tag" style="color:#b066ff;" id="tag-nvme">7,400 MB/s</div>
                </div>

                <!-- 4. 普通 2.5寸 SATA SSD -->
                <div class="storage-race-row">
                    <div class="storage-meta-box">
                        <span style="font-size:1.2rem;">📼</span>
                        <div>
                            <div style="font-size:0.88rem; font-weight:bold; color:#fbbf24;">普通 SATA SSD (2.5英寸固态)</div>
                            <div style="font-size:0.72rem; color:var(--text-muted);">走传统 SATA III 6Gbps 接口瓶颈限制</div>
                        </div>
                    </div>
                    <div class="storage-bar-wrap">
                        <div class="storage-bar-fill" id="bar-satassd" style="width:0%; background:linear-gradient(90deg, #fbbf24, #f97316);"></div>
                    </div>
                    <div class="storage-speed-tag" style="color:#fbbf24;" id="tag-satassd">550 MB/s</div>
                </div>

                <!-- 5. 机械硬盘 SATA HDD -->
                <div class="storage-race-row">
                    <div class="storage-meta-box">
                        <span style="font-size:1.2rem;">💿</span>
                        <div>
                            <div style="font-size:0.88rem; font-weight:bold; color:#94a3b8;">机械硬盘 (SATA HDD / 机械式磁头)</div>
                            <div style="font-size:0.72rem; color:var(--text-muted);">马达旋转与磁头物理寻道 (延迟 12 ms，极慢！)</div>
                        </div>
                    </div>
                    <div class="storage-bar-wrap">
                        <div class="storage-bar-fill" id="bar-hdd" style="width:0%; background:linear-gradient(90deg, #64748b, #94a3b8);"></div>
                    </div>
                    <div class="storage-speed-tag" style="color:#94a3b8;" id="tag-hdd">150 MB/s</div>
                </div>

            </div>

            <!-- 考点精炼说明 -->
            <div style="background:rgba(255,183,3,0.06); border:1px dashed rgba(255,183,3,0.3); border-radius:var(--radius-md); padding:0.85rem 1.25rem; font-size:0.8rem; color:#fef08a; line-height:1.5;">
                💡 <strong>独中课本重点概念中英对照</strong>：<br>
                • <strong>虚拟内存 (Virtual Memory)</strong>：当物理内存 (RAM) 耗尽时，操作系统会将 SSD/HDD 的一部分空间模拟成内存使用（分页 Pagefile），但因为 SSD 速度远慢于 RAM，发生颠簸 (Thrashing) 时系统会明显卡顿。<br>
                • <strong>NVMe vs SATA 差距</strong>：NVMe 直接使用 CPU 内部的 PCIe 高速通道，读取速度是传统 SATA SSD 的 <strong>13倍</strong>，是传统机械硬盘的 <strong>50倍</strong>！
            </div>
        </div>
        `;

        const raceBtn = document.getElementById('btn-run-race');
        if (raceBtn) {
            raceBtn.addEventListener('click', () => {
                this.runStorageSpeedRace();
            });
        }
    }

    // 运行 1GB 文件读取竞速赛动画
    runStorageSpeedRace() {
        if (this.isRacing) return;
        this.isRacing = true;

        const raceBtn = document.getElementById('btn-run-race');
        if (raceBtn) {
            raceBtn.disabled = true;
            raceBtn.innerHTML = `<span>🏁</span> 竞速测试进行中...`;
        }

        const barCache = document.getElementById('bar-cache');
        const barRam = document.getElementById('bar-ram');
        const barNvme = document.getElementById('bar-nvme');
        const barSataSsd = document.getElementById('bar-satassd');
        const barHdd = document.getElementById('bar-hdd');

        const tagCache = document.getElementById('tag-cache');
        const tagRam = document.getElementById('tag-ram');
        const tagNvme = document.getElementById('tag-nvme');
        const tagSataSsd = document.getElementById('tag-satassd');
        const tagHdd = document.getElementById('tag-hdd');

        [barCache, barRam, barNvme, barSataSsd, barHdd].forEach(b => b.style.width = '0%');
        if (window.soundEngine) window.soundEngine.playClick();

        // 1. Cache: 瞬间完成 (0.05s)
        setTimeout(() => {
            barCache.style.width = '100%';
            tagCache.innerHTML = '✓ 0.0008s (瞬间完成)';
        }, 50);

        // 2. RAM: 眨眼完成 (0.15s)
        setTimeout(() => {
            barRam.style.width = '100%';
            tagRam.innerHTML = '✓ 0.01s (毫秒级)';
        }, 150);

        // 3. M.2 NVMe SSD: 极速 (0.4s)
        setTimeout(() => {
            barNvme.style.width = '100%';
            tagNvme.innerHTML = '✓ 0.14s (飞速)';
        }, 400);

        // 4. SATA SSD: 持续推进 (1.8s)
        let sataP = 0;
        const sataTimer = setInterval(() => {
            sataP += 8;
            if (sataP >= 100) {
                sataP = 100;
                clearInterval(sataTimer);
                tagSataSsd.innerHTML = '✓ 1.82s (耗时较长)';
            }
            barSataSsd.style.width = `${sataP}%`;
        }, 140);

        // 5. HDD: 艰难转动 (4.5s)
        let hddP = 0;
        const hddTimer = setInterval(() => {
            hddP += 3;
            if (hddP >= 100) {
                hddP = 100;
                clearInterval(hddTimer);
                tagHdd.innerHTML = '✓ 6.67s (物理寻道完成)';
                this.isRacing = false;
                if (raceBtn) {
                    raceBtn.disabled = false;
                    raceBtn.innerHTML = `<span>↺</span> 重新测试竞速`;
                }
                if (window.soundEngine) window.soundEngine.playSuccessChord();
            } else {
                tagHdd.innerHTML = `磁头寻道中... ${hddP}%`;
            }
            barHdd.style.width = `${hddP}%`;
        }, 140);
    }

    // =========================================================================
    // 3. CPU vs GPU 并行对决
    // =========================================================================
    renderGpuVsCpu(container) {
        container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                <div>
                    <h3 style="color:#ffffff; font-size:1.15rem; font-weight:700;">CPU vs GPU 算力特征与并行机制对决</h3>
                    <p style="color:var(--text-secondary); font-size:0.8rem;">独中考点：为什么 3D 游戏渲染与 AI 神经网络计算必须依赖 GPU？</p>
                </div>
                <button id="btn-benchmark" class="ctrl-btn" style="background:linear-gradient(135deg, rgba(0,245,155,0.25), rgba(0,243,255,0.25)); border-color:var(--green-success); color:#ffffff; font-weight:bold;">
                    <span>⚡</span> 启动 4K 画面 (829万像素) 渲染对决
                </button>
            </div>

            <div class="cpu-gpu-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
                
                <!-- CPU 卡片 -->
                <div style="background:#090d16; border:1px solid #334155; border-radius:var(--radius-lg); padding:1.25rem; display:flex; flex-direction:column; gap:1rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:1.05rem; font-weight:bold; color:#38bdf8;">中央处理器 (CPU)</span>
                        <span style="font-size:0.75rem; background:rgba(56,189,248,0.15); color:#38bdf8; padding:2px 8px; border-radius:8px;">8 颗巨型全能核心</span>
                    </div>
                    <div style="font-size:0.78rem; color:var(--text-secondary); line-height:1.45;">
                        形象比喻：就像 <strong>8 位全能数学教授</strong>。精通复杂逻辑推导、分支预测。但给 800 万个简单像素逐个上色时，只能轮流排队计算，耗时极长。
                    </div>
                    
                    <div style="background:#020617; border:1px solid #1e293b; border-radius:var(--radius-md); padding:1rem; height:120px; display:flex; flex-direction:column; justify-content:center; gap:8px;">
                        <div style="display:flex; justify-content:space-between; font-size:0.75rem;">
                            <span>串行计算进度:</span>
                            <span id="cpu-bench-percent" style="font-family:var(--font-mono); color:#38bdf8;">0%</span>
                        </div>
                        <div style="width:100%; height:12px; background:#1e293b; border-radius:6px; overflow:hidden;">
                            <div id="cpu-bench-bar" style="width:0%; height:100%; background:linear-gradient(90deg, #38bdf8, #60a5fa); transition:width 0.1s linear;"></div>
                        </div>
                        <div id="cpu-bench-status" style="font-size:0.7rem; color:#64748b; font-family:var(--font-mono);">待命中...</div>
                    </div>
                </div>

                <!-- GPU 卡片 -->
                <div style="background:#090d16; border:1px solid rgba(0,245,155,0.4); border-radius:var(--radius-lg); padding:1.25rem; display:flex; flex-direction:column; gap:1rem; box-shadow:0 0 20px rgba(0,245,155,0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:1.05rem; font-weight:bold; color:var(--green-success);">图形处理器 (GPU)</span>
                        <span style="font-size:0.75rem; background:rgba(0,245,155,0.15); color:var(--green-success); padding:2px 8px; border-radius:8px;">5888 颗流处理器 (CUDA)</span>
                    </div>
                    <div style="font-size:0.78rem; color:var(--text-secondary); line-height:1.45;">
                        形象比喻：就像 <strong>5000 多位流水线工人</strong>。只会做简单的乘加运算，但大家<strong>同一瞬间全体同时动手</strong>，海量像素在 1 帧（16ms）内瞬间填满！
                    </div>

                    <div style="background:#020617; border:1px solid rgba(0,245,155,0.3); border-radius:var(--radius-md); padding:1rem; height:120px; display:flex; flex-direction:column; justify-content:center; gap:8px;">
                        <div style="display:flex; justify-content:space-between; font-size:0.75rem;">
                            <span>大规模并行吞吐:</span>
                            <span id="gpu-bench-percent" style="font-family:var(--font-mono); color:var(--green-success);">0%</span>
                        </div>
                        <div style="width:100%; height:12px; background:#1e293b; border-radius:6px; overflow:hidden;">
                            <div id="gpu-bench-bar" style="width:0%; height:100%; background:linear-gradient(90deg, var(--green-success), #00f3ff); transition:width 0.1s linear;"></div>
                        </div>
                        <div id="gpu-bench-status" style="font-size:0.7rem; color:#64748b; font-family:var(--font-mono);">待命中...</div>
                    </div>

                </div>

            </div>
        </div>
        `;

        const benchBtn = document.getElementById('btn-benchmark');
        if (benchBtn) {
            benchBtn.addEventListener('click', () => {
                this.runBenchmark();
            });
        }
    }

    runBenchmark() {
        if (window.soundEngine) window.soundEngine.startFanSound();

        const cpuBar = document.getElementById('cpu-bench-bar');
        const cpuTxt = document.getElementById('cpu-bench-percent');
        const cpuStatus = document.getElementById('cpu-bench-status');

        const gpuBar = document.getElementById('gpu-bench-bar');
        const gpuTxt = document.getElementById('gpu-bench-percent');
        const gpuStatus = document.getElementById('gpu-bench-status');

        let gpuP = 0;
        gpuStatus.textContent = '🔥 5888 核心全体并行吞吐中...';
        const gpuTimer = setInterval(() => {
            gpuP += 15;
            if (gpuP >= 100) {
                gpuP = 100;
                clearInterval(gpuTimer);
                gpuBar.style.width = '100%';
                gpuTxt.textContent = '100%';
                gpuStatus.textContent = '✓ 4K 画面并行渲染完成！耗时: 16.6 ms (60 FPS)';
                if (window.soundEngine) window.soundEngine.playSuccessChord();
            } else {
                gpuBar.style.width = `${gpuP}%`;
                gpuTxt.textContent = `${gpuP}%`;
            }
        }, 70);

        let cpuP = 0;
        cpuStatus.textContent = '⚙️ 8 个核心轮流排队上色中...';
        const cpuTimer = setInterval(() => {
            cpuP += 3;
            if (cpuP >= 100) {
                cpuP = 100;
                clearInterval(cpuTimer);
                cpuBar.style.width = '100%';
                cpuTxt.textContent = '100%';
                cpuStatus.textContent = '✓ CPU 艰难串行渲染完毕，耗时约为 GPU 的 25 倍！';
                if (window.soundEngine) window.soundEngine.stopFanSound();
            } else {
                cpuBar.style.width = `${cpuP}%`;
                cpuTxt.textContent = `${Math.round(cpuP)}%`;
            }
        }, 110);
    }
}

window.xrayEngine = new XRayEngine();
