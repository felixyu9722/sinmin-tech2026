/**
 * 独中高中资讯科技 - 电脑硬件互动教育游戏
 * 网络拓扑与数据流动交互引擎 (家庭式网络 vs 学校校园局域网)
 * 1. 执行功能按键移至画布下方，方便观察拓扑时直接点击
 * 2. 移除微观原理解剖模块，界面更清爽聚焦
 * 3. 数据流放慢速度 (默认 2.0s 教学慢速，支持切换)
 * 4. 学校网络参考第三图强化清晰文字标签 (有线 LAN、PoE 供电网线、内网直连)，AP 1 与 AP 2 紧凑直观呈现下挂无线终端 (学生平板、教师手机)
 * 5. 深度支持手机与移动端自适应浏览 (可横向轻触滑动画布，按钮全宽易点)
 */

class NetworkEngine {
    constructor() {
        this.currentMode = 'home'; // 'home' | 'school'
        this.isTransmitting = false;
        this.clearSchoolFlash();
        this.clearHomeFlash();
        this.stepDuration = 2000; // 默认 2.0s 教学慢速 (数据流通放慢速度)
        this.activeTimer = null;
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        const toggleHome = document.getElementById('btn-net-home');
        const toggleSchool = document.getElementById('btn-net-school');

        if (toggleHome && toggleSchool) {
            toggleHome.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                this.stopCurrentAnimation();
                this.currentMode = 'home';
                toggleHome.classList.add('active');
                toggleSchool.classList.remove('active');
                this.render();
            });

