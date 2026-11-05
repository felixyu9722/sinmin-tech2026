/**
 * 独中高中资讯科技 - 电脑硬件互动教育游戏
 * 2.5D 主板装机工作台引擎 (整合：装机模式 + 实验室内置实战故障排查)
 */

class AssemblyWorkbench {
    constructor() {
        this.selectedPart = null;
        this.stepIndex = 0;
        this.isPowered = false;
        this.isDiagMode = false; // 是否处于实战故障排除演练模式

        // 装机状态记录
        this.state = {
            cpu: false,
            paste: false,
            cooler: false,
            ram1: false,     // Slot 2 (A2)
            ram2: false,     // Slot 4 (B2)
            ssd: false,
            ssdFilmPeeled: false,
            gpu: false,
            powerCables: false
        };

        // 故障模式状态
        this.diagFixed = false;

        // 装机指导步骤
        this.steps = [
            {
                tag: '第 1 步 / 共 7 步',
                title: '安装中央处理器 (CPU)',
                desc: '在右侧零件库中选中 CPU，注意角落的金色三角形标记，与主板插槽上的标记对齐后放入。',
                tip: '防呆机制：LGA1700 插槽拥有双侧定位缺口与金色三角标，严禁大力硬按以防压坏主板针脚！',
                target: 'slot-cpu',
                partId: 'cpu'
            },
            {
                tag: '第 2 步 / 共 7 步',
                title: '涂抹导热硅脂 (TIM)',
                desc: '在右侧选中导热硅脂，涂抹在 CPU 金属顶盖上以填补微观空隙。',
                tip: '原理：空气导热率仅约 0.026 W/m·K，硅脂是它的数百倍，可有效避免 CPU 过热降频。',
                target: 'slot-paste',
                partId: 'paste'
            },
            {
                tag: '第 3 步 / 共 7 步',
                title: '安装 CPU 散热器与接线',
                desc: '选中六热管散热器压上 CPU，并务必将 4-Pin 风扇线插在主板 CPU_FAN 接口。',
                tip: '若遗漏接驳 CPU_FAN 供电线，主板开机自检会报错或因温度剧升触发断电热保护。',
                target: 'slot-cooler',
                partId: 'cooler'
            },
            {
                tag: '第 4 步 / 共 7 步',
                title: '安装双通道内存 (RAM)',
                desc: '优先将第 1 根 DDR5 内存插入第 2 槽 (A2)，随后将第 2 根插入第 4 槽 (B2)。',
                tip: '独中考点：菊花链布线拓扑下，优先使用末端插槽 2/4 信号反射最小，可组建 128-bit 双通道！',
                target: 'slot-ram2',
                partId: 'ram1'
            },
            {
                tag: '第 5 步 / 共 7 步',
                title: '安装高速 M.2 NVMe SSD',
                desc: '选中 M.2 固态硬盘，撕除主板散热马甲背面的导热垫保护膜后固定安装。',
                tip: '装机易漏点：很多新手忘记撕掉散热铠甲内侧蓝色塑料膜，导致固态高温降频掉速。',
                target: 'slot-ssd',
                partId: 'ssd'
            },
            {
                tag: '第 6 步 / 共 7 步',
                title: '安装独立显卡 (GPU)',
                desc: '将 RTX 4070 独显插入主板第 1 条全速 PCIe 4.0 x16 槽，听到卡扣锁闭。',
                tip: '显示输出警示：配有独显的电脑，显示器线必须直接接在显卡横向接口上！',
                target: 'slot-gpu',
                partId: 'gpu'
            },
            {
                tag: '第 7 步 / 共 7 步',
                title: '接通电源供应线 (PSU Cables)',
                desc: '插上 24-Pin 主板主供电、8-Pin CPU 辅助供电与显卡独立供电线。',
                tip: '80 PLUS 金牌电源转换效率高达 90%+，可将市电高压 AC 转为纯净 DC 直流电。',
                target: 'slot-pwr',
                partId: 'pwr'
            }
        ];
    }

    init() {
        this.renderMotherboardSVG();
        this.bindEvents();
        this.updateUI();
    }

