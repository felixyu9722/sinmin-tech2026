/**
 * 独中高中资讯科技 - 电脑硬件互动教育游戏
 * 高精矢量硬件 Clipart 图标库 (替代幼稚 Emoji，呈现专业科技感硬件插画)
 */

const HARDWARE_CLIPARTS = {
    // 1. 中央处理器 CPU (LGA1700 镀镍顶盖 + 防呆金三角 + 基板缺口)
    cpu: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 绿色电路板基底 -->
        <rect x="4" y="4" width="40" height="40" rx="3" fill="#064e3b" stroke="#059669" stroke-width="1.5"/>
        <!-- 防呆侧缺口 -->
        <rect x="3" y="14" width="2" height="4" rx="1" fill="#0a0d14"/>
        <rect x="3" y="30" width="2" height="4" rx="1" fill="#0a0d14"/>
        <!-- 金色防呆三角 -->
        <polygon points="6,6 12,6 6,12" fill="#f59e0b"/>
        <!-- 镀镍金属顶盖 (IHS) -->
        <rect x="10" y="10" width="28" height="28" rx="3" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
        <rect x="13" y="13" width="22" height="22" rx="2" fill="#e2e8f0"/>
        <!-- 顶盖激光雕刻 -->
        <text x="24" y="23" fill="#0f172a" font-size="5" font-family="sans-serif" font-weight="900" text-anchor="middle">intel</text>
        <text x="24" y="29" fill="#334155" font-size="3.5" font-family="monospace" font-weight="bold" text-anchor="middle">i7-14700K</text>
    </svg>`,

    // 2. 导热硅脂 TIM (专业针筒施加器 + 银灰硅脂滴)
    paste: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 针筒刻度管身 (斜向 45度) -->
        <g transform="rotate(-45 24 24)">
            <!-- 活塞推进推杆 -->
            <rect x="22" y="2" width="4" height="12" rx="1" fill="#94a3b8"/>
            <rect x="19" y="2" width="10" height="3" rx="1" fill="#64748b"/>
            <!-- 针筒主体 -->
            <rect x="18" y="12" width="12" height="24" rx="2" fill="#1e293b" stroke="#00f3ff" stroke-width="1.5"/>
            <!-- 内部硅脂液体 -->
            <rect x="20" y="20" width="8" height="15" rx="1" fill="#cbd5e1"/>
            <!-- 刻度线 -->
            <line x1="20" y1="16" x2="24" y2="16" stroke="#00f3ff" stroke-width="1"/>
            <line x1="20" y1="20" x2="25" y2="20" stroke="#00f3ff" stroke-width="1"/>
            <line x1="20" y1="24" x2="24" y2="24" stroke="#00f3ff" stroke-width="1"/>
            <line x1="20" y1="28" x2="25" y2="28" stroke="#00f3ff" stroke-width="1"/>
            <!-- 出料嘴 -->
            <path d="M 22 36 L 26 36 L 25 42 L 23 42 Z" fill="#64748b"/>
            <rect x="23.5" y="42" width="1" height="4" fill="#94a3b8"/>
            <!-- 针尖硅脂液滴 -->
            <circle cx="24" cy="47" r="2" fill="#cbd5e1"/>
        </g>
    </svg>`,

    // 3. 六热管 CPU 散热器 (双塔鳍片 + 纯铜热管 + 散热风扇)
    cooler: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 纯铜热管穿插 (U型弯管) -->
        <path d="M 10 38 L 10 8 A 2 2 0 0 1 14 8 L 14 38" stroke="#f59e0b" stroke-width="2" fill="none"/>
        <path d="M 34 38 L 34 8 A 2 2 0 0 1 38 8 L 38 38" stroke="#f59e0b" stroke-width="2" fill="none"/>
        <!-- 散热铝制鳍片组 (横向排列) -->
        <rect x="7" y="10" width="34" height="2" fill="#94a3b8"/>
        <rect x="7" y="14" width="34" height="2" fill="#94a3b8"/>
        <rect x="7" y="18" width="34" height="2" fill="#94a3b8"/>
        <rect x="7" y="22" width="34" height="2" fill="#94a3b8"/>
        <rect x="7" y="26" width="34" height="2" fill="#94a3b8"/>
        <rect x="7" y="30" width="34" height="2" fill="#94a3b8"/>
        <rect x="7" y="34" width="34" height="2" fill="#94a3b8"/>
        <!-- 前置 120mm 散热风扇外框 -->
        <rect x="12" y="11" width="24" height="24" rx="4" fill="#0f172a" stroke="#00f3ff" stroke-width="1.5"/>
        <circle cx="24" cy="23" r="4" fill="#38bdf8"/>
        <circle cx="24" cy="23" r="9" stroke="#334155" stroke-width="1.5" stroke-dasharray="3,2"/>
        <!-- 纯铜底座 -->
        <rect x="12" y="38" width="24" height="5" rx="1" fill="#d97706" stroke="#b45309" stroke-width="1"/>
    </svg>`,

    // 4. DDR5 内存条 (合金散热马甲 + 顶部 RGB 灯条 + 偏心防呆缺口金手指)
    ram: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 内存条主体 (横向长条) -->
        <g transform="translate(0, 8)">
            <!-- 铝合金装甲主体 -->
            <rect x="4" y="8" width="40" height="18" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
            <!-- 顶部 RGB 流光灯条 -->
            <path d="M 5 9 L 43 9 L 41 5 L 7 5 Z" fill="url(#ramRgbGrad)" />
            <!-- 马甲机甲切割线条与铭牌 -->
            <line x1="12" y1="14" x2="36" y2="14" stroke="#475569" stroke-width="1.5"/>
            <text x="24" y="22" fill="#00f3ff" font-size="4" font-family="monospace" font-weight="bold" text-anchor="middle">DDR5 6000</text>
            <!-- 底部电路板与金手指 (带 DDR5 专用偏心防呆缺口) -->
            <rect x="5" y="26" width="17" height="5" fill="#f59e0b"/>
            <!-- 偏心缺口 (Notch) -->
            <rect x="22" y="26" width="3" height="6" fill="#0a0d14"/>
            <rect x="25" y="26" width="18" height="5" fill="#f59e0b"/>
            <!-- 金手指针脚线 -->
            <line x1="8" y1="26" x2="8" y2="31" stroke="#b45309" stroke-width="1"/>
            <line x1="12" y1="26" x2="12" y2="31" stroke="#b45309" stroke-width="1"/>
            <line x1="16" y1="26" x2="16" y2="31" stroke="#b45309" stroke-width="1"/>
            <line x1="30" y1="26" x2="30" y2="31" stroke="#b45309" stroke-width="1"/>
            <line x1="34" y1="26" x2="34" y2="31" stroke="#b45309" stroke-width="1"/>
            <line x1="38" y1="26" x2="38" y2="31" stroke="#b45309" stroke-width="1"/>
        </g>
        <defs>
            <linearGradient id="ramRgbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00f3ff" />
                <stop offset="50%" stop-color="#b066ff" />
                <stop offset="100%" stop-color="#00f59b" />
            </linearGradient>
        </defs>
    </svg>`,

    // 5. M.2 NVMe 固态硬盘 (PCB + 主控芯片 + 闪存颗粒 + M-Key 缺口)
    ssd: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0, 10)">
            <!-- M.2 2280 黑色 PCB 板 -->
            <rect x="4" y="6" width="40" height="16" rx="2" fill="#0f172a" stroke="#00f3ff" stroke-width="1.2"/>
            <!-- 尾部半圆螺丝固定槽 -->
            <circle cx="4" cy="14" r="2.5" fill="#0a0d14"/>
            <!-- 主控芯片 (高速处理核心) -->
            <rect x="10" y="9" width="7" height="10" rx="1" fill="#cbd5e1" stroke="#64748b" stroke-width="0.8"/>
            <text x="13.5" y="15" fill="#0f172a" font-size="2.5" font-family="monospace" text-anchor="middle">PCIe</text>
            <!-- 缓存颗粒 -->
            <rect x="19" y="10" width="4" height="8" rx="0.5" fill="#334155"/>
            <!-- 3D NAND 闪存颗粒 1 & 2 -->
            <rect x="25" y="8.5" width="8" height="11" rx="1" fill="#1e293b" stroke="#475569" stroke-width="0.8"/>
            <rect x="35" y="8.5" width="7" height="11" rx="1" fill="#1e293b" stroke="#475569" stroke-width="0.8"/>
            <!-- M-Key 镀金金手指 (右侧) -->
            <rect x="42" y="7" width="2" height="4" fill="#f59e0b"/>
            <rect x="42" y="13" width="2" height="8" fill="#f59e0b"/>
        </g>
    </svg>`,

    // 6. 独立显卡 GPU (散热风扇 + PCIe 挡板 + 金手指 + 供电口)
    gpu: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(2, 6)">
            <!-- 显卡金属背板与散热外壳 -->
            <rect x="6" y="6" width="36" height="22" rx="3" fill="#1e293b" stroke="#00f3ff" stroke-width="1.5"/>
            <!-- 双风扇导流罩 -->
            <circle cx="16" cy="17" r="7" fill="#090d16" stroke="#475569" stroke-width="1"/>
            <circle cx="16" cy="17" r="2.5" fill="#38bdf8"/>
            <circle cx="32" cy="17" r="7" fill="#090d16" stroke="#475569" stroke-width="1"/>
            <circle cx="32" cy="17" r="2.5" fill="#38bdf8"/>
            <!-- 扇叶示意 -->
            <line x1="16" y1="11" x2="16" y2="23" stroke="#38bdf8" stroke-width="1.2"/>
            <line x1="10" y1="17" x2="22" y2="17" stroke="#38bdf8" stroke-width="1.2"/>
            <line x1="32" y1="11" x2="32" y2="23" stroke="#38bdf8" stroke-width="1.2"/>
            <line x1="26" y1="17" x2="38" y2="17" stroke="#38bdf8" stroke-width="1.2"/>
            <!-- 左侧金属视频输出挡板 -->
            <rect x="3" y="2" width="3" height="30" rx="1" fill="#94a3b8" stroke="#64748b" stroke-width="0.8"/>
            <!-- 底部 PCIe x16 金手指插槽触点 -->
            <rect x="10" y="28" width="28" height="4" fill="#f59e0b"/>
            <rect x="14" y="28" width="2" height="5" fill="#0a0d14"/> <!-- PCIe防呆卡位 -->
            <!-- 顶部 8-Pin 供电口 -->
            <rect x="34" y="4" width="6" height="2" fill="#f59e0b"/>
        </g>
    </svg>`,

    // 7. 电源供应器 PSU (金属机身 + 进风风扇网罩 + 模块线缆)
    pwr: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(4, 6)">
            <!-- 电源金属外壳 -->
            <rect x="2" y="4" width="36" height="28" rx="3" fill="#111827" stroke="#64748b" stroke-width="1.5"/>
            <!-- 顶部蜂窝进气网孔与风扇 -->
            <circle cx="20" cy="18" r="10" fill="#030712" stroke="#f59e0b" stroke-width="1.2"/>
            <circle cx="20" cy="18" r="3" fill="#f59e0b"/>
            <line x1="20" y1="9" x2="20" y2="27" stroke="#475569" stroke-width="1"/>
            <line x1="11" y1="18" x2="29" y2="18" stroke="#475569" stroke-width="1"/>
            <!-- 80 PLUS 金牌标识小标签 -->
            <rect x="5" y="7" width="6" height="4" rx="0.5" fill="#f59e0b"/>
            <!-- 模组供电线束 -->
            <path d="M 38 12 Q 43 14 43 20" stroke="#f59e0b" stroke-width="2" fill="none"/>
            <path d="M 38 18 Q 42 20 42 26" stroke="#00f3ff" stroke-width="2" fill="none"/>
            <path d="M 38 24 Q 44 26 44 32" stroke="#b066ff" stroke-width="2" fill="none"/>
        </g>
    </svg>`,

    // 8. 主板 Motherboard
    motherboard: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="40" height="40" rx="3" fill="#0f172a" stroke="#00f3ff" stroke-width="1.5"/>
        <rect x="10" y="8" width="14" height="14" rx="2" fill="#1e293b" stroke="#94a3b8" stroke-width="1"/>
        <rect x="28" y="8" width="3" height="18" rx="0.5" fill="#00f3ff"/>
        <rect x="33" y="8" width="3" height="18" rx="0.5" fill="#00f3ff"/>
        <rect x="8" y="28" width="26" height="3" rx="0.5" fill="#f59e0b"/>
        <rect x="28" y="30" width="12" height="10" rx="1" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
    </svg>`,

    // 9. 调制解调器 / 数据机 Modem (光纤 SC/APC 蓝口 + RJ45 网口 + PON/LOS 指示灯)
    modem: `
    <svg viewBox="0 0 54 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="10" width="46" height="28" rx="4" fill="#0f172a" stroke="#fbbf24" stroke-width="1.5"/>
        <!-- 散热格栅 -->
        <line x1="8" y1="16" x2="32" y2="16" stroke="#334155" stroke-width="1"/>
        <line x1="8" y1="20" x2="32" y2="20" stroke="#334155" stroke-width="1"/>
        <!-- 指示灯组 (Power绿, PON绿, LOS灭, LAN绿) -->
        <circle cx="10" cy="27" r="1.5" fill="#00f59b"/>
        <circle cx="15" cy="27" r="1.5" fill="#00f59b"/>
        <circle cx="20" cy="27" r="1.5" fill="#334155"/>
        <circle cx="25" cy="27" r="1.5" fill="#00f3ff"/>
        <!-- 接口后背: 蓝色光纤 SC/APC 口 -->
        <rect x="36" y="22" width="5" height="7" rx="1" fill="#2563eb" stroke="#38bdf8" stroke-width="0.8"/>
        <!-- 黄色 RJ45 千兆网口 -->
        <rect x="43" y="22" width="5" height="7" rx="1" fill="#f59e0b" stroke="#fbbf24" stroke-width="0.8"/>
    </svg>`,

    // 10. 无线路由器 Wi-Fi Router (4根外置全向天线 + 双频无线波 + WAN/LAN 口)
    router: `
    <svg viewBox="0 0 54 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 4 根外置天线 -->
        <line x1="10" y1="18" x2="6" y2="4" stroke="#00f59b" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="18" y1="18" x2="16" y2="3" stroke="#00f59b" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="36" y1="18" x2="38" y2="3" stroke="#00f59b" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="44" y1="18" x2="48" y2="4" stroke="#00f59b" stroke-width="1.8" stroke-linecap="round"/>
        <!-- 机身 -->
        <rect x="6" y="18" width="42" height="22" rx="3" fill="#111827" stroke="#00f59b" stroke-width="1.5"/>
        <text x="27" y="32" fill="#00f59b" font-size="5" font-family="sans-serif" font-weight="900" text-anchor="middle">Wi-Fi 6</text>
        <!-- 指示灯 -->
        <circle cx="16" cy="36" r="1" fill="#00f59b"/>
        <circle cx="21" cy="36" r="1" fill="#00f59b"/>
        <circle cx="26" cy="36" r="1" fill="#00f3ff"/>
        <circle cx="31" cy="36" r="1" fill="#00f59b"/>
        <circle cx="36" cy="36" r="1" fill="#00f59b"/>
    </svg>`,

    // 11. 核心交换机 Switch Hub (24口千兆机架式 + 矩阵指示灯)
    switch: `
    <svg viewBox="0 0 54 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="16" width="48" height="18" rx="2" fill="#1e1b4b" stroke="#b066ff" stroke-width="1.5"/>
        <!-- 左右机架安装耳朵 -->
        <rect x="1" y="18" width="2" height="14" fill="#64748b"/>
        <rect x="51" y="18" width="2" height="14" fill="#64748b"/>
        <!-- 双排 RJ45 端口阵列与指示灯 (模拟 24 口) -->
        <g transform="translate(6, 20)">
            <rect x="0" y="0" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="4" y="0" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="8" y="0" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="12" y="0" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="16" y="0" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="20" y="0" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="24" y="0" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="28" y="0" width="3" height="4" rx="0.5" fill="#334155"/>
            <!-- 下排 -->
            <rect x="0" y="5" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="4" y="5" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="8" y="5" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="12" y="5" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="16" y="5" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="20" y="5" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="24" y="5" width="3" height="4" rx="0.5" fill="#334155"/>
            <rect x="28" y="5" width="3" height="4" rx="0.5" fill="#334155"/>
            <!-- 激活端口绿灯 -->
            <circle cx="1.5" cy="-2" r="0.8" fill="#00f59b"/>
            <circle cx="5.5" cy="-2" r="0.8" fill="#00f59b"/>
            <circle cx="9.5" cy="-2" r="0.8" fill="#00f59b"/>
            <circle cx="13.5" cy="-2" r="0.8" fill="#00f59b"/>
            <circle cx="17.5" cy="-2" r="0.8" fill="#00f59b"/>
            <circle cx="21.5" cy="-2" r="0.8" fill="#00f59b"/>
            <!-- 2个 SFP+ 光纤万兆上行插槽 -->
            <rect x="34" y="1" width="6" height="7" rx="0.5" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>
        </g>
    </svg>`,

    // 12. 企业级无线接入点 AP (吸顶式圆盘 + 环形信号灯 + PoE 供电)
    ap: `
    <svg viewBox="0 0 54 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 外圈吸顶式圆盘外壳 -->
        <circle cx="27" cy="24" r="20" fill="#0f291e" stroke="#00f59b" stroke-width="1.8"/>
        <!-- 内层圆环 -->
        <circle cx="27" cy="24" r="14" fill="#064e3b" stroke="#059669" stroke-width="1"/>
        <!-- 中心呼吸环 LED -->
        <circle cx="27" cy="24" r="6" fill="#022c22" stroke="#00f59b" stroke-width="1.5"/>
        <circle cx="27" cy="24" r="2.5" fill="#00f59b"/>
        <!-- 环形射频微波辐射示意弧 -->
        <path d="M 12 16 A 18 18 0 0 1 42 16" stroke="#00f59b" stroke-width="1.2" stroke-dasharray="2,2" fill="none" opacity="0.7"/>
        <path d="M 8 12 A 24 24 0 0 1 46 12" stroke="#00f59b" stroke-width="1" stroke-dasharray="3,3" fill="none" opacity="0.5"/>
    </svg>`,

    // 13. 学生平板电脑 Tablet (供学校无线联网使用)
    tablet: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="6" width="32" height="36" rx="3" fill="#1e293b" stroke="#00f59b" stroke-width="1.5"/>
        <rect x="11" y="9" width="26" height="30" rx="1.5" fill="#090d16"/>
        <circle cx="24" cy="7.5" r="0.8" fill="#64748b"/>
        <!-- 屏幕内容：课件图表 -->
        <rect x="14" y="13" width="12" height="3" rx="0.5" fill="#00f59b"/>
        <rect x="14" y="18" width="20" height="2" rx="0.5" fill="#38bdf8"/>
        <rect x="14" y="22" width="16" height="2" rx="0.5" fill="#94a3b8"/>
        <!-- Wi-Fi 信号角标 -->
        <path d="M 31 13 A 4 4 0 0 1 35 15" stroke="#00f59b" stroke-width="1" fill="none"/>
        <circle cx="31" cy="15" r="0.8" fill="#00f59b"/>
    </svg>`,

    // 14. 智能电视 Smart TV
    tv: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="8" width="38" height="26" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>
        <rect x="7" y="10" width="34" height="22" rx="1" fill="#020617"/>
        <polygon points="21,17 21,25 29,21" fill="#38bdf8"/>
        <!-- 底座支架 -->
        <line x1="24" y1="34" x2="24" y2="38" stroke="#94a3b8" stroke-width="2"/>
        <line x1="16" y1="38" x2="32" y2="38" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    // 15. 台式电脑 Desktop PC
    pc: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 显示器 -->
        <rect x="6" y="6" width="30" height="22" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
        <rect x="8" y="8" width="26" height="18" rx="1" fill="#090d16"/>
        <rect x="19" y="28" width="4" height="6" fill="#64748b"/>
        <rect x="14" y="34" width="14" height="2" rx="1" fill="#94a3b8"/>
        <!-- 侧边主机箱 -->
        <rect x="38" y="8" width="8" height="28" rx="1.5" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>
        <circle cx="42" cy="12" r="1" fill="#00f3ff"/>
        <line x1="40" y1="16" x2="44" y2="16" stroke="#475569" stroke-width="1"/>
    </svg>`
};

window.HARDWARE_CLIPARTS = HARDWARE_CLIPARTS;