            toggleSchool.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                this.stopCurrentAnimation();
                this.currentMode = 'school';
                toggleSchool.classList.add('active');
                toggleHome.classList.remove('active');
                this.render();
            });
        }
    }

    clearHomeFlash() {
        const ids = ['home-node-isp', 'home-node-modem', 'home-node-router', 'home-node-pc', 'home-node-phone', 'home-node-tv'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove('node-flash-purple', 'node-flash-blue', 'node-flash-green', 'node-flash-red', 'node-flash-yellow', 'node-flash-cyan');
            }
        });
    }

    clearSchoolFlash() {
        const ids = ['sch-node-isp', 'sch-node-modem', 'sch-node-router', 'sch-node-switch', 'sch-node-lab', 'sch-node-ap1', 'sch-node-ap2', 'sch-node-server'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove('node-flash-purple', 'node-flash-blue', 'node-flash-green', 'node-flash-red', 'node-flash-yellow', 'node-flash-cyan');
            }
        });
    }

    stopCurrentAnimation() {
        if (this.activeTimer) {
            clearTimeout(this.activeTimer);
            this.activeTimer = null;
        }
        this.isTransmitting = false;

        // 复位上下行指示器动态类
        const indDown = document.getElementById('home-indicator-down');
        const indUp = document.getElementById('home-indicator-up');
        if (indDown) indDown.classList.remove('flow-active', 'flow-dimmed');
        if (indUp) indUp.classList.remove('flow-active', 'flow-dimmed');
        document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('step-highlight'));
    }

    toggleSpeed() {
        if (this.stepDuration === 2000) {
            this.stepDuration = 1200;
        } else {
            this.stepDuration = 2000;
        }
        const btn = document.getElementById('btn-speed-toggle');
        if (btn) {
            btn.innerHTML = this.stepDuration === 2000 
                ? `<span>🐢</span> 速度: 慢速教学 (2.0s)` 
                : `<span>⚡</span> 速度: 常规速度 (1.2s)`;
        }
    }

    render() {
        const stage = document.getElementById('network-stage-mount');
        if (!stage) return;

        if (this.currentMode === 'home') {
            this.renderHomeNetwork(stage);
        } else {
            this.renderSchoolNetwork(stage);
        }
    }

    // =========================================================================
    // 1. 家庭式网络 (Home SOHO)
    // =========================================================================
    renderHomeNetwork(stage) {
        stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1rem; width:100%;">
            
            <!-- 顶部标题栏 (去除冗余按钮，干净整洁) -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div>
                    <h3 style="font-size:1.15rem; color:#ffffff; font-weight:700; display:flex; align-items:center; gap:0.5rem;">
                        <span>🏠</span> 家庭式网络拓扑与光电双向转换 (Home SOHO Network)
                    </h3>
                    <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">
                        电信 ISP 光纤 ⇄ 调制解调器/数据机 (Modem) ⇄ 无线路由器 ⇄ 电脑 / 手机 / 智能电视
                    </p>
                </div>
            </div>

            <!-- 主网络拓扑图容器 (支持移动端平滑横向拖拽与缩放) -->
            <div style="background:#070b14; border:1px solid rgba(0,243,255,0.25); border-radius:var(--radius-lg); padding:1rem; position:relative;">
                
                <!-- 手机浏览友好提示条 -->
                <div class="mobile-scroll-hint">
                    <span>📱</span>
                    <span>手机端浏览提示：若屏幕较窄，可直接在下方网络图上左右滑动查看全貌</span>
                </div>

                <!-- 设备小标签条 -->
                <div style="display:flex; gap:0.75rem; margin-bottom:1rem; flex-wrap:wrap;">
                    <div style="display:flex; gap:0.6rem; background:rgba(18,26,43,0.85); border:1px solid rgba(251,191,36,0.35); border-radius:var(--radius-md); padding:0.4rem 0.75rem; align-items:center;">
                        <img src="assets/modem.jpg" alt="调制解调器 / 数据机" style="width:44px; height:44px; border-radius:6px; object-fit:cover; border:1px solid #fbbf24; flex-shrink:0;" />
                        <div>
                            <div style="font-size:0.8rem; font-weight:bold; color:#fbbf24;">调制解调器 / 数据机 (Modem)</div>
                            <div style="font-size:0.68rem; color:var(--text-secondary);">光电信号双向转换 (Optical ⇄ Electrical)</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:0.6rem; background:rgba(18,26,43,0.85); border:1px solid rgba(0,245,155,0.35); border-radius:var(--radius-md); padding:0.4rem 0.75rem; align-items:center;">
                        <img src="assets/router.jpg" alt="无线路由器" style="width:44px; height:44px; border-radius:6px; object-fit:cover; border:1px solid #00f59b; flex-shrink:0;" />
                        <div>
                            <div style="font-size:0.8rem; font-weight:bold; color:#00f59b;">无线路由器 (Wi-Fi Router)</div>
                            <div style="font-size:0.68rem; color:var(--text-secondary);">NAT 私网 IP 分配 (192.168.1.x) • 双频无线</div>
                        </div>
                    </div>
                </div>

                <!-- SVG 拓扑图 (带外层滚动容器，手机端不压缩文字) -->
                <div class="network-canvas-scroll-wrap">
                    <svg id="home-net-svg" viewBox="0 0 960 380" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <marker id="arrow-down-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 1 L 10 5 L 0 9 z" fill="#ff4757" />
                            </marker>
                            <marker id="arrow-up-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                            </marker>
                            <filter id="packetGlowGold" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                            <filter id="packetGlowCyan" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <!-- 背景流向提示系统 (带动态流光、虚线传送带与节点高亮) -->
                        <g id="home-indicator-down" class="flow-indicator-group flow-down">
                            <!-- 下行传送虚线 (动态向右流动) -->
                            <line class="flow-dash-line line-down" x1="100" y1="38" x2="760" y2="38" stroke="#ff4757" stroke-width="2.5" stroke-dasharray="8,6" marker-end="url(#arrow-down-red)" />
                            
                            <!-- 下行文字 HUD 胶囊底衬 (半透背景 + 科技描边) -->
                            <rect class="flow-badge-bg badge-down" x="110" y="15" width="640" height="26" rx="13" ry="13" />
                            
                            <!-- 下行文字呈现：带动态流光扫光与各节点高亮 -->
                            <text class="flow-text flow-text-down" x="430" y="28" text-anchor="middle">
                                <tspan class="flow-icon flow-icon-down">⬇️</tspan>
                                <tspan class="flow-title title-down"> 下行数据流向 (Downstream): </tspan>
                                <tspan id="flow-down-s1" class="flow-step step-fiber">ISP光纤</tspan>
                                <tspan class="flow-arrow arrow-down"> ➔ </tspan>
                                <tspan id="flow-down-s2" class="flow-step step-modem">Modem解调</tspan>
                                <tspan class="flow-arrow arrow-down"> ➔ </tspan>
                                <tspan id="flow-down-s3" class="flow-step step-router">路由器分发</tspan>
                                <tspan class="flow-arrow arrow-down"> ➔ </tspan>
                                <tspan id="flow-down-s4" class="flow-step step-client">终端 (电脑/手机/电视)</tspan>
                            </text>
                        </g>

                        <g id="home-indicator-up" class="flow-indicator-group flow-up">
                            <!-- 上行传送虚线 (动态向左流动) -->
                            <line class="flow-dash-line line-up" x1="760" y1="360" x2="100" y2="360" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="8,6" marker-end="url(#arrow-up-blue)" />
                            
                            <!-- 上行文字 HUD 胶囊底衬 (半透背景 + 科技描边) -->
                            <rect class="flow-badge-bg badge-up" x="110" y="347" width="640" height="26" rx="13" ry="13" />
                            
                            <!-- 上行文字呈现：带动态逆向流光与各节点高亮 -->
                            <text class="flow-text flow-text-up" x="430" y="360" text-anchor="middle">
                                <tspan class="flow-icon flow-icon-up">⬆️</tspan>
                                <tspan class="flow-title title-up"> 上行数据流向 (Upstream): </tspan>
                                <tspan id="flow-up-s1" class="flow-step step-client">终端设备0/1</tspan>
                                <tspan class="flow-arrow arrow-up"> ➔ </tspan>
                                <tspan id="flow-up-s2" class="flow-step step-router">路由器汇聚</tspan>
                                <tspan class="flow-arrow arrow-up"> ➔ </tspan>
                                <tspan id="flow-up-s3" class="flow-step step-modem">Modem调制为激光</tspan>
                                <tspan class="flow-arrow arrow-up"> ➔ </tspan>
                                <tspan id="flow-up-s4" class="flow-step step-fiber">光纤汇入ISP</tspan>
                            </text>
                        </g>

                        <!-- 物理链路 1: ISP -> Modem (光纤线: 黄色粗虚线) -->
                        <line id="home-line-fiber" x1="110" y1="190" x2="250" y2="190" stroke="#fbbf24" stroke-width="5" stroke-dasharray="8,5" />
                        <text x="180" y="174" fill="#fbbf24" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">光纤线 (Fiber Optic)</text>
                        <text x="180" y="212" fill="#94a3b8" font-size="8.5" font-family="monospace" text-anchor="middle">激光闪烁脉冲 ✨</text>

                        <!-- 物理链路 2: Modem -> 路由器 (RJ45 双绞线: 青色实线) -->
                        <line id="home-line-lan-main" x1="365" y1="190" x2="490" y2="190" stroke="#38bdf8" stroke-width="3.5" />
                        <text x="428" y="174" fill="#38bdf8" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">双绞线 (RJ45 网线)</text>
                        <text x="428" y="212" fill="#34d399" font-size="8.5" font-family="monospace" text-anchor="middle">方波电信号 0/1 ⚡</text>

                        <!-- 物理链路 3: 路由器 -> 台式电脑 PC (LAN 1) -->
                        <path id="home-line-lan1" d="M 590 190 L 660 190 L 660 95 L 750 95" fill="none" stroke="#38bdf8" stroke-width="2.5" />
                        <text x="690" y="85" fill="#38bdf8" font-size="9.5" font-family="monospace" font-weight="bold">有线 LAN 1</text>

                        <!-- 物理链路 4: 路由器 -> 手机/笔记本 (Wi-Fi 无线电波) -->
                        <g id="home-wifi-waves" opacity="0.8">
                            <path d="M 595 165 A 35 35 0 0 1 630 190" fill="none" stroke="#00f59b" stroke-width="2" stroke-dasharray="4,3" />
                            <path d="M 595 145 A 55 55 0 0 1 650 190" fill="none" stroke="#00f59b" stroke-width="2" stroke-dasharray="4,3" />
                            <path d="M 595 125 A 75 75 0 0 1 670 190" fill="none" stroke="#00f59b" stroke-width="2" stroke-dasharray="4,3" />
                            <line id="home-line-wifi" x1="590" y1="190" x2="750" y2="190" stroke="#00f59b" stroke-width="2" stroke-dasharray="5,4" />
                            <text x="665" y="180" fill="#00f59b" font-size="9.5" font-family="monospace" font-weight="bold">Wi-Fi 无线电波 📶</text>
                        </g>

                        <!-- 物理链路 5: 路由器 -> 智能电视 TV (LAN 2) -->
                        <path id="home-line-lan2" d="M 590 190 L 660 190 L 660 285 L 750 285" fill="none" stroke="#38bdf8" stroke-width="2.5" />
                        <text x="690" y="305" fill="#38bdf8" font-size="9.5" font-family="monospace" font-weight="bold">有线 LAN 2</text>

                        <!-- 节点 1: ISP 互联网专线 -->
                        <g id="home-node-isp" transform="translate(45, 145)">
                            <circle cx="45" cy="45" r="40" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
                            <circle cx="45" cy="45" r="33" fill="#1e293b" />
                            <text x="45" y="40" fill="#f8fafc" font-size="20" text-anchor="middle">🌐</text>
                            <text x="45" y="60" fill="#38bdf8" font-size="9.5" font-weight="bold" text-anchor="middle">ISP 电信专线</text>
                            <text x="45" y="73" fill="#64748b" font-size="7.5" font-family="monospace" text-anchor="middle">Internet Fiber</text>
                        </g>

                        <!-- 节点 2: 调制解调器 / 数据机 (Modem) -->
                        <g id="home-node-modem" transform="translate(250, 140)">
                            <rect x="0" y="0" width="115" height="100" rx="8" fill="#111827" stroke="#fbbf24" stroke-width="2.5" />
                            <rect x="-4" y="42" width="6" height="16" rx="1" fill="#2563eb" /> <!-- SC/APC 光纤蓝口 -->
                            <rect x="113" y="42" width="6" height="16" rx="1" fill="#f59e0b" /> <!-- RJ45 黄口 -->
                            <text x="57" y="24" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">调制解调器/数据机</text>
                            <text x="57" y="38" fill="#94a3b8" font-size="8.5" text-anchor="middle">(Modem)</text>
                            <rect x="15" y="46" width="85" height="28" rx="4" fill="#090d16" stroke="#334155" stroke-width="1" />
                            <text x="57" y="64" id="home-modem-core-txt" fill="#34d399" font-size="8.5" font-family="monospace" font-weight="bold" text-anchor="middle">光电 ⇄ 0101 转换</text>
                            <circle id="home-led-pon" cx="28" cy="88" r="3" fill="#00f59b" />
                            <text x="36" y="91" fill="#64748b" font-size="7.5" font-family="monospace">PON</text>
                            <circle id="home-led-lan" cx="72" cy="88" r="3" fill="#00f3ff" />
                            <text x="80" y="91" fill="#64748b" font-size="7.5" font-family="monospace">LAN</text>
                        </g>

                        <!-- 节点 3: 无线路由器 (Wi-Fi Router) -->
                        <g id="home-node-router" transform="translate(490, 135)">
                            <line x1="20" y1="20" x2="8" y2="-12" stroke="#00f59b" stroke-width="3" stroke-linecap="round" />
                            <line x1="38" y1="20" x2="32" y2="-15" stroke="#00f59b" stroke-width="3" stroke-linecap="round" />
                            <line x1="62" y1="20" x2="68" y2="-15" stroke="#00f59b" stroke-width="3" stroke-linecap="round" />
                            <line x1="80" y1="20" x2="92" y2="-12" stroke="#00f59b" stroke-width="3" stroke-linecap="round" />
                            <rect x="0" y="20" width="100" height="90" rx="8" fill="#111827" stroke="#00f59b" stroke-width="2" />
                            <text x="50" y="46" fill="#00f59b" font-size="10.5" font-weight="bold" text-anchor="middle">无线路由器</text>
                            <text x="50" y="60" fill="#94a3b8" font-size="8.5" text-anchor="middle">(Wi-Fi Router)</text>
                            <rect x="12" y="68" width="76" height="22" rx="3" fill="#090d16" stroke="#334155" stroke-width="1" />
                            <text x="50" y="83" fill="#cbd5e1" font-size="7.5" font-family="monospace" text-anchor="middle">NAT / DHCP 192.168.1.1</text>
                            <rect x="-3" y="50" width="5" height="12" fill="#38bdf8" />
                        </g>

                        <!-- 节点 4: 台式电脑 PC (有线 LAN 1) -->
                        <g id="home-node-pc" transform="translate(750, 55)">
                            <rect x="0" y="0" width="115" height="75" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.8" />
                            <text x="57" y="26" fill="#f8fafc" font-size="16" text-anchor="middle">🖥️</text>
                            <text x="57" y="46" fill="#f8fafc" font-size="9.5" font-weight="bold" text-anchor="middle">台式电脑 (PC)</text>
                            <text x="57" y="60" fill="#38bdf8" font-size="7.5" font-family="monospace" text-anchor="middle">192.168.1.100 (有线)</text>
                        </g>

                        <!-- 节点 5: 手机 / 笔记本 (无线 Wi-Fi) -->
                        <g id="home-node-phone" transform="translate(750, 150)">
                            <rect x="0" y="0" width="115" height="75" rx="6" fill="#132337" stroke="#00f59b" stroke-width="2" />
                            <text x="57" y="26" fill="#f8fafc" font-size="16" text-anchor="middle">📱 💻</text>
                            <text x="57" y="46" fill="#00f59b" font-size="9.5" font-weight="bold" text-anchor="middle">手机 / 笔记本</text>
                            <text x="57" y="60" fill="#a7f3d0" font-size="7.5" font-family="monospace" text-anchor="middle">192.168.1.101 (Wi-Fi)</text>
                        </g>

                        <!-- 节点 6: 智能电视 TV (有线 LAN 2) -->
                        <g id="home-node-tv" transform="translate(750, 245)">
                            <rect x="0" y="0" width="115" height="75" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="1.8" />
                            <text x="57" y="26" fill="#f8fafc" font-size="16" text-anchor="middle">📺</text>
                            <text x="57" y="46" fill="#f8fafc" font-size="9.5" font-weight="bold" text-anchor="middle">智能电视 (TV)</text>
                            <text x="57" y="60" fill="#cbd5e1" font-size="7.5" font-family="monospace" text-anchor="middle">192.168.1.102 (有线)</text>
                        </g>

                        <!-- 动态飞行动画光电转换数据包 -->
                        <circle id="home-packet-main" cx="110" cy="190" r="9" fill="#fbbf24" filter="url(#packetGlowGold)" style="display:none;" />
                        <circle id="home-packet-pc" cx="590" cy="190" r="7" fill="#38bdf8" filter="url(#packetGlowCyan)" style="display:none;" />
                        <circle id="home-packet-phone" cx="590" cy="190" r="7" fill="#00f59b" filter="url(#packetGlowCyan)" style="display:none;" />
                        <circle id="home-packet-tv" cx="590" cy="190" r="7" fill="#38bdf8" filter="url(#packetGlowCyan)" style="display:none;" />

                        <g id="home-tag-group" style="display:none;">
                            <rect id="home-tag-bg" x="0" y="0" width="135" height="22" rx="4" fill="#020617" stroke="#fbbf24" stroke-width="1.2" />
                            <text id="home-tag-text" x="67" y="15" fill="#fbbf24" font-size="8.5" font-family="monospace" font-weight="bold" text-anchor="middle">激光脉冲 ✨</text>
                        </g>
                    </svg>
                </div>

                <!-- 🌟 用户特别要求：执行功能按键搬到下方，容易点击 🌟 -->
                <div class="network-bottom-toolbar">
                    <div class="network-action-btns-group">
                        <button id="btn-home-down" class="network-action-btn btn-down">
                            <span>⬇️</span> 下行接收：光数据 ➔ Modem解调为0/1 ➔ 路由器 ➔ 终端设备
                        </button>
                        <button id="btn-home-up" class="network-action-btn btn-up">
                            <span>⬆️</span> 上行发送：终端0/1 ➔ 路由器 ➔ Modem调制为激光 ➔ 光纤
                        </button>
                    </div>
                    <button id="btn-speed-toggle" class="speed-toggle-btn">
                        <span>🐢</span> 速度: 慢速教学 (2.0s)
                    </button>
                </div>

                <!-- 流程状态实时解说气泡 (位于按键下方) -->
                <div id="home-flow-status" style="margin-top:0.75rem; background:rgba(0,243,255,0.08); border-left:4px solid var(--cyan-primary); padding:0.85rem 1.25rem; border-radius:0 var(--radius-sm) var(--radius-sm) 0; font-size:0.85rem; color:#cbd5e1; line-height:1.6;">
                    💡 <strong>观察重点</strong>：点击上方 <strong>【⬇️ 下行接收】</strong> 观察光信号如何被 Modem 内部光敏管<strong>解调为 0/1</strong> 并交付给电脑/手机/电视；点击 <strong>【⬆️ 上行发送】</strong> 观察设备发出的 0/1 如何被 Modem 内部激光二极管<strong>调制为激光光波</strong>射入光纤！当前为<strong>慢速教学模式 (2.0秒/步)</strong>，让每一步数据转换清晰可见。
                </div>

            </div>
        </div>
        `;

        this.bindHomeActions();
    }

    bindHomeActions() {
        const btnDown = document.getElementById('btn-home-down');
        const btnUp = document.getElementById('btn-home-up');
        const btnSpeed = document.getElementById('btn-speed-toggle');

        if (btnDown) {
            btnDown.addEventListener('click', () => {
                this.animateHomeDownstream();
            });
        }

        if (btnUp) {
            btnUp.addEventListener('click', () => {
                this.animateHomeUpstream();
            });
        }

        if (btnSpeed) {
            btnSpeed.addEventListener('click', () => {
                this.toggleSpeed();
            });
        }
    }

    // =========================================================================
    // 家庭网络下行：光纤(光脉冲) ➔ Modem解调(0/1) ➔ 路由器 ➔ 电脑/手机/电视
    // =========================================================================
    animateHomeDownstream() {
        if (this.isTransmitting) return;
        this.isTransmitting = true;

        const pMain = document.getElementById('home-packet-main');
        const pPc = document.getElementById('home-packet-pc');
        const pPhone = document.getElementById('home-packet-phone');
        const pTv = document.getElementById('home-packet-tv');

        const tagGroup = document.getElementById('home-tag-group');
        const tagBg = document.getElementById('home-tag-bg');
        const tagText = document.getElementById('home-tag-text');
        const statusBox = document.getElementById('home-flow-status');

        const lineFiber = document.getElementById('home-line-fiber');
        const lineLanMain = document.getElementById('home-line-lan-main');
        const nodeModem = document.getElementById('home-node-modem');
        const modemCoreTxt = document.getElementById('home-modem-core-txt');

        const badgeFiber = document.getElementById('badge-fiber-state');
        const badgeModem = document.getElementById('badge-modem-mode');
        const badgeLan = document.getElementById('badge-lan-state');
        const txtModemIn = document.getElementById('txt-modem-in');
        const txtModemArrow = document.getElementById('txt-modem-arrow');
        const txtModemOut = document.getElementById('txt-modem-out');

        if (!pMain || !statusBox || !tagGroup) return;

        // 激活下行流向 HUD 高能流光，弱化上行
        const indDown = document.getElementById('home-indicator-down');
        const indUp = document.getElementById('home-indicator-up');
        if (indDown) {
            indDown.classList.add('flow-active');
            indDown.classList.remove('flow-dimmed');
        }
        if (indUp) {
            indUp.classList.remove('flow-active');
            indUp.classList.add('flow-dimmed');
        }
        const highlightStepDown = (stepId) => {
            document.querySelectorAll('#home-indicator-down .flow-step').forEach(s => s.classList.remove('step-highlight'));
            const el = document.getElementById(stepId);
            if (el) el.classList.add('step-highlight');
        };

        this.clearHomeFlash();
        pMain.style.display = 'block';
        pPc.style.display = 'none';
        pPhone.style.display = 'none';
        pTv.style.display = 'none';
        tagGroup.style.display = 'block';
        if (lineFiber) lineFiber.classList.add('anim-fiber-active');

        if (window.soundEngine) window.soundEngine.playClick();

        // 阶段 1: 光纤激光脉冲传输 (从 ISP 飞向 Modem)
        pMain.setAttribute('cx', '110');
        pMain.setAttribute('cy', '190');
        pMain.setAttribute('fill', '#fbbf24');
        pMain.setAttribute('filter', 'url(#packetGlowGold)');
        tagGroup.setAttribute('transform', 'translate(60, 215)');
        tagBg.setAttribute('stroke', '#fbbf24');
        tagText.setAttribute('fill', '#fbbf24');
        tagText.textContent = '光脉冲 (Laser Wave) ✨';

        if (badgeFiber) {
            badgeFiber.style.color = '#fbbf24';
            badgeFiber.style.borderColor = '#fbbf24';
            badgeFiber.textContent = '高频激光闪烁 (1310nm)';
        }
        if (badgeModem) badgeModem.textContent = '准备接收光信号';
        if (badgeLan) badgeLan.textContent = '等待调制解调器输出';

        highlightStepDown('flow-down-s1');
        statusBox.innerHTML = `<strong>1/4 [光纤传输阶段]</strong> ISP 电信机房通过单模玻璃光纤，以 1310/1490nm 高频激光闪烁脉冲形式，向用户家庭传送数据包...`;

        this.activeTimer = setTimeout(() => {
            // 阶段 2: 抵达调制解调器 / 数据机 (Modem) 内部进行【解调 Demodulation】
            pMain.setAttribute('cx', '300');
            pMain.setAttribute('cy', '190');
            tagGroup.setAttribute('transform', 'translate(240, 115)');
            tagBg.setAttribute('stroke', '#34d399');
            tagText.setAttribute('fill', '#34d399');
            tagText.textContent = '光电解调 ➔ 01010011 ⚡';

            if (nodeModem) nodeModem.classList.add('anim-modem-working');
            if (modemCoreTxt) {
                modemCoreTxt.textContent = '解调中: 光 ➔ 0101';
                modemCoreTxt.setAttribute('fill', '#fbbf24');
            }
            if (badgeModem) {
                badgeModem.style.color = '#34d399';
                badgeModem.style.borderColor = '#34d399';
                badgeModem.textContent = '解调中: 光脉冲 ➔ 0/1';
            }
            if (txtModemIn) txtModemIn.textContent = '激光脉冲 ✨';
            if (txtModemArrow) {
                txtModemArrow.textContent = '➔ [光敏管] ➔';
                txtModemArrow.style.color = '#34d399';
            }
            if (txtModemOut) txtModemOut.textContent = '01010011 (高低电平)';

            highlightStepDown('flow-down-s2');
            this.clearHomeFlash();
            document.getElementById('home-node-modem')?.classList.add('node-flash-yellow');
            statusBox.innerHTML = `<strong>2/4 [Modem 核心解调]</strong> 调制解调器 / 数据机 (Modem) 内部<strong>光敏二极管 (Photodiode)</strong> 探测到光脉冲并感应产生弱光电流，再经放大整形电路<strong>解调 (Demodulate) 为二进制数字方波 01010011 (0V/3.3V)</strong>！`;
            if (window.soundEngine) window.soundEngine.playClick();

            this.activeTimer = setTimeout(() => {
                // 阶段 3: 二进制数字电信号 0/1 沿网线进入无线路由器
                if (lineFiber) lineFiber.classList.remove('anim-fiber-active');
                if (lineLanMain) lineLanMain.classList.add('anim-lan-active');
                if (nodeModem) nodeModem.classList.remove('anim-modem-working');

                pMain.setAttribute('cx', '540');
                pMain.setAttribute('cy', '190');
                pMain.setAttribute('fill', '#00f3ff');
                pMain.setAttribute('filter', 'url(#packetGlowCyan)');
                tagGroup.setAttribute('transform', 'translate(470, 215)');
                tagBg.setAttribute('stroke', '#00f3ff');
                tagText.setAttribute('fill', '#00f3ff');
                tagText.textContent = '方波数字帧 01010011 ⚡';

                if (badgeLan) {
                    badgeLan.style.color = '#00f3ff';
                    badgeLan.style.borderColor = '#00f3ff';
                    badgeLan.textContent = '以太网电平 01010011';
                }

                highlightStepDown('flow-down-s3');
                this.clearHomeFlash();
                document.getElementById('home-node-router')?.classList.add('node-flash-green');
                statusBox.innerHTML = `<strong>3/4 [路由器分发]</strong> 路由器 (Wi-Fi Router) 接收网线差分方波信号，解包 IP 数据报头并查询 NAT 映射表，同时将数据包推送给台式机 (LAN 1)、手机 (Wi-Fi)、智能电视 (LAN 2)...`;
                if (window.soundEngine) window.soundEngine.playClick();

                this.activeTimer = setTimeout(() => {
                    // 阶段 4: 分裂并平滑到达台式电脑、手机、智能电视
                    pMain.style.display = 'none';
                    tagGroup.style.display = 'none';

                    this.clearHomeFlash();
                    // 隐藏小圆圈，整个格子高能闪烁！
                    if (pPc) pPc.style.display = 'none';
                    if (pPhone) pPhone.style.display = 'none';
                    if (pTv) pTv.style.display = 'none';

                    document.getElementById('home-node-pc')?.classList.add('node-flash-blue');
                    document.getElementById('home-node-phone')?.classList.add('node-flash-green');
                    document.getElementById('home-node-tv')?.classList.add('node-flash-blue');

                    pPc.setAttribute('cx', '750');
                    pPc.setAttribute('cy', '95');
                    pPhone.setAttribute('cx', '750');
                    pPhone.setAttribute('cy', '190');
                    pTv.setAttribute('cx', '750');
                    pTv.setAttribute('cy', '285');

                    highlightStepDown('flow-down-s4');
                    statusBox.innerHTML = `✓ <strong>4/4 [终端交付完成]</strong> 电脑网卡、手机 Wi-Fi 芯片、电视主板均成功接收到 <code>01010011</code> 数字电信号，数据写入 RAM 内存，网页与影片瞬间加载呈现！`;
                    if (window.soundEngine) window.soundEngine.playSuccessChord();

                    this.activeTimer = setTimeout(() => {
                        pPc.style.display = 'none';
                        pPhone.style.display = 'none';
                        pTv.style.display = 'none';
                        if (lineLanMain) lineLanMain.classList.remove('anim-lan-active');
                        if (badgeFiber) badgeFiber.textContent = '待机';
                        if (badgeLan) badgeLan.textContent = '待机';
                        if (modemCoreTxt) {
                            modemCoreTxt.textContent = '光电 ⇄ 0101 转换';
                            modemCoreTxt.setAttribute('fill', '#34d399');
                        }
                        // 复位下行流向指示条
                        document.querySelectorAll('#home-indicator-down .flow-step').forEach(s => s.classList.remove('step-highlight'));
                        if (indDown) indDown.classList.remove('flow-active', 'flow-dimmed');
                        if (indUp) indUp.classList.remove('flow-active', 'flow-dimmed');
                        this.isTransmitting = false;
                    }, 1500);

                }, this.stepDuration);

            }, this.stepDuration);

        }, this.stepDuration);
    }

    // =========================================================================
    // 家庭网络上行：终端设备(发出0/1) ➔ 路由器 ➔ Modem调制为激光 ➔ 光纤 ➔ ISP
    // =========================================================================
    animateHomeUpstream() {
        if (this.isTransmitting) return;
        this.isTransmitting = true;

        const pMain = document.getElementById('home-packet-main');
        const pPc = document.getElementById('home-packet-pc');
        const pPhone = document.getElementById('home-packet-phone');
        const pTv = document.getElementById('home-packet-tv');

        const tagGroup = document.getElementById('home-tag-group');
        const tagBg = document.getElementById('home-tag-bg');
        const tagText = document.getElementById('home-tag-text');
        const statusBox = document.getElementById('home-flow-status');

        const lineFiber = document.getElementById('home-line-fiber');
        const lineLanMain = document.getElementById('home-line-lan-main');
        const nodeModem = document.getElementById('home-node-modem');
        const modemCoreTxt = document.getElementById('home-modem-core-txt');

        const badgeFiber = document.getElementById('badge-fiber-state');
        const badgeModem = document.getElementById('badge-modem-mode');
        const badgeLan = document.getElementById('badge-lan-state');
        const txtModemIn = document.getElementById('txt-modem-in');
        const txtModemArrow = document.getElementById('txt-modem-arrow');
        const txtModemOut = document.getElementById('txt-modem-out');

        if (!pMain || !statusBox || !tagGroup) return;

        // 激活上行流向 HUD 高能流光，弱化下行
        const indDown = document.getElementById('home-indicator-down');
        const indUp = document.getElementById('home-indicator-up');
        if (indUp) {
            indUp.classList.add('flow-active');
            indUp.classList.remove('flow-dimmed');
        }
        if (indDown) {
            indDown.classList.remove('flow-active');
            indDown.classList.add('flow-dimmed');
        }
        const highlightStepUp = (stepId) => {
            document.querySelectorAll('#home-indicator-up .flow-step').forEach(s => s.classList.remove('step-highlight'));
            const el = document.getElementById(stepId);
            if (el) el.classList.add('step-highlight');
        };

        // 阶段 1: 终端设备发出数字信号 01010011 (例如手机发消息 / 电视请求影片)
        pMain.style.display = 'none';
        this.clearHomeFlash();
        if (pPc) pPc.style.display = 'none';
        if (pPhone) pPhone.style.display = 'none';
        if (pTv) pTv.style.display = 'none';

        document.getElementById('home-node-pc')?.classList.add('node-flash-blue');
        document.getElementById('home-node-phone')?.classList.add('node-flash-green');
        document.getElementById('home-node-tv')?.classList.add('node-flash-blue');
        tagGroup.style.display = 'block';

        pPc.setAttribute('cx', '750');
        pPc.setAttribute('cy', '95');
        pPhone.setAttribute('cx', '750');
        pPhone.setAttribute('cy', '190');
        pTv.setAttribute('cx', '750');
        pTv.setAttribute('cy', '285');

        tagGroup.setAttribute('transform', 'translate(700, 215)');
        tagBg.setAttribute('stroke', '#00f59b');
        tagText.setAttribute('fill', '#00f59b');
        tagText.textContent = '设备发出 01010011 ⚡';

        if (badgeLan) {
            badgeLan.style.color = '#00f59b';
            badgeLan.style.borderColor = '#00f59b';
            badgeLan.textContent = '终端编译数字帧 0101';
        }
        if (badgeModem) badgeModem.textContent = '等待以太网帧汇聚';
        if (badgeFiber) badgeFiber.textContent = '光纤信道就绪';

        highlightStepUp('flow-up-s1');
        statusBox.innerHTML = `<strong>1/4 [终端发起数据]</strong> 手机/智能电视/电脑网卡将用户发出的网络请求编码为标准二进制高低电平数据帧 <code>01010011</code>...`;
        if (window.soundEngine) window.soundEngine.playClick();

        this.activeTimer = setTimeout(() => {
            // 阶段 2: 汇聚到路由器，推向 Modem
            pPc.style.display = 'none';
            pPhone.style.display = 'none';
            pTv.style.display = 'none';

            pMain.style.display = 'block';
            pMain.setAttribute('cx', '430');
            pMain.setAttribute('cy', '190');
            pMain.setAttribute('fill', '#38bdf8');
            pMain.setAttribute('filter', 'url(#packetGlowCyan)');

            tagGroup.setAttribute('transform', 'translate(370, 215)');
            tagBg.setAttribute('stroke', '#38bdf8');
            tagText.setAttribute('fill', '#38bdf8');
            tagText.textContent = '以太网电信号 ➔ Modem';

            if (lineLanMain) lineLanMain.classList.add('anim-lan-reverse');

            highlightStepUp('flow-up-s2');
            this.clearHomeFlash();
            document.getElementById('home-node-router')?.classList.add('node-flash-green');
            statusBox.innerHTML = `<strong>2/4 [路由上行汇聚]</strong> 路由器添加外网 IP 报头，通过 RJ45 双绞线将差分方波信号推向调制解调器 / 数据机 (Modem)...`;
            if (window.soundEngine) window.soundEngine.playClick();

            this.activeTimer = setTimeout(() => {
                // 阶段 3: Modem 内部进行【调制 Modulation】(电 ➔ 光)
                if (lineLanMain) lineLanMain.classList.remove('anim-lan-reverse');
                if (nodeModem) nodeModem.classList.add('anim-modem-working');

                pMain.setAttribute('cx', '300');
                pMain.setAttribute('cy', '190');
                pMain.setAttribute('fill', '#fbbf24');
                pMain.setAttribute('filter', 'url(#packetGlowGold)');

                tagGroup.setAttribute('transform', 'translate(230, 115)');
                tagBg.setAttribute('stroke', '#fbbf24');
                tagText.setAttribute('fill', '#fbbf24');
                tagText.textContent = '电光调制中 ➔ 激光脉冲 ✨';

                if (modemCoreTxt) {
                    modemCoreTxt.textContent = '调制中: 0101 ➔ 激光';
                    modemCoreTxt.setAttribute('fill', '#fbbf24');
                }
                if (badgeModem) {
                    badgeModem.style.color = '#fbbf24';
                    badgeModem.style.borderColor = '#fbbf24';
                    badgeModem.textContent = '调制中: 0/1 ➔ 激光';
                }
                if (txtModemIn) txtModemIn.textContent = '01010011 数字电平';
                if (txtModemArrow) {
                    txtModemArrow.textContent = '➔ [激光二极管] ➔';
                    txtModemArrow.style.color = '#fbbf24';
                }
                if (txtModemOut) txtModemOut.textContent = '高频激光脉冲 ✨';

                highlightStepUp('flow-up-s3');
                this.clearHomeFlash();
                document.getElementById('home-node-modem')?.classList.add('node-flash-yellow');
                statusBox.innerHTML = `<strong>3/4 [Modem 核心调制]</strong> 调制解调器 / 数据机内部<strong>激光驱动芯片与激光二极管 (Laser Diode)</strong> 启动！将二进制 0/1 电平方波<strong>调制 (Modulate) 为高频光波闪烁脉冲</strong>！`;
                if (window.soundEngine) window.soundEngine.playClick();

                this.activeTimer = setTimeout(() => {
                    // 阶段 4: 射入光纤线芯，光速飞向 ISP 互联网
                    if (nodeModem) nodeModem.classList.remove('anim-modem-working');
                    if (lineFiber) lineFiber.classList.add('anim-fiber-reverse');

                    pMain.setAttribute('cx', '110');
                    pMain.setAttribute('cy', '190');
                    tagGroup.setAttribute('transform', 'translate(60, 215)');
                    tagBg.setAttribute('stroke', '#f59e0b');
                    tagText.setAttribute('fill', '#f59e0b');
                    tagText.textContent = '激光穿透光纤射向 ISP ✨';

                    if (badgeFiber) {
                        badgeFiber.style.color = '#f59e0b';
                        badgeFiber.style.borderColor = '#f59e0b';
                        badgeFiber.textContent = '光脉冲高速全反射发射';
                    }

                    highlightStepUp('flow-up-s4');
                    this.clearHomeFlash();
                    statusBox.innerHTML = `✓ <strong>4/4 [上行发射交付成功]</strong> 激光脉冲以光速在二氧化硅光纤纤芯中高速全反射前行，顺利将设备请求交付给云端互联网服务器！`;
                    if (window.soundEngine) window.soundEngine.playSuccessChord();

                    this.activeTimer = setTimeout(() => {
                        pMain.style.display = 'none';
                        tagGroup.style.display = 'none';
                        if (lineFiber) lineFiber.classList.remove('anim-fiber-reverse');
                        if (badgeFiber) badgeFiber.textContent = '待机';
                        if (badgeLan) badgeLan.textContent = '待机';
                        if (modemCoreTxt) {
                            modemCoreTxt.textContent = '光电 ⇄ 0101 转换';
                            modemCoreTxt.setAttribute('fill', '#34d399');
                        }
                        // 复位上行流向指示条
                        document.querySelectorAll('#home-indicator-up .flow-step').forEach(s => s.classList.remove('step-highlight'));
                        if (indDown) indDown.classList.remove('flow-active', 'flow-dimmed');
                        if (indUp) indUp.classList.remove('flow-active', 'flow-dimmed');
                        this.clearHomeFlash();
                        this.isTransmitting = false;
                    }, 1500);

                }, this.stepDuration);

            }, this.stepDuration);

        }, this.stepDuration);
    }

    // =========================================================================
    // 2. 学校校园局域网 (School Campus & Dual APs - 参考第三图文字排布)
    // =========================================================================
    renderSchoolNetwork(stage) {
        stage.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1rem; width:100%;">
            
            <!-- 顶部标题栏 -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div>
                    <h3 style="font-size:1.15rem; color:#ffffff; font-weight:700; display:flex; align-items:center; gap:0.5rem;">
                        <span>🏫</span> 学校校园网络架构与双无线接入点 AP 拓扑 (Campus & Dual APs)
                    </h3>
                    <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">
                        ISP 校园光纤专线 ➔ 调制解调器/数据机 ➔ 核心路由防火墙 ➔ 核心交换机 ➔ 电脑室 + 教学楼 AP 1 (学生平板) + 大礼堂 AP 2 (教师手机) + 校园服务器
                    </p>
                </div>
            </div>

            <!-- 设备 Clipart 标签条 -->
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
                <!-- 1. 核心交换机 -->
                <div style="display:flex; gap:0.5rem; background:rgba(18,26,43,0.85); border:1px solid rgba(176,102,255,0.4); border-radius:var(--radius-md); padding:0.4rem 0.65rem; align-items:center;">
                    <img src="assets/switch.jpg" alt="交换机" style="width:42px; height:42px; border-radius:4px; object-fit:cover; border:1px solid #b066ff; flex-shrink:0;" />
                    <div>
                        <div style="font-size:0.78rem; font-weight:bold; color:#b066ff;">核心交换机 (Switch)</div>
                        <div style="font-size:0.65rem; color:var(--text-secondary);">24口千兆 • PoE 集中供电</div>
                    </div>
                </div>

                <!-- 2. 无线接入点 AP -->
                <div style="display:flex; gap:0.5rem; background:rgba(18,26,43,0.85); border:1px solid rgba(0,245,155,0.4); border-radius:var(--radius-md); padding:0.4rem 0.65rem; align-items:center;">
                    <img src="assets/ap.jpg" alt="无线接入点 AP" style="width:42px; height:42px; border-radius:4px; object-fit:cover; border:1px solid #00f59b; flex-shrink:0;" />
                    <div>
                        <div style="font-size:0.78rem; font-weight:bold; color:#00f59b;">无线接入点 (AP) ★新增★</div>
                        <div style="font-size:0.65rem; color:var(--text-secondary);">吸顶式高并发 • 供班级无线联网</div>
                    </div>
                </div>

                <!-- 3. 企业调制解调器 -->
                <div style="display:flex; gap:0.5rem; background:rgba(18,26,43,0.85); border:1px solid rgba(251,191,36,0.35); border-radius:var(--radius-md); padding:0.4rem 0.65rem; align-items:center;">
                    <img src="assets/modem.jpg" alt="调制解调器" style="width:42px; height:42px; border-radius:4px; object-fit:cover; border:1px solid #fbbf24; flex-shrink:0;" />
                    <div>
                        <div style="font-size:0.78rem; font-weight:bold; color:#fbbf24;">调制解调器/数据机 (Modem)</div>
                        <div style="font-size:0.65rem; color:var(--text-secondary);">光纤专线光电双向转换</div>
                    </div>
                </div>

                <!-- 4. 核心路由与防火墙 -->
                <div style="display:flex; gap:0.5rem; background:rgba(18,26,43,0.85); border:1px solid rgba(56,189,248,0.35); border-radius:var(--radius-md); padding:0.4rem 0.65rem; align-items:center;">
                    <img src="assets/router.jpg" alt="核心路由器" style="width:42px; height:42px; border-radius:4px; object-fit:cover; border:1px solid #38bdf8; flex-shrink:0;" />
                    <div>
                        <div style="font-size:0.78rem; font-weight:bold; color:#38bdf8;">核心路由器与防火墙</div>
                        <div style="font-size:0.65rem; color:var(--text-secondary);">VLAN 划分 • 校园网络防护</div>
                    </div>
                </div>
            </div>

            <!-- 校园拓扑连接 SVG 图 (带手机端自适应滚动条) -->
            <div style="background:#070b14; border:1px solid rgba(176,102,255,0.3); border-radius:var(--radius-lg); padding:1rem; position:relative;">
                
                <div class="mobile-scroll-hint">
                    <span>📱</span>
                    <span>手机端浏览提示：左右滑动可查看校园完整拓扑（电脑室、AP 1、AP 2、服务器）</span>
                </div>

                <div class="network-canvas-scroll-wrap">
                    <svg id="school-net-svg" viewBox="0 0 980 430" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <marker id="school-arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 1 L 10 5 L 0 9 z" fill="#ff4757" />
                            </marker>
                            <marker id="school-arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                            </marker>
                            <filter id="schoolGlow" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <!-- 顶部主干 1: ISP 专线 -> 调制解调器/数据机 (光纤) -->
                        <line id="sch-line-fiber" x1="90" y1="65" x2="190" y2="65" stroke="#fbbf24" stroke-width="4.5" stroke-dasharray="8,5" />
                        <text x="140" y="52" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">光纤专线 (Fiber)</text>

                        <!-- 顶部主干 2: 调制解调器/数据机 -> 核心路由器 (RJ45 网线 0/1) -->
                        <line id="sch-line-modem-router" x1="290" y1="65" x2="370" y2="65" stroke="#38bdf8" stroke-width="3" />
                        <text x="330" y="52" fill="#38bdf8" font-size="8.5" font-family="monospace" text-anchor="middle">电信号 0/1</text>

                        <!-- 顶部主干 3: 核心路由器 -> 核心交换机 Switch (千兆 Trunk) -->
                        <line id="sch-line-router-switch" x1="470" y1="65" x2="560" y2="65" stroke="#b066ff" stroke-width="3.5" />
                        <text x="515" y="52" fill="#b066ff" font-size="8.5" font-family="monospace" text-anchor="middle">千兆主干 (Trunk)</text>

                        <!-- 交换机下行主总线 (紫色垂直向下拉出横向总线) -->
                        <path id="sch-line-switch-bus" d="M 630 105 L 630 140" stroke="#b066ff" stroke-width="3" fill="none" />
                        <line id="sch-line-horiz-bus" x1="110" y1="140" x2="870" y2="140" stroke="#b066ff" stroke-width="2.8" />

                        <!-- ★★★ 核心对应用户第三图：4 条下行链路与文字标注 ★★★ -->
                        <!-- 分支 1 竖线: 电脑室 (有线 LAN) -->
                        <line id="sch-line-lab" x1="110" y1="140" x2="110" y2="200" stroke="#38bdf8" stroke-width="2.5" />
                        <text x="110" y="172" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">有线 LAN</text>

                        <!-- 分支 2 竖线: AP 1 (PoE 供电网线) -->
                        <line id="sch-line-ap1" x1="360" y1="140" x2="360" y2="200" stroke="#00f59b" stroke-width="3" />
                        <text x="360" y="172" fill="#00f59b" font-size="9.5" font-family="monospace" font-weight="bold" text-anchor="middle">PoE 供电网线</text>

                        <!-- 分支 3 竖线: AP 2 (PoE 供电网线) -->
                        <line id="sch-line-ap2" x1="620" y1="140" x2="620" y2="200" stroke="#00f59b" stroke-width="3" />
                        <text x="620" y="172" fill="#00f59b" font-size="9.5" font-family="monospace" font-weight="bold" text-anchor="middle">PoE 供电网线</text>

                        <!-- 分支 4 竖线: 校园服务器 (内网直连) -->
                        <line id="sch-line-server" x1="870" y1="140" x2="870" y2="200" stroke="#ef4444" stroke-width="3" />
                        <text x="870" y="172" fill="#ef4444" font-size="9.5" font-family="monospace" font-weight="bold" text-anchor="middle">内网直连 (千兆专线)</text>

                        <!-- ================= 顶部节点 ================= -->
                        <!-- 节点 1: ISP 专线 -->
                        <g id="sch-node-isp" transform="translate(15, 25)">
                            <rect x="0" y="0" width="75" height="75" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
                            <text x="37" y="32" fill="#f8fafc" font-size="18" text-anchor="middle">🌐</text>
                            <text x="37" y="52" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle">ISP 专线</text>
                            <text x="37" y="65" fill="#64748b" font-size="7" font-family="monospace" text-anchor="middle">Internet</text>
                        </g>

                        <!-- 节点 2: 调制解调器 / 数据机 (Modem) -->
                        <g id="sch-node-modem" transform="translate(190, 22)">
                            <rect x="0" y="0" width="100" height="82" rx="8" fill="#111827" stroke="#fbbf24" stroke-width="2.5" />
                            <rect x="-4" y="34" width="6" height="14" fill="#2563eb" /> <!-- 光纤插口 -->
                            <rect x="98" y="34" width="6" height="14" fill="#f59e0b" /> <!-- RJ45 网口 -->
                            <text x="50" y="24" fill="#fbbf24" font-size="8.5" font-weight="bold" text-anchor="middle">调制解调器/数据机</text>
                            <text x="50" y="38" fill="#94a3b8" font-size="7" text-anchor="middle">(Modem)</text>
                            <rect x="10" y="46" width="80" height="22" rx="3" fill="#090d16" />
                            <text x="50" y="61" id="sch-modem-txt" fill="#34d399" font-size="7" font-family="monospace" font-weight="bold" text-anchor="middle">光电 ⇄ 0101 解调</text>
                        </g>

                        <!-- 节点 3: 核心路由器 & 防火墙 -->
                        <g id="sch-node-router" transform="translate(370, 22)">
                            <rect x="0" y="0" width="100" height="82" rx="8" fill="#111827" stroke="#38bdf8" stroke-width="2" />
                            <text x="50" y="28" fill="#f8fafc" font-size="16" text-anchor="middle">🛡️ 📡</text>
                            <text x="50" y="48" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle">核心路由器/防火墙</text>
                            <text x="50" y="64" fill="#94a3b8" font-size="7" text-anchor="middle">VLAN 路由寻址</text>
                        </g>

                        <!-- 节点 4: 核心交换机 (Switch Hub) -->
                        <g id="sch-node-switch" transform="translate(560, 22)">
                            <rect x="0" y="0" width="140" height="82" rx="8" fill="#1e1b4b" stroke="#b066ff" stroke-width="2.5" />
                            <text x="70" y="28" fill="#f8fafc" font-size="16" text-anchor="middle">🔀</text>
                            <text x="70" y="48" fill="#b066ff" font-size="9.5" font-weight="bold" text-anchor="middle">核心交换机 (Switch)</text>
                            <text x="70" y="62" fill="#cbd5e1" font-size="7" text-anchor="middle">24口千兆 • MAC 硬件分发</text>
                            <text x="70" y="74" fill="#a78bfa" font-size="6.5" font-family="monospace" text-anchor="middle">PoE 集中供电</text>
                        </g>

                        <!-- ================= 下方 4 大设备分支卡片 ================= -->
                        <!-- 分支 1: 电脑室机房 (40台有线学生机) -->
                        <g id="sch-node-lab" transform="translate(45, 200)">
                            <rect x="0" y="0" width="130" height="185" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.8" />
                            <text x="65" y="32" fill="#f8fafc" font-size="20" text-anchor="middle">🖥️ 🖥️ 🖥️</text>
                            <text x="65" y="58" fill="#38bdf8" font-size="9.5" font-weight="bold" text-anchor="middle">电脑室 (Computer Lab)</text>
                            <text x="65" y="76" fill="#94a3b8" font-size="7.5" text-anchor="middle">40台有线台式电脑</text>
                            <text x="65" y="94" fill="#64748b" font-size="7.5" font-family="monospace" text-anchor="middle">千兆双绞线 RJ45</text>
                            <text x="65" y="112" fill="#64748b" font-size="7" font-family="monospace" text-anchor="middle">IP: 192.168.10.x</text>
                            <rect x="15" y="130" width="100" height="40" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1" />
                            <text x="65" y="148" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">上机编程/考试机房</text>
                            <text x="65" y="162" fill="#94a3b8" font-size="7" text-anchor="middle">低延迟 • 稳定可靠</text>
                        </g>

                        <!-- 分支 2: 无线接入点 AP 1 (教学楼) 包含下挂无线终端【学生平板】 -->
                        <g id="sch-node-ap1" transform="translate(285, 200)">
                            <!-- 外框 -->
                            <rect x="0" y="0" width="150" height="185" rx="8" fill="#091811" stroke="#00f59b" stroke-width="2" />
                            <!-- 上半部: AP 1 设备 -->
                            <rect x="10" y="10" width="130" height="68" rx="6" fill="#0f291e" stroke="#00f59b" stroke-width="1.2" />
                            <circle cx="75" cy="30" r="12" fill="#064e3b" stroke="#00f59b" stroke-width="1.2" />
                            <text x="75" y="35" fill="#00f59b" font-size="12" text-anchor="middle">📶</text>
                            <text x="75" y="55" fill="#00f59b" font-size="9" font-weight="bold" text-anchor="middle">无线接入点 AP 1</text>
                            <text x="75" y="68" fill="#a7f3d0" font-size="7" text-anchor="middle">教学楼走廊 (PoE网线供电)</text>

                            <!-- 中间: Wi-Fi 辐射波纹 -->
                            <path d="M 55 86 A 20 20 0 0 0 95 86" stroke="#00f59b" stroke-width="1.5" stroke-dasharray="3,2" fill="none" opacity="0.9" />
                            <path d="M 45 92 A 30 30 0 0 0 105 92" stroke="#00f59b" stroke-width="1.5" stroke-dasharray="3,2" fill="none" opacity="0.6" />

                            <!-- 下半部: 下挂无线终端【学生平板电脑】 -->
                            <rect x="10" y="98" width="130" height="76" rx="6" fill="#132337" stroke="#00f59b" stroke-width="1.5" stroke-dasharray="4,2" />
                            <text x="75" y="120" fill="#f8fafc" font-size="16" text-anchor="middle">📱 📱 💻</text>
                            <text x="75" y="140" fill="#00f59b" font-size="9" font-weight="bold" text-anchor="middle">学生平板 / 笔记本</text>
                            <text x="75" y="156" fill="#a7f3d0" font-size="7" font-family="monospace" text-anchor="middle">供全班无线高速联网</text>
                            <text x="75" y="168" fill="#64748b" font-size="6.5" font-family="monospace" text-anchor="middle">Wi-Fi 5GHz 无缝漫游</text>
                        </g>

                        <!-- 分支 3: 无线接入点 AP 2 (大礼堂) 包含下挂无线终端【教师手机/访客】 -->
                        <g id="sch-node-ap2" transform="translate(545, 200)">
                            <!-- 外框 -->
                            <rect x="0" y="0" width="150" height="185" rx="8" fill="#091811" stroke="#00f59b" stroke-width="2" />
                            <!-- 上半部: AP 2 设备 -->
                            <rect x="10" y="10" width="130" height="68" rx="6" fill="#0f291e" stroke="#00f59b" stroke-width="1.2" />
                            <circle cx="75" cy="30" r="12" fill="#064e3b" stroke="#00f59b" stroke-width="1.2" />
                            <text x="75" y="35" fill="#00f59b" font-size="12" text-anchor="middle">📶</text>
                            <text x="75" y="55" fill="#00f59b" font-size="9" font-weight="bold" text-anchor="middle">无线接入点 AP 2</text>
                            <text x="75" y="68" fill="#a7f3d0" font-size="7" text-anchor="middle">大礼堂 / 图书馆 (PoE供电)</text>

                            <!-- 中间: Wi-Fi 辐射波纹 -->
                            <path d="M 55 86 A 20 20 0 0 0 95 86" stroke="#00f59b" stroke-width="1.5" stroke-dasharray="3,2" fill="none" opacity="0.9" />
                            <path d="M 45 92 A 30 30 0 0 0 105 92" stroke="#00f59b" stroke-width="1.5" stroke-dasharray="3,2" fill="none" opacity="0.6" />

                            <!-- 下半部: 下挂无线终端【教师手机与公共访客】 -->
                            <rect x="10" y="98" width="130" height="76" rx="6" fill="#132337" stroke="#00f59b" stroke-width="1.5" stroke-dasharray="4,2" />
                            <text x="75" y="120" fill="#f8fafc" font-size="16" text-anchor="middle">📱 📱 💻</text>
                            <text x="75" y="140" fill="#00f59b" font-size="9" font-weight="bold" text-anchor="middle">教师手机与访客终端</text>
                            <text x="75" y="156" fill="#a7f3d0" font-size="7" font-family="monospace" text-anchor="middle">大礼堂高并发Wi-Fi接入</text>
                            <text x="75" y="168" fill="#64748b" font-size="6.5" font-family="monospace" text-anchor="middle">支持数百台手机漫游</text>
                        </g>

                        <!-- 分支 4: 校园本地数据中心服务器 (红色高防管理界面) -->
                        <g id="sch-node-server" transform="translate(805, 200)">
                            <rect x="0" y="0" width="130" height="185" rx="8" fill="#200a0d" stroke="#ef4444" stroke-width="2.2" />
                            <text x="65" y="32" fill="#ef4444" font-size="20" text-anchor="middle">🗄️ 🚨</text>
                            <text x="65" y="58" fill="#ef4444" font-size="9.5" font-weight="bold" text-anchor="middle">校园服务器 (Server)</text>
                            <text x="65" y="76" fill="#fca5a5" font-size="7.5" text-anchor="middle">成绩库 / 内部教务核心</text>
                            <text x="65" y="94" fill="#f87171" font-size="7.5" font-family="monospace" text-anchor="middle">千兆内网直连专线</text>
                            <rect x="15" y="115" width="100" height="55" rx="4" fill="#140507" stroke="#dc2626" stroke-width="1" />
                            <text x="65" y="135" fill="#fca5a5" font-size="7.5" font-weight="bold" text-anchor="middle">校内局域网红色机房</text>
                            <text x="65" y="150" fill="#f87171" font-size="7" text-anchor="middle">内网直达 · 不耗外网光纤</text>
                            <text x="65" y="162" fill="#ef4444" font-size="6.5" font-family="monospace" text-anchor="middle">延迟 < 1ms (极速)</text>
                        </g>

                        <!-- 动态飞行动画数据包 -->
                        <circle id="sch-packet-main" cx="90" cy="65" r="9" fill="#fbbf24" filter="url(#schoolGlow)" style="display:none;" />
                        <circle id="sch-packet-lab" cx="110" cy="200" r="7" fill="#38bdf8" filter="url(#schoolGlow)" style="display:none;" />
                        <circle id="sch-packet-ap1" cx="360" cy="200" r="7" fill="#00f59b" filter="url(#schoolGlow)" style="display:none;" />
                        <circle id="sch-packet-ap2" cx="620" cy="200" r="7" fill="#00f59b" filter="url(#schoolGlow)" style="display:none;" />
                        <circle id="sch-packet-server" cx="870" cy="200" r="7" fill="#ef4444" filter="url(#schoolGlow)" style="display:none;" />

                        <g id="sch-tag-group" style="display:none;">
                            <rect id="sch-tag-bg" x="0" y="0" width="135" height="22" rx="4" fill="#020617" stroke="#fbbf24" stroke-width="1.2" />
                            <text id="sch-tag-text" x="67" y="15" fill="#fbbf24" font-size="8.5" font-family="monospace" font-weight="bold" text-anchor="middle">光纤脉冲 ✨</text>
                        </g>
                    </svg>
                </div>

                <!-- 🌟 用户特别要求：执行功能按键搬到下方，容易点击 🌟 -->
                <div class="network-bottom-toolbar">
                    <div class="network-action-btns-group">
                        <button id="btn-school-down" class="network-action-btn btn-down">
                            <span>⬇️</span> 下行接收：光数据 ➔ Modem解调为0/1 ➔ 交换机 ➔ 电脑室与各AP终端
                        </button>
                        <button id="btn-school-up" class="network-action-btn btn-up">
                            <span>⬆️</span> 上行外网：AP学生平板/手机 ➔ 交换机 ➔ Modem调制为激光 ➔ 光纤
                        </button>
                        <button id="btn-school-intranet" class="network-action-btn btn-intranet">
                            <span>🏫</span> 校内互访：电脑室/AP ➔ 交换机直连校园服务器 (零外网延迟)
                        </button>
                    </div>
                    <button id="btn-speed-toggle" class="speed-toggle-btn">
                        <span>🐢</span> 速度: 慢速教学 (2.0s)
                    </button>
                </div>

                <!-- 流程状态实时解说气泡 (位于按键下方) -->
                <div id="school-flow-status" style="margin-top:0.75rem; background:rgba(176,102,255,0.08); border-left:4px solid var(--violet-accent); padding:0.85rem 1.25rem; border-radius:0 var(--radius-sm) var(--radius-sm) 0; font-size:0.85rem; color:#e2e8f0; line-height:1.6;">
                    💡 <strong>独中课纲高频网络考点</strong>：<br>
                    • <strong>为什么全校需要部署多个无线接入点 (AP)？</strong> 普通无线路由器连接 10~15 台设备便会拥堵瘫痪，全校上千名师生必须在走廊天花板部署多个<strong>吸顶式无线接入点 AP 1 与 AP 2</strong>，通过网线统一连接核心交换机，为每个班级的<strong>学生平板</strong>提供高并发稳定的无线联网！<br>
                    • <strong>PoE (Power over Ethernet) 技术</strong>：AP 设备直接通过普通的 RJ45 双绞网线同时传输电力与千兆数据，走廊天花板无需额外拉设 220V 危险强电插座！当前为<strong>慢速教学模式 (2.0秒/步)</strong>，方便清晰观察。
                </div>

            </div>
        </div>
        `;

        this.bindSchoolActions();
    }

    bindSchoolActions() {
        const btnDown = document.getElementById('btn-school-down');
        const btnUp = document.getElementById('btn-school-up');
        const btnIntranet = document.getElementById('btn-school-intranet');
        const btnSpeed = document.getElementById('btn-speed-toggle');

        if (btnDown) {
            btnDown.addEventListener('click', () => {
                this.animateSchoolDownstream();
            });
        }

        if (btnUp) {
            btnUp.addEventListener('click', () => {
                this.animateSchoolUpstream();
            });
        }

        if (btnIntranet) {
            btnIntranet.addEventListener('click', () => {
                this.animateSchoolIntranet();
            });
        }

        if (btnSpeed) {
            btnSpeed.addEventListener('click', () => {
                this.toggleSpeed();
            });
        }
    }

    // =========================================================================
    // 学校网络下行：专线光脉冲 ➔ Modem解调为0/1 ➔ 核心路由 ➔ 交换机 ➔ 电脑室 + AP1平板 + AP2手机
    // =========================================================================
    // 学校网络下行：专线光脉冲 ➔ Modem解调为0/1 ➔ 核心路由 ➔ 交换机 ➔ 电脑室 + AP1平板 + AP2手机
    // =========================================================================
    animateSchoolDownstream() {
        if (this.isTransmitting) return;
        this.isTransmitting = true;

        const pMain = document.getElementById('sch-packet-main');
        const pLab = document.getElementById('sch-packet-lab');
        const pAp1 = document.getElementById('sch-packet-ap1');
        const pAp2 = document.getElementById('sch-packet-ap2');

        const tagGroup = document.getElementById('sch-tag-group');
        const tagBg = document.getElementById('sch-tag-bg');
        const tagText = document.getElementById('sch-tag-text');
        const statusBox = document.getElementById('school-flow-status');

        const lineFiber = document.getElementById('sch-line-fiber');
        const nodeModem = document.getElementById('sch-node-modem');
        const modemTxt = document.getElementById('sch-modem-txt');

        if (!pMain || !statusBox || !tagGroup) return;

        this.clearSchoolFlash();
        pMain.style.display = 'block';
        if (pLab) pLab.style.display = 'none';
        if (pAp1) pAp1.style.display = 'none';
        if (pAp2) pAp2.style.display = 'none';
        tagGroup.style.display = 'block';

        if (lineFiber) lineFiber.classList.add('anim-fiber-active');
        if (window.soundEngine) window.soundEngine.playClick();

        // 1. 光纤脉冲进入
        pMain.setAttribute('cx', '90');
        pMain.setAttribute('cy', '65');
        pMain.setAttribute('fill', '#fbbf24');
        tagGroup.setAttribute('transform', 'translate(60, 85)');
        tagBg.setAttribute('stroke', '#fbbf24');
        tagText.setAttribute('fill', '#fbbf24');
        tagText.textContent = '光纤激光脉冲 ✨';
        statusBox.innerHTML = `<strong>1/4 [光纤专线输入]</strong> 电信 ISP 骨干光缆将互联网数据包以高频激光脉冲送达校园中心机房...`;

        this.activeTimer = setTimeout(() => {
            // 2. 到达企业 Modem 解调为 0/1 (整个 Modem 格子闪烁)
            this.clearSchoolFlash();
            pMain.setAttribute('cx', '240');
            pMain.setAttribute('cy', '65');
            tagGroup.setAttribute('transform', 'translate(190, 95)');
            tagBg.setAttribute('stroke', '#34d399');
            tagText.setAttribute('fill', '#34d399');
            tagText.textContent = 'Modem解调 ➔ 01010011 ⚡';

            if (nodeModem) {
                nodeModem.classList.add('node-flash-yellow');
            }
            if (modemTxt) modemTxt.textContent = '解调中: 光 ➔ 0101';
            statusBox.innerHTML = `<strong>2/4 [Modem 核心解调]</strong> 企业级调制解调器 / 数据机内部光敏管将激光闪烁<strong>解调为千兆方波数字电平 01010011</strong>，经网线送入核心路由器！`;
            if (window.soundEngine) window.soundEngine.playClick();

            this.activeTimer = setTimeout(() => {
                // 3. 核心路由器防火墙过滤后，推入核心交换机 (核心交换机 Switch 整个格子高能闪烁，隐藏小圆圈)
                this.clearSchoolFlash();
                if (lineFiber) lineFiber.classList.remove('anim-fiber-active');

                pMain.style.display = 'none'; // 移除挡在交换机内部的小圆圈！
                const nodeSwitch = document.getElementById('sch-node-switch');
                if (nodeSwitch) nodeSwitch.classList.add('node-flash-purple');

                tagGroup.setAttribute('transform', 'translate(570, 95)');
                tagBg.setAttribute('stroke', '#b066ff');
                tagText.setAttribute('fill', '#b066ff');
                tagText.textContent = '交换机 MAC 硬件分流 🔀';

                statusBox.innerHTML = `<strong>3/4 [核心交换机 Switch 分发]</strong> 核心交换机 (Switch Hub) 查询 MAC 地址硬件映射表，通过千兆以太网线向<strong>【电脑室】</strong>以及<strong>【教学楼 AP 1】</strong>和<strong>【大礼堂 AP 2】</strong>同步高速定向分发数据！`;
                if (window.soundEngine) window.soundEngine.playClick();

                this.activeTimer = setTimeout(() => {
                    // 4. 到达电脑室 PC、AP 1 与 AP 2 (小圆圈彻底隐藏，整个卡片格子高能闪烁)
                    this.clearSchoolFlash();
                    pMain.style.display = 'none';
                    tagGroup.style.display = 'none';

                    // 彻底隐藏小圆圈，避免遮挡内部文字与图标！
                    if (pLab) pLab.style.display = 'none';
                    if (pAp1) pAp1.style.display = 'none';
                    if (pAp2) pAp2.style.display = 'none';

                    // 触发三大目标大格子整体高能发光脉冲！
                    const nodeLab = document.getElementById('sch-node-lab');
                    const nodeAp1 = document.getElementById('sch-node-ap1');
                    const nodeAp2 = document.getElementById('sch-node-ap2');

                    if (nodeLab) nodeLab.classList.add('node-flash-blue');
                    if (nodeAp1) nodeAp1.classList.add('node-flash-green');
                    if (nodeAp2) nodeAp2.classList.add('node-flash-green');

                    statusBox.innerHTML = `✓ <strong>4/4 [无线接入与终端交付]</strong><br>
                    • <strong>电脑室 (整格蓝光)</strong>：有线网线交付 0/1 帧，学生机顺畅浏览教学资源；<br>
                    • <strong>教学楼 AP 1 (整格绿光)</strong>：将 0/1 调制为 5GHz 无线电波辐射，覆盖全班<strong>学生平板电脑</strong>；<br>
                    • <strong>大礼堂 AP 2 (整格绿光)</strong>：无线电波覆盖教师与学生手机，实现全校千人无缝漫游联网！`;
                    if (window.soundEngine) window.soundEngine.playSuccessChord();

                    this.activeTimer = setTimeout(() => {
                        this.clearSchoolFlash();
                        if (modemTxt) modemTxt.textContent = '光电 ⇄ 0101 解调';
                        this.isTransmitting = false;
                    }, 1800);

                }, this.stepDuration);

            }, this.stepDuration);

        }, this.stepDuration);
    }

    // =========================================================================
    // 学校网络上行外网：AP学生平板/手机/电脑室 ➔ 交换机 ➔ 路由器 ➔ Modem调制为激光 ➔ 光纤 ➔ ISP
    // =========================================================================
    animateSchoolUpstream() {
        if (this.isTransmitting) return;
        this.isTransmitting = true;

        const pMain = document.getElementById('sch-packet-main');
        const pLab = document.getElementById('sch-packet-lab');
        const pAp1 = document.getElementById('sch-packet-ap1');
        const pAp2 = document.getElementById('sch-packet-ap2');

        const tagGroup = document.getElementById('sch-tag-group');
        const tagBg = document.getElementById('sch-tag-bg');
        const tagText = document.getElementById('sch-tag-text');
        const statusBox = document.getElementById('school-flow-status');

        const lineFiber = document.getElementById('sch-line-fiber');
        const nodeModem = document.getElementById('sch-node-modem');
        const modemTxt = document.getElementById('sch-modem-txt');

        if (!pMain || !statusBox || !tagGroup) return;

        this.clearSchoolFlash();

        // 1. 终端设备发起数据上传 (电脑室、AP1 平板、AP2 手机整块大格子同时闪烁，隐藏小圆圈)
        pMain.style.display = 'none';
        if (pLab) pLab.style.display = 'none';
        if (pAp1) pAp1.style.display = 'none';
        if (pAp2) pAp2.style.display = 'none';
        tagGroup.style.display = 'block';

        const nodeLab = document.getElementById('sch-node-lab');
        const nodeAp1 = document.getElementById('sch-node-ap1');
        const nodeAp2 = document.getElementById('sch-node-ap2');

        if (nodeLab) nodeLab.classList.add('node-flash-blue');
        if (nodeAp1) nodeAp1.classList.add('node-flash-green');
        if (nodeAp2) nodeAp2.classList.add('node-flash-green');

        tagGroup.setAttribute('transform', 'translate(310, 240)');
        tagBg.setAttribute('stroke', '#00f59b');
        tagText.setAttribute('fill', '#00f59b');
        tagText.textContent = '终端设备发送请求 0101 ⚡';

        statusBox.innerHTML = `<strong>1/4 [多终端发起上行]</strong> 电脑室学生机、AP 1 学生平板电脑与 AP 2 手机同时生成上行数据帧 <code>01010011</code>，通过有线网线和 Wi-Fi 电波向核心交换机汇聚...`;
        if (window.soundEngine) window.soundEngine.playClick();

        this.activeTimer = setTimeout(() => {
            // 2. 汇聚到核心交换机 Switch (交换机整个紫色大格子高能闪烁，隐藏小圆圈)
            this.clearSchoolFlash();
            pMain.style.display = 'none';

            const nodeSwitch = document.getElementById('sch-node-switch');
            if (nodeSwitch) nodeSwitch.classList.add('node-flash-purple');

            tagGroup.setAttribute('transform', 'translate(570, 95)');
            tagBg.setAttribute('stroke', '#b066ff');
            tagText.setAttribute('fill', '#b066ff');
            tagText.textContent = '交换机 Trunk 汇聚上行 ➔';

            statusBox.innerHTML = `<strong>2/4 [核心交换机 Switch 汇聚]</strong> 核心交换机 (Switch Hub) 高速汇总多终端数据流，通过千兆 Trunk 主干线送到路由器防火墙，再推至调制解调器 / 数据机...`;
            if (window.soundEngine) window.soundEngine.playClick();

            this.activeTimer = setTimeout(() => {
                // 3. Modem 核心调制 (Modem 整个黄色大格子高能闪烁)
                this.clearSchoolFlash();
                if (nodeModem) nodeModem.classList.add('node-flash-yellow');
                if (modemTxt) modemTxt.textContent = '调制中: 0101 ➔ 激光';

                pMain.style.display = 'block';
                pMain.setAttribute('cx', '240');
                pMain.setAttribute('cy', '65');
                pMain.setAttribute('fill', '#fbbf24');

                tagGroup.setAttribute('transform', 'translate(180, 95)');
                tagBg.setAttribute('stroke', '#fbbf24');
                tagText.setAttribute('fill', '#fbbf24');
                tagText.textContent = '电光调制中 ➔ 激光脉冲 ✨';

                statusBox.innerHTML = `<strong>3/4 [Modem 核心调制]</strong> 调制解调器 / 数据机内部<strong>激光二极管 (Laser Diode)</strong> 接收到二进制 0/1 电平，以超高频率激发激光，<strong>将 0/1 数字信号调制为高速光脉冲</strong>！`;
                if (window.soundEngine) window.soundEngine.playClick();

                this.activeTimer = setTimeout(() => {
                    // 4. 光脉冲射入光纤
                    this.clearSchoolFlash();
                    if (lineFiber) lineFiber.classList.add('anim-fiber-reverse');

                    pMain.setAttribute('cx', '50');
                    pMain.setAttribute('cy', '65');

                    tagGroup.setAttribute('transform', 'translate(10, 85)');
                    tagBg.setAttribute('stroke', '#f59e0b');
                    tagText.setAttribute('fill', '#f59e0b');
                    tagText.textContent = '光脉冲射入光纤送往 ISP ✨';

                    statusBox.innerHTML = `✓ <strong>4/4 [上行交付成功]</strong> 激光脉冲以光速穿过校园专线光纤，顺利完成向互联网的上传交付！`;
                    if (window.soundEngine) window.soundEngine.playSuccessChord();

                    this.activeTimer = setTimeout(() => {
                        this.clearSchoolFlash();
                        pMain.style.display = 'none';
                        tagGroup.style.display = 'none';
                        if (lineFiber) lineFiber.classList.remove('anim-fiber-reverse');
                        if (modemTxt) modemTxt.textContent = '光电 ⇄ 0101 解调';
                        this.isTransmitting = false;
                    }, 1800);

                }, this.stepDuration);

            }, this.stepDuration);

        }, this.stepDuration);
    }

    // =========================================================================
    // 学校网络校内互访：电脑室/学生平板 ➔ 交换机 ➔ 校园服务器 (内网直连不走 Modem)
    // =========================================================================
    animateSchoolIntranet() {
        if (this.isTransmitting) return;
        this.isTransmitting = true;

        const pMain = document.getElementById('sch-packet-main');
        const pLab = document.getElementById('sch-packet-lab');
        const pServer = document.getElementById('sch-packet-server');

        const tagGroup = document.getElementById('sch-tag-group');
        const tagBg = document.getElementById('sch-tag-bg');
        const tagText = document.getElementById('sch-tag-text');
        const statusBox = document.getElementById('school-flow-status');

        if (!statusBox || !tagGroup) return;

        this.clearSchoolFlash();

        // 1. 电脑室发起提交 (电脑室整块格子蓝色高能闪烁，隐藏小圆圈)
        if (pLab) pLab.style.display = 'none';
        if (pMain) pMain.style.display = 'none';
        if (pServer) pServer.style.display = 'none';
        tagGroup.style.display = 'block';

        const nodeLab = document.getElementById('sch-node-lab');
        if (nodeLab) nodeLab.classList.add('node-flash-blue');

        tagGroup.setAttribute('transform', 'translate(60, 270)');
        tagBg.setAttribute('stroke', '#38bdf8');
        tagText.setAttribute('fill', '#38bdf8');
        tagText.textContent = '作业数据包 0101 📤';

        statusBox.innerHTML = `<strong>1/3 [电脑室发起提交]</strong> 电脑室学生机点击提交作业，网卡输出二进制数字帧 0101，直通核心交换机...`;
        if (window.soundEngine) window.soundEngine.playClick();

        this.activeTimer = setTimeout(() => {
            // 2. 到达核心交换机 (核心交换机 Switch 整块紫色大格子高能闪烁，隐藏小圆圈)
            this.clearSchoolFlash();
            pMain.style.display = 'none';

            const nodeSwitch = document.getElementById('sch-node-switch');
            if (nodeSwitch) nodeSwitch.classList.add('node-flash-purple');

            tagGroup.setAttribute('transform', 'translate(570, 95)');
            tagBg.setAttribute('stroke', '#b066ff');
            tagText.setAttribute('fill', '#b066ff');
            tagText.textContent = '交换机 MAC 直达 ➔ 校园服务器';

            statusBox.innerHTML = `<strong>2/3 [交换机内网硬件直达]</strong> 核心交换机 (Switch Hub) 识别目标为校内服务器 MAC 地址，直接在背板总线定向路由，<strong>无需经过调制解调器 (Modem)，也不占用任何外网光纤带宽</strong>！`;
            if (window.soundEngine) window.soundEngine.playClick();

            this.activeTimer = setTimeout(() => {
                // 3. 到达校园服务器 (校园服务器 Server 整块红色大格子高能闪烁，隐藏小圆圈)
                this.clearSchoolFlash();
                if (pServer) pServer.style.display = 'none';

                const nodeServer = document.getElementById('sch-node-server');
                if (nodeServer) nodeServer.classList.add('node-flash-red');

                tagGroup.setAttribute('transform', 'translate(810, 270)');
                tagBg.setAttribute('stroke', '#ef4444');
                tagText.setAttribute('fill', '#ef4444');
                tagText.textContent = '数据安全存入服务器 💾';

                statusBox.innerHTML = `✓ <strong>3/3 [校园服务器安全入库]</strong> 数据包在校园千兆局域网内闪电送达，作业即时写入服务器 MySQL 数据库，内网延迟 <strong>< 1ms</strong>，完全免费且不消耗电信流量！`;
                if (window.soundEngine) window.soundEngine.playSuccessChord();

                this.activeTimer = setTimeout(() => {
                    this.clearSchoolFlash();
                    tagGroup.style.display = 'none';
                    this.isTransmitting = false;
                }, 1800);

            }, this.stepDuration);

        }, this.stepDuration);
    }
}

window.networkEngine = new NetworkEngine();