    // 绘制高精细度 2.5D ATX 主板 SVG 矢量底板
    renderMotherboardSVG() {
        const container = document.getElementById('mb-mount');
        if (!container) return;

        container.innerHTML = `
        <svg class="mb-svg" id="motherboard-svg" viewBox="0 0 1000 750" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0f172a" />
                    <stop offset="50%" stop-color="#0b1120" />
                    <stop offset="100%" stop-color="#070b14" />
                </linearGradient>

                <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#94a3b8" />
                    <stop offset="50%" stop-color="#cbd5e1" />
                    <stop offset="100%" stop-color="#64748b" />
                </linearGradient>

                <linearGradient id="goldPin" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#f59e0b" />
                    <stop offset="50%" stop-color="#fbbf24" />
                    <stop offset="100%" stop-color="#d97706" />
                </linearGradient>

                <linearGradient id="heatsinkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b" />
                    <stop offset="50%" stop-color="#334155" />
                    <stop offset="100%" stop-color="#0f172a" />
                </linearGradient>
            </defs>

            <!-- 主板 PCB 基板 (ATX 标准比例) -->
            <rect x="50" y="30" width="900" height="690" rx="14" fill="url(#pcbGrad)" stroke="#1e293b" stroke-width="4" />

            <!-- 印刷电路板铜箔导线印记与装饰线 -->
            <g opacity="0.35" stroke="#00f3ff" stroke-width="1" fill="none">
                <path d="M 280 200 L 400 200 L 440 240 L 520 240" />
                <path d="M 280 220 L 380 220 L 420 260 L 520 260" />
                <path d="M 280 240 L 360 240 L 400 280 L 520 280" />
                <path d="M 280 340 L 280 440 L 320 480 L 320 540" />
                <path d="M 250 340 L 250 430 L 290 470 L 290 540" />
                <circle cx="70" cy="50" r="8" fill="#1e293b" stroke="#64748b" stroke-width="2" />
                <circle cx="930" cy="50" r="8" fill="#1e293b" stroke="#64748b" stroke-width="2" />
                <circle cx="70" cy="700" r="8" fill="#1e293b" stroke="#64748b" stroke-width="2" />
                <circle cx="930" cy="700" r="8" fill="#1e293b" stroke="#64748b" stroke-width="2" />
            </g>

            <!-- 左侧后置 I/O 护甲与 VRM 供电散热鳍片模块 -->
            <g id="vrm-heatsink">
                <rect x="75" y="70" width="70" height="260" rx="6" fill="url(#heatsinkGrad)" stroke="#475569" stroke-width="2" />
                <line x1="85" y1="90" x2="135" y2="90" stroke="#00f3ff" stroke-width="2" opacity="0.7" />
                <text x="110" y="210" fill="#94a3b8" font-size="12" font-family="monospace" text-anchor="middle" transform="rotate(-90 110 210)">14+1+1 PHASE VRM</text>
                <rect x="160" y="55" width="230" height="45" rx="6" fill="url(#heatsinkGrad)" stroke="#475569" stroke-width="2" />
                <rect x="180" y="38" width="55" height="20" rx="3" fill="#020617" stroke="#64748b" stroke-width="1.5" />
                <text x="207" y="52" fill="#94a3b8" font-size="9" text-anchor="middle">CPU_PWR</text>
            </g>

            <!-- CPU 插槽区域 (LGA 1700) -->
            <g id="socket-cpu-group">
                <rect x="210" y="130" width="170" height="180" rx="8" fill="#1e293b" stroke="url(#metalSilver)" stroke-width="3" />
                <polygon points="214,134 228,134 214,148" fill="url(#goldPin)" />
                <text x="295" y="122" fill="#94a3b8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">SOCKET LGA 1700</text>
                
                <rect id="cpu-socket-bed" x="225" y="145" width="140" height="150" fill="#0b0f19" stroke="#334155" stroke-dasharray="3,2" />
                <path d="M 385 140 L 392 140 L 392 305 L 382 305" fill="none" stroke="url(#metalSilver)" stroke-width="4" stroke-linecap="round" />

                <rect id="slot-cpu" class="slot-target" x="215" y="135" width="160" height="170" rx="6" />

                <!-- CPU 实体 -->
                <g id="part-cpu-installed" style="display: none;">
                    <rect x="220" y="140" width="150" height="160" rx="5" fill="#334155" stroke="url(#metalSilver)" stroke-width="3" />
                    <rect x="235" y="155" width="120" height="130" rx="6" fill="url(#metalSilver)" stroke="#475569" stroke-width="1.5" />
                    <polygon points="222,142 232,142 222,152" fill="url(#goldPin)" />
                    <text x="295" y="210" fill="#0f172a" font-size="13" font-family="sans-serif" font-weight="900" text-anchor="middle">intel</text>
                    <text x="295" y="230" fill="#1e293b" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">CORE i7-14700K</text>
                    <text x="295" y="248" fill="#475569" font-size="8" font-family="monospace" text-anchor="middle">LGA1700 • 3.4GHz</text>
                </g>

                <!-- 导热硅脂层 -->
                <g id="part-paste-installed" style="display: none;">
                    <ellipse cx="295" cy="220" rx="28" ry="24" fill="#94a3b8" opacity="0.85" filter="drop-shadow(0 0 4px #cbd5e1)" />
                    <circle cx="280" cy="210" r="10" fill="#94a3b8" opacity="0.9" />
                    <circle cx="310" cy="230" r="12" fill="#94a3b8" opacity="0.9" />
                    <circle cx="295" cy="220" r="14" fill="#e2e8f0" opacity="0.95" />
                </g>

                <rect id="slot-paste" class="slot-target" x="235" y="155" width="120" height="130" rx="6" style="display: none;" />

                <!-- 散热器与风扇实体 -->
                <g id="part-cooler-installed" style="display: none;">
                    <rect x="195" y="115" width="200" height="210" rx="12" fill="#0f172a" opacity="0.9" stroke="#00f3ff" stroke-width="2" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.9))" />
                    <g stroke="#334155" stroke-width="2">
                        <line x1="210" y1="135" x2="380" y2="135" />
                        <line x1="210" y1="150" x2="380" y2="150" />
                        <line x1="210" y1="290" x2="380" y2="290" />
                        <line x1="210" y1="305" x2="380" y2="305" />
                    </g>
                    <circle cx="295" cy="220" r="75" fill="#020617" stroke="#475569" stroke-width="4" />
                    <g id="cooler-fan-blades" style="transform-origin: 295px 220px;">
                        <circle cx="295" cy="220" r="22" fill="#1e293b" stroke="#00f3ff" stroke-width="2" />
                        <path d="M 295 198 Q 330 160 345 180 Q 320 205 295 210 Z" fill="#1e293b" stroke="#38bdf8" />
                        <path d="M 317 220 Q 355 255 335 270 Q 310 245 305 220 Z" fill="#1e293b" stroke="#38bdf8" />
                        <path d="M 295 242 Q 260 280 245 260 Q 270 235 295 230 Z" fill="#1e293b" stroke="#38bdf8" />
                        <path d="M 273 220 Q 235 185 255 170 Q 280 195 285 220 Z" fill="#1e293b" stroke="#38bdf8" />
                    </g>
                    <circle cx="225" cy="130" r="5" fill="#f59e0b" />
                    <circle cx="245" cy="130" r="5" fill="#f59e0b" />
                    <circle cx="345" cy="130" r="5" fill="#f59e0b" />
                    <circle cx="365" cy="130" r="5" fill="#f59e0b" />
                </g>

                <rect id="slot-cooler" class="slot-target" x="200" y="120" width="190" height="200" rx="10" style="display: none;" />
            </g>

            <!-- 内存插槽区域 (4x DIMM: A1, A2, B1, B2) -->
            <g id="ram-slots-group">
                <text x="590" y="100" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">DIMM SLOTS (DDR5 6000)</text>
                
                <rect x="530" y="115" width="22" height="230" rx="3" fill="#090d16" stroke="#1e293b" stroke-width="2" />
                <text x="541" y="360" fill="#64748b" font-size="9" text-anchor="middle">A1</text>

                <!-- 槽位 2 (DIMM A2) -->
                <rect x="565" y="115" width="22" height="230" rx="3" fill="#090d16" stroke="#00f3ff" stroke-width="1.5" stroke-dasharray="2,2" />
                <text x="576" y="360" fill="#00f3ff" font-size="10" font-weight="bold" text-anchor="middle">A2★</text>
                <rect id="slot-ram2" class="slot-target" x="562" y="112" width="28" height="236" rx="4" />

                <!-- 槽位 3 (DIMM B1) -->
                <rect x="600" y="115" width="22" height="230" rx="3" fill="#090d16" stroke="#1e293b" stroke-width="2" />
                <text x="611" y="360" fill="#64748b" font-size="9" text-anchor="middle">B1</text>

                <!-- 槽位 4 (DIMM B2) -->
                <rect x="635" y="115" width="22" height="230" rx="3" fill="#090d16" stroke="#00f3ff" stroke-width="1.5" stroke-dasharray="2,2" />
                <text x="646" y="360" fill="#00f3ff" font-size="10" font-weight="bold" text-anchor="middle">B2★</text>
                <rect id="slot-ram4" class="slot-target" x="632" y="112" width="28" height="236" rx="4" />

                <!-- 内存条 1 实体 (安装在 A2) -->
                <g id="part-ram1-installed" style="display: none; cursor:pointer;">
                    <rect id="ram1-rect" x="566" y="118" width="20" height="224" rx="3" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
                    <rect id="ram1-rgb-bar" x="568" y="120" width="16" height="30" rx="2" fill="#38bdf8" />
                    <text x="576" y="235" fill="#f8fafc" font-size="8" font-family="monospace" text-anchor="middle" transform="rotate(-90 576 235)">16GB DDR5</text>
                </g>

                <!-- 内存条 2 实体 (安装在 B2) -->
                <g id="part-ram2-installed" style="display: none;">
                    <rect x="636" y="118" width="20" height="224" rx="3" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
                    <rect id="ram2-rgb-bar" x="638" y="120" width="16" height="30" rx="2" fill="#38bdf8" />
                    <text x="646" y="235" fill="#f8fafc" font-size="8" font-family="monospace" text-anchor="middle" transform="rotate(-90 646 235)">16GB DDR5</text>
                </g>
            </g>

            <!-- 24-Pin ATX 主供电接口 -->
            <g id="atx-24pin-group">
                <rect x="685" y="180" width="30" height="150" rx="4" fill="#020617" stroke="#475569" stroke-width="2" />
                <text x="700" y="170" fill="#94a3b8" font-size="9" text-anchor="middle">24-PIN ATX</text>
                <g fill="#f59e0b">
                    <circle cx="692" cy="195" r="2.5" /> <circle cx="708" cy="195" r="2.5" />
                    <circle cx="692" cy="210" r="2.5" /> <circle cx="708" cy="210" r="2.5" />
                    <circle cx="692" cy="225" r="2.5" /> <circle cx="708" cy="225" r="2.5" />
                    <circle cx="692" cy="300" r="2.5" /> <circle cx="708" cy="300" r="2.5" />
                </g>
                <g id="part-cable-atx" style="display: none;">
                    <rect x="680" y="175" width="40" height="160" rx="6" fill="#1e293b" stroke="#00f3ff" stroke-width="2" />
                    <line x1="720" y1="250" x2="880" y2="250" stroke="#0f172a" stroke-width="16" stroke-linecap="round" />
                    <text x="700" y="260" fill="#00f3ff" font-size="9" font-weight="bold" text-anchor="middle" transform="rotate(-90 700 260)">CONNECTED</text>
                </g>
            </g>

            <!-- 主板简易 Debug 诊断灯 -->
            <g id="debug-led-hardware" transform="translate(685, 105)">
                <rect x="0" y="0" width="75" height="45" rx="5" fill="#080c16" stroke="#1e293b" stroke-width="1.5" />
                <text x="37" y="12" fill="#64748b" font-size="8" font-family="monospace" text-anchor="middle">DEBUG LED</text>
                
                <circle id="led-cpu" cx="12" cy="24" r="4.5" fill="#2a3346" />
                <text x="12" y="38" fill="#64748b" font-size="7" text-anchor="middle">CPU</text>

                <circle id="led-dram" cx="29" cy="24" r="4.5" fill="#2a3346" />
                <text x="29" y="38" fill="#64748b" font-size="7" text-anchor="middle">RAM</text>

                <circle id="led-vga" cx="46" cy="24" r="4.5" fill="#2a3346" />
                <text x="46" y="38" fill="#64748b" font-size="7" text-anchor="middle">VGA</text>

                <circle id="led-boot" cx="63" cy="24" r="4.5" fill="#2a3346" />
                <text x="63" y="38" fill="#64748b" font-size="7" text-anchor="middle">BOOT</text>
            </g>

            <!-- M.2 NVMe SSD 高速插槽 -->
            <g id="m2-ssd-group">
                <text x="295" y="375" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">M.2 PCIe 4.0 NVMe (KEY-M 2280)</text>
                <rect x="180" y="390" width="230" height="42" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5" />
                <circle cx="195" cy="411" r="5" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                <rect x="385" y="394" width="20" height="34" rx="2" fill="#020617" stroke="#f59e0b" stroke-width="1.5" />

                <rect id="slot-ssd" class="slot-target" x="175" y="385" width="240" height="52" rx="6" />

                <g id="part-ssd-installed" style="display: none;">
                    <rect x="195" y="393" width="195" height="36" rx="3" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
                    <rect x="230" y="398" width="25" height="26" fill="#020617" />
                    <rect x="270" y="398" width="40" height="26" fill="#0b0f19" />
                    <rect x="320" y="398" width="40" height="26" fill="#0b0f19" />
                    <text x="290" y="415" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">PCIe 4.0 1TB NVMe</text>
                </g>
            </g>

            <!-- PCIe 4.0 x16 全速显卡插槽与 GPU 实体 -->
            <g id="pcie-gpu-group">
                <text x="340" y="475" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">PCIe 4.0 x16 STEEL ARMOR SLOT</text>
                <rect x="120" y="490" width="440" height="24" rx="3" fill="#090d16" stroke="url(#metalSilver)" stroke-width="2" />
                <line x1="200" y1="492" x2="200" y2="512" stroke="#475569" stroke-width="2" />
                <rect x="555" y="488" width="18" height="28" rx="3" fill="#334155" stroke="#64748b" />

                <rect id="slot-gpu" class="slot-target" x="100" y="480" width="480" height="44" rx="6" />

                <g id="part-gpu-installed" style="display: none;">
                    <rect x="80" y="470" width="530" height="150" rx="10" fill="#0f172a" stroke="#00f3ff" stroke-width="2.5" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.95))" />
                    <rect x="65" y="470" width="20" height="150" fill="url(#metalSilver)" stroke="#475569" stroke-width="1.5" />
                    <g fill="#020617" stroke="#334155" stroke-width="2">
                        <circle cx="200" cy="545" r="45" />
                        <circle cx="340" cy="545" r="45" />
                        <circle cx="480" cy="545" r="45" />
                    </g>
                    <g id="gpu-fan-blades-1" class="gpu-fan-unit" style="transform-origin: 200px 545px;">
                        <circle cx="200" cy="545" r="14" fill="#1e293b" />
                        <line x1="200" y1="510" x2="200" y2="580" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
                        <line x1="165" y1="545" x2="235" y2="545" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
                    </g>
                    <g id="gpu-fan-blades-2" class="gpu-fan-unit" style="transform-origin: 340px 545px;">
                        <circle cx="340" cy="545" r="14" fill="#1e293b" />
                        <line x1="340" y1="510" x2="340" y2="580" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
                        <line x1="305" y1="545" x2="375" y2="545" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
                    </g>
                    <g id="gpu-fan-blades-3" class="gpu-fan-unit" style="transform-origin: 480px 545px;">
                        <circle cx="480" cy="545" r="14" fill="#1e293b" />
                        <line x1="480" y1="510" x2="480" y2="580" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
                        <line x1="445" y1="545" x2="515" y2="545" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
                    </g>
                    <rect id="gpu-logo-plate" x="270" y="480" width="140" height="22" rx="4" fill="#020617" stroke="#00f3ff" />
                    <text x="340" y="495" fill="#00f3ff" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle">GEFORCE RTX 4070</text>
                    <rect x="540" y="472" width="40" height="18" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
                </g>
            </g>

            <!-- 南桥芯片组 -->
            <g id="chipset-heatsink" transform="translate(620, 480)">
                <rect x="0" y="0" width="130" height="140" rx="8" fill="url(#heatsinkGrad)" stroke="#475569" stroke-width="2" />
                <path d="M 20 20 L 110 20 L 110 120" fill="none" stroke="#00f3ff" stroke-width="2" opacity="0.6" />
                <text x="65" y="70" fill="#f8fafc" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">INTEL</text>
                <text x="65" y="88" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">B760 CHIPSET</text>
            </g>

            <rect id="slot-pwr" class="slot-target" x="660" y="160" width="90" height="200" rx="8" style="display: none;" />
        </svg>
        `;
    }

    bindEvents() {
        const partItems = document.querySelectorAll('.part-item');
        partItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('installed')) return;
                const partId = item.dataset.part;
                this.selectPart(partId);
            });
        });

        const slots = [
            { id: 'slot-cpu', action: () => this.installCPU() },
            { id: 'slot-paste', action: () => this.installPaste() },
            { id: 'slot-cooler', action: () => this.installCooler() },
            { id: 'slot-ram2', action: () => this.installRAM(1) },
            { id: 'slot-ram4', action: () => this.installRAM(2) },
            { id: 'slot-ssd', action: () => this.installSSD() },
            { id: 'slot-gpu', action: () => this.installGPU() },
            { id: 'slot-pwr', action: () => this.installPowerCables() }
        ];

        slots.forEach(slot => {
            const el = document.getElementById(slot.id);
            if (el) {
                const triggerAction = (e) => {
                    if (e && e.type === 'touchend') {
                        e.preventDefault();
                    }
                    slot.action();
                };
                el.addEventListener('click', triggerAction);
                el.addEventListener('touchend', triggerAction, { passive: false });
            }
        });

        // 绑定主板上内存条的点击事件（用于故障排除重新插拔）
        const ram1El = document.getElementById('part-ram1-installed');
        if (ram1El) {
            ram1El.addEventListener('click', () => {
                if (this.isDiagMode && !this.diagFixed) {
                    this.fixDiagMemory();
                }
            });
        }

        const powerBtn = document.getElementById('btn-power-on');
        if (powerBtn) {
            powerBtn.addEventListener('click', () => {
                this.powerOnSystem();
            });
        }

        const resetBtn = document.getElementById('btn-reset-workbench');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetWorkbench();
            });
        }

        // 实验室故障排查演练触发按钮
        const triggerDiagBtn = document.getElementById('btn-trigger-diag');
        if (triggerDiagBtn) {
            triggerDiagBtn.addEventListener('click', () => {
                this.toggleDiagnosticsMode();
            });
        }
    }

    // 实验室内部：切换为实战故障排查模式
    toggleDiagnosticsMode() {
        if (window.soundEngine) window.soundEngine.playClick();
        this.isDiagMode = !this.isDiagMode;

        const diagBtn = document.getElementById('btn-trigger-diag');
        const banner = document.getElementById('diag-alert-banner');

        if (this.isDiagMode) {
            // 自动将必要硬件装配，并故意将内存松动
            this.prepareDiagState();
            diagBtn.innerHTML = `<span>🛠️</span> 退出排错，返回自由装机`;
            diagBtn.style.borderColor = 'var(--cyan-primary)';
            diagBtn.style.color = 'var(--cyan-primary)';
            if (banner) banner.style.display = 'block';
        } else {
            this.resetWorkbench();
            diagBtn.innerHTML = `<span>🚨</span> 实战故障排除演练 (DRAM报警)`;
            diagBtn.style.borderColor = 'var(--amber-warning)';
            diagBtn.style.color = 'var(--amber-warning)';
            if (banner) banner.style.display = 'none';
        }
    }

    // 准备排错环境：整机通电，但 RAM 接触不良触发 DRAM 报警
    prepareDiagState() {
        this.state = {
            cpu: true,
            paste: true,
            cooler: true,
            ram1: true,
            ram2: true,
            ssd: true,
            ssdFilmPeeled: true,
            gpu: true,
            powerCables: true
        };
        this.diagFixed = false;

        // 呈现所有硬件
        document.getElementById('part-cpu-installed').style.display = 'block';
        document.getElementById('part-paste-installed').style.display = 'block';
        document.getElementById('part-cooler-installed').style.display = 'block';
        document.getElementById('part-ram1-installed').style.display = 'block';
        document.getElementById('part-ram2-installed').style.display = 'block';
        document.getElementById('part-ssd-installed').style.display = 'block';
        document.getElementById('part-gpu-installed').style.display = 'block';
        document.getElementById('part-cable-atx').style.display = 'block';

        // 隐藏插槽高亮
        document.querySelectorAll('.slot-target').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.part-item').forEach(el => el.classList.add('installed'));

        // 将内存条 A2 样式设置为倾斜未插好报警
        const ram1Rect = document.getElementById('ram1-rect');
        if (ram1Rect) {
            ram1Rect.setAttribute('stroke', '#ffa502');
            ram1Rect.setAttribute('stroke-dasharray', '4,2');
            ram1Rect.setAttribute('stroke-width', '3');
        }

        // 启动风扇但触发 DRAM 报警黄灯常亮
        this.isPowered = true;
        const coolerFan = document.getElementById('cooler-fan-blades');
        if (coolerFan) coolerFan.classList.add('fan-spinning');
        document.querySelectorAll('.gpu-fan-unit').forEach(f => f.classList.add('fan-spinning'));

        const ledDram = document.getElementById('led-dram');
        if (ledDram) ledDram.setAttribute('fill', '#ffa502');

        const powerBtn = document.getElementById('btn-power-on');
        if (powerBtn) {
            powerBtn.disabled = true;
            powerBtn.innerHTML = `<span>⚠️</span> 主机自检受阻: DRAM 报错`;
            powerBtn.classList.add('ready');
            powerBtn.style.borderColor = '#ffa502';
        }

        // 蜂鸣器长鸣报警
        if (window.soundEngine) window.soundEngine.playAlarmBeep();
    }

    // 玩家在主板上点击松动的内存条，重新锁紧！
    fixDiagMemory() {
        if (window.soundEngine) window.soundEngine.playSnap();
        this.diagFixed = true;

        const ram1Rect = document.getElementById('ram1-rect');
        if (ram1Rect) {
            ram1Rect.setAttribute('stroke', '#00f59b');
            ram1Rect.removeAttribute('stroke-dasharray');
            ram1Rect.setAttribute('stroke-width', '2');
        }

        // DRAM 报警灯熄灭，绿灯点亮
        const ledDram = document.getElementById('led-dram');
        const ledBoot = document.getElementById('led-boot');
        if (ledDram) ledDram.setAttribute('fill', '#2a3346');
        if (ledBoot) ledBoot.setAttribute('fill', '#00f59b');

        // 通电成功蜂鸣与和弦
        if (window.soundEngine) {
            window.soundEngine.playPostSuccessBeep();
            setTimeout(() => window.soundEngine.playSuccessChord(), 300);
        }

        const banner = document.getElementById('diag-alert-banner');
        if (banner) {
            banner.innerHTML = `
                <div style="font-size:0.95rem; font-weight:bold; color:#00f59b; margin-bottom:4px;">
                    ✓ 咔哒！内存重新紧固，接触良好！主板 DRAM 自检通过！
                </div>
                <div style="font-size:0.8rem; color:#bbf7d0;">
                    📘 <strong>排错总结</strong>：开机黑屏且 DRAM 黄灯常亮，90% 是由于内存防呆缺口未卡死或双向卡扣未锁紧。将内存对准缺口垂直按紧即可解决！
                </div>
            `;
            banner.style.background = 'rgba(0,245,155,0.12)';
            banner.style.borderColor = 'var(--green-success)';
        }

        const powerBtn = document.getElementById('btn-power-on');
        if (powerBtn) {
            powerBtn.disabled = false;
            powerBtn.classList.remove('ready');
            powerBtn.classList.add('powered');
            powerBtn.innerHTML = `<span>✓</span> 自检成功，已顺利进入系统`;
        }

        setTimeout(() => {
            this.showBiosModal();
        }, 1000);
    }

    // è‡ªåŠ¨å¹³æ»‘æ»šåŠ¨åˆ°ä¸»æœºæ¿è£…é…å°
    scrollToMotherboard() {
        const stage = document.querySelector('.workbench-stage-card');
        if (!stage) return;
        const rect = stage.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - 65;
        // æ‰‹æœºç«¯æˆ–å±å¹•æ»šåŠ¨åŽï¼Œå¹³æ»‘å®šä½åˆ°ä¸»æ¿
        if (rect.top < 40 || rect.top > 260) {
            window.scrollTo({
                top: Math.max(0, targetY),
                behavior: 'smooth'
            });
        }
    }

    selectPart(partId) {
        if (window.soundEngine) window.soundEngine.playClick();
        this.selectedPart = partId;

        document.querySelectorAll('.part-item').forEach(el => {
            el.classList.toggle('selected', el.dataset.part === partId);
        });

        this.highlightActiveSlot();
        this.scrollToMotherboard();
    }

    highlightActiveSlot() {
        document.querySelectorAll('.slot-target').forEach(el => {
            el.classList.remove('highlight-valid');
        });

        const promptEl = document.getElementById('mb-target-prompt');
        const promptTxt = document.getElementById('mb-prompt-text');

        if (!this.selectedPart) {
            if (promptEl) promptEl.style.display = 'none';
            return;
        }

        let targetSlotId = null;
        let hintText = '';

        if (this.selectedPart === 'cpu' && !this.state.cpu) {
            targetSlotId = 'slot-cpu';
            hintText = '\ud83c\udfaf \u8bf7\u70b9\u51fb\u4e3b\u677f\u4e2d\u592e\u95ea\u70c1\u7684 LGA 1700 \u63d2\u69fd\u5b89\u88c5 CPU\uff01';
        } else if (this.selectedPart === 'paste' && this.state.cpu && !this.state.paste) {
            targetSlotId = 'slot-paste';
            hintText = '\ud83c\udfaf \u8bf7\u70b9\u51fb CPU \u9876\u76d6\u4e2d\u592e\u95ea\u70c1\u533a\u57df\u5747\u5300\u6d82\u62b9\u5bfc\u70ed\u7845\u8102\uff01';
        } else if (this.selectedPart === 'cooler' && this.state.paste && !this.state.cooler) {
            targetSlotId = 'slot-cooler';
            hintText = '\ud83c\udfaf \u8bf7\u70b9\u51fb\u95ea\u70c1\u533a\u57df\u5b89\u88c5\u516d\u70ed\u7ba1 CPU \u53cc\u5854\u6563\u70ed\u5668\uff01';
        } else if (this.selectedPart === 'ram1' && !this.state.ram1) {
            targetSlotId = 'slot-ram2';
            hintText = '\ud83c\udfaf \u8bf7\u70b9\u51fb\u95ea\u70c1\u7684\u7b2c 2 \u5185\u5b58\u63d2\u69fd (DIMM A2\u2605) \u5b89\u88c5\u9996\u6839\u5185\u5b58\uff01';
        } else if (this.selectedPart === 'ram2' && this.state.ram1 && !this.state.ram2) {
            targetSlotId = 'slot-ram4';
            hintText = '\ud83c\udfaf \u8bf7\u70b9\u51fb\u95ea\u70c1\u7684\u7b2c 4 \u5185\u5b58\u63d2\u69fd (DIMM B2\u2605) \u7ec4\u5efa\u53cc\u901a\u9053\uff01';
        } else if (this.selectedPart === 'ssd' && !this.state.ssd) {
            targetSlotId = 'slot-ssd';
            hintText = '\ud83c\udfaf \u8bf7\u70b9\u51fb\u95ea\u70c1\u7684 PCIe 4.0 M.2 \u56fa\u6001\u786c\u76d8\u63d2\u69fd\uff01';
        } else if (this.selectedPart === 'gpu' && !this.state.gpu) {
            targetSlotId = 'slot-gpu';
            hintText = '\ud83c\udfaf \u8bf7\u70b9\u51fb\u95ea\u70c1\u7684\u91d1\u5c5e\u52a0\u56fa PCIe 4.0 x16 \u663e\u5361\u63d2\u69fd\uff01';
        } else if (this.selectedPart === 'pwr' && !this.state.powerCables) {
            targetSlotId = 'slot-pwr';
            hintText = '\ud83c\udfaf \u8bf7\u70b9\u51fb\u4e3b\u677f\u53f3\u4fa7\u95ea\u70c1\u7684 24-Pin \u4e3b\u4f9b\u7535\u63d2\u5ea7\u63a5\u901a\u7ebf\u7f06\uff01';
        }

        if (targetSlotId) {
            const slotEl = document.getElementById(targetSlotId);
            if (slotEl) {
                slotEl.style.display = 'block';
                slotEl.classList.add('highlight-valid');
            }
            if (promptEl && promptTxt) {
                promptTxt.textContent = hintText;
                promptEl.style.display = 'flex';
            }
        } else {
            if (promptEl) promptEl.style.display = 'none';
        }
    }

    installCPU() {
        if (this.selectedPart !== 'cpu' && !this.selectedPart) this.selectPart('cpu');
        if (this.selectedPart !== 'cpu') return;

        if (window.soundEngine) window.soundEngine.playSnap();
        this.state.cpu = true;
        document.getElementById('part-cpu-installed').style.display = 'block';
        document.getElementById('slot-cpu').style.display = 'none';

        this.markPartInstalled('cpu');
        this.stepIndex = 1;
        this.selectedPart = null;
        this.updateUI();
        document.getElementById('slot-paste').style.display = 'block';
    }

    installPaste() {
        if (!this.state.cpu) {
            alert('请先安装 CPU，再涂抹导热硅脂！');
            return;
        }

        if (window.soundEngine) window.soundEngine.playPaste();
        this.state.paste = true;
        document.getElementById('part-paste-installed').style.display = 'block';
        document.getElementById('slot-paste').style.display = 'none';

        this.markPartInstalled('paste');
        this.stepIndex = 2;
        this.selectedPart = null;
        this.updateUI();
        document.getElementById('slot-cooler').style.display = 'block';
    }

    installCooler() {
        if (!this.state.paste) {
            alert('警告：未涂抹导热硅脂前安装散热器，会导致 CPU 核心积热引发热保护断电！请先涂抹硅脂。');
            return;
        }

        if (window.soundEngine) window.soundEngine.playSnap();
        this.state.cooler = true;
        document.getElementById('part-cooler-installed').style.display = 'block';
        document.getElementById('slot-cooler').style.display = 'none';

        this.markPartInstalled('cooler');
        this.stepIndex = 3;
        this.selectedPart = null;
        this.updateUI();
    }

    installRAM(moduleNum) {
        if (moduleNum === 1) {
            if (window.soundEngine) window.soundEngine.playSnap();
            this.state.ram1 = true;
            document.getElementById('part-ram1-installed').style.display = 'block';
            document.getElementById('slot-ram2').style.display = 'none';
            this.markPartInstalled('ram1');
            this.selectedPart = null;
            this.updateUI();
        } else if (moduleNum === 2) {
            if (!this.state.ram1) {
                alert('建议先在优选插槽 2 (A2) 安装第一根内存！');
                return;
            }
            if (window.soundEngine) window.soundEngine.playSnap();
            this.state.ram2 = true;
            document.getElementById('part-ram2-installed').style.display = 'block';
            document.getElementById('slot-ram4').style.display = 'none';
            this.markPartInstalled('ram2');
            this.stepIndex = 4;
            this.selectedPart = null;
            this.updateUI();
        }
    }

    installSSD() {
        if (!this.state.ssdFilmPeeled) {
            const confirmed = confirm('【细节检查】安装 M.2 散热铠甲前，请确认已撕下导热胶垫上的“出厂蓝色防尘保护膜”！\n\n点击 [确定] 撕掉保护薄膜并固定螺丝。');
            if (!confirmed) return;
            this.state.ssdFilmPeeled = true;
        }

        if (window.soundEngine) window.soundEngine.playSnap();
        this.state.ssd = true;
        document.getElementById('part-ssd-installed').style.display = 'block';
        document.getElementById('slot-ssd').style.display = 'none';
        this.markPartInstalled('ssd');
        this.stepIndex = 5;
        this.selectedPart = null;
        this.updateUI();
    }

    installGPU() {
        if (window.soundEngine) window.soundEngine.playSnap();
        this.state.gpu = true;
        document.getElementById('part-gpu-installed').style.display = 'block';
        document.getElementById('slot-gpu').style.display = 'none';
        this.markPartInstalled('gpu');
        this.stepIndex = 6;
        this.selectedPart = null;
        this.updateUI();
        document.getElementById('slot-pwr').style.display = 'block';
    }

    installPowerCables() {
        if (window.soundEngine) window.soundEngine.playSnap();
        this.state.powerCables = true;
        document.getElementById('part-cable-atx').style.display = 'block';
        document.getElementById('slot-pwr').style.display = 'none';
        this.markPartInstalled('pwr');
        this.stepIndex = 7;
        this.selectedPart = null;
        this.updateUI();
    }

    markPartInstalled(partId) {
        const item = document.querySelector(`.part-item[data-part="${partId}"]`);
        if (item) {
            item.classList.add('installed');
            item.classList.remove('selected');
            const badge = item.querySelector('.part-badge-tag');
            if (badge) badge.textContent = '已装配 ✓';
        }
    }

    updateUI() {
        this.highlightActiveSlot();
        if (this.isDiagMode) return;

        const totalItems = 8;
        let installedCount = 0;
        if (this.state.cpu) installedCount++;
        if (this.state.paste) installedCount++;
        if (this.state.cooler) installedCount++;
        if (this.state.ram1) installedCount++;
        if (this.state.ram2) installedCount++;
        if (this.state.ssd) installedCount++;
        if (this.state.gpu) installedCount++;
        if (this.state.powerCables) installedCount++;

        const percent = Math.round((installedCount / totalItems) * 100);
        const barFill = document.getElementById('progress-bar-fill');
        const countTxt = document.getElementById('installed-count-txt');
        if (barFill) barFill.style.width = `${percent}%`;
        if (countTxt) countTxt.textContent = `${installedCount} / ${totalItems} 部件`;

        const currentStep = this.steps[Math.min(this.stepIndex, this.steps.length - 1)];
        if (currentStep) {
            const stepTag = document.getElementById('guide-step-tag');
            const stepTitle = document.getElementById('guide-step-title');
            const stepDesc = document.getElementById('guide-step-desc');
            const stepTip = document.getElementById('guide-step-tip');

            if (stepTag) stepTag.textContent = currentStep.tag;
            if (stepTitle) stepTitle.textContent = currentStep.title;
            if (stepDesc) stepDesc.textContent = currentStep.desc;
            if (stepTip) stepTip.textContent = currentStep.tip;
        }

        const powerBtn = document.getElementById('btn-power-on');
        if (powerBtn) {
            if (installedCount === totalItems) {
                powerBtn.classList.add('ready');
                powerBtn.disabled = false;
                powerBtn.innerHTML = `<span>⚡</span> 启动主机 (POWER ON)`;
            } else {
                powerBtn.classList.remove('ready');
                powerBtn.disabled = true;
                powerBtn.innerHTML = `<span>⚡</span> 等待组装完成 (${installedCount}/${totalItems})`;
            }
        }
    }

    powerOnSystem() {
        if (this.isPowered) {
            this.shutdownSystem();
            return;
        }

        this.isPowered = true;
        const powerBtn = document.getElementById('btn-power-on');
        if (powerBtn) {
            powerBtn.classList.remove('ready');
            powerBtn.classList.add('powered');
            powerBtn.innerHTML = `<span>🛑</span> 关机断电 (SHUT DOWN)`;
        }

        if (window.soundEngine) window.soundEngine.startFanSound();

        const coolerFan = document.getElementById('cooler-fan-blades');
        if (coolerFan) coolerFan.classList.add('fan-spinning');
        document.querySelectorAll('.gpu-fan-unit').forEach(f => f.classList.add('fan-spinning'));

        const mbSvg = document.getElementById('motherboard-svg');
        if (mbSvg) mbSvg.classList.add('rgb-glow-active');

        const ledCpu = document.getElementById('led-cpu');
        const ledDram = document.getElementById('led-dram');
        const ledVga = document.getElementById('led-vga');
        const ledBoot = document.getElementById('led-boot');

        ledCpu.setAttribute('fill', '#ff4757');
        setTimeout(() => {
            ledCpu.setAttribute('fill', '#2a3346');
            ledDram.setAttribute('fill', '#ffa502');
            setTimeout(() => {
                ledDram.setAttribute('fill', '#2a3346');
                ledVga.setAttribute('fill', '#ffffff');
                setTimeout(() => {
                    ledVga.setAttribute('fill', '#2a3346');
                    ledBoot.setAttribute('fill', '#00f59b');
                    setTimeout(() => {
                        ledBoot.setAttribute('fill', '#2a3346');
                        if (window.soundEngine) window.soundEngine.playPostSuccessBeep();

                        setTimeout(() => {
                            this.showBiosModal();
                        }, 500);
                    }, 500);
                }, 600);
            }, 700);
        }, 500);
    }

    shutdownSystem() {
        this.isPowered = false;
        if (window.soundEngine) window.soundEngine.stopFanSound();

        const powerBtn = document.getElementById('btn-power-on');
        if (powerBtn) {
            powerBtn.classList.remove('powered');
            powerBtn.classList.add('ready');
            powerBtn.innerHTML = `<span>⚡</span> 启动主机 (POWER ON)`;
        }

        const coolerFan = document.getElementById('cooler-fan-blades');
        if (coolerFan) coolerFan.classList.remove('fan-spinning');
        document.querySelectorAll('.gpu-fan-unit').forEach(f => f.classList.remove('fan-spinning'));

        const mbSvg = document.getElementById('motherboard-svg');
        if (mbSvg) mbSvg.classList.remove('rgb-glow-active');
    }

    showBiosModal() {
        const modal = document.getElementById('bios-modal');
        if (modal) {
            modal.classList.add('open');
            if (window.soundEngine) window.soundEngine.playSuccessChord();
        }
    }

    resetWorkbench() {
        if (this.isPowered) this.shutdownSystem();
        this.isDiagMode = false;
        this.diagFixed = false;
        this.state = {
            cpu: false,
            paste: false,
            cooler: false,
            ram1: false,
            ram2: false,
            ssd: false,
            ssdFilmPeeled: false,
            gpu: false,
            powerCables: false
        };
        this.stepIndex = 0;
        this.selectedPart = null;

        const promptEl = document.getElementById('mb-target-prompt');
        if (promptEl) promptEl.style.display = 'none';

        const banner = document.getElementById('diag-alert-banner');
        if (banner) banner.style.display = 'none';

        const diagBtn = document.getElementById('btn-trigger-diag');
        if (diagBtn) {
            diagBtn.innerHTML = `<span>🚨</span> 实战故障排除演练 (DRAM报警)`;
            diagBtn.style.borderColor = 'var(--amber-warning)';
            diagBtn.style.color = 'var(--amber-warning)';
        }

        document.querySelectorAll('.part-item').forEach(item => {
            item.classList.remove('installed', 'selected');
            const badge = item.querySelector('.part-badge-tag');
            if (badge) badge.textContent = '待装配';
        });

        this.renderMotherboardSVG();
        this.bindEvents();
        this.updateUI();
    }
}

window.workbench = new AssemblyWorkbench();
