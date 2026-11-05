/**
 * 独中高中资讯科技 - 电脑硬件互动教育游戏
 * 主应用程序控制器 (导航切换 / 弹窗控制 / 硬件 2.5D 特写检视器 / 声音总控)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有子系统
    if (window.workbench) window.workbench.init();
    if (window.xrayEngine) window.xrayEngine.init();
    if (window.networkEngine) window.networkEngine.init();
    if (window.quizEngine) window.quizEngine.init();

    // 1. 顶部主导航 Tab 切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.game-view');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.soundEngine) window.soundEngine.playClick();
            const targetViewId = btn.dataset.view;

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            views.forEach(v => {
                if (v.id === targetViewId) {
                    v.classList.add('active');
                } else {
                    v.classList.remove('active');
                }
            });

            // 触发特定视图自适应重绘
            if (targetViewId === 'view-network' && window.networkEngine) {
                window.networkEngine.render();
            } else if (targetViewId === 'view-xray' && window.xrayEngine) {
                window.xrayEngine.renderCurrentView();
            } else if (targetViewId === 'view-quiz' && window.quizEngine) {
                const stage = document.getElementById('quiz-stage');
                if (stage && (!stage.children || stage.children.length === 0)) {
                    window.quizEngine.init();
                }
            }
        });
    });

    // 2. 音效静音控制开关
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            if (window.soundEngine) {
                const isMuted = window.soundEngine.toggleMute();
                soundBtn.innerHTML = isMuted 
                    ? `<span>🔇</span> 音效: 关` 
                    : `<span>🔊</span> 音效: 开`;
                soundBtn.style.color = isMuted ? 'var(--text-muted)' : 'var(--cyan-primary)';
            }
        });
    }

    // 3. 零件库中的 🔍 特写检视按钮
    const inspectBtns = document.querySelectorAll('.inspect-btn');
    inspectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const partId = btn.dataset.inspect;
            openInspectorModal(partId);
        });
    });

    // 4. 模态框通用关闭机制
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(m => {
        const closeBtns = m.querySelectorAll('.modal-close-btn');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                m.classList.remove('open');
                if (window.soundEngine) window.soundEngine.playClick();
            });
        });
        
        m.addEventListener('click', (e) => {
            if (e.target === m) {
                m.classList.remove('open');
            }
        });
    });

    // 5. 电脑开机实机演示视频弹窗控制 (红框需求)
    const openVideoBtn = document.getElementById('btn-open-boot-video');
    const videoModal = document.getElementById('modal-boot-video');
    const closeVideoBtn = document.getElementById('btn-close-boot-video');
    const videoPlayer = document.getElementById('player-boot-video');

    if (openVideoBtn && videoModal && videoPlayer) {
        openVideoBtn.addEventListener('click', () => {
            if (window.soundEngine) window.soundEngine.playClick();
            videoModal.style.display = 'flex';
            videoPlayer.play().catch(err => console.log('Autoplay handled:', err));
        });

        const closeVideo = () => {
            videoModal.style.display = 'none';
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
            if (window.soundEngine) window.soundEngine.playClick();
        };

        if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideo);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideo();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.style.display === 'flex') {
                closeVideo();
            }
        });
    }
});

// 打开硬件 2.5D 特写检视器弹窗 (采用专业高精 Clipart 替代 Emoji)
function openInspectorModal(partId) {
    if (!window.HARDWARE_DATA) return;
    const data = window.HARDWARE_DATA[partId];
    if (!data) return;

    if (window.soundEngine) window.soundEngine.playClick();

    const modal = document.getElementById('inspect-modal');
    const titleEl = document.getElementById('inspect-title');
    const bodyEl = document.getElementById('inspect-body');

    if (!modal || !titleEl || !bodyEl) return;

    titleEl.textContent = `${data.name} 深度剖析`;

    bodyEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#080c16; border:1px solid #1e293b; padding:1.25rem; border-radius:var(--radius-md); gap:1rem;">
            <div>
                <div style="font-size:0.75rem; color:var(--cyan-primary); font-family:var(--font-mono);">${data.engName}</div>
                <div style="font-size:1.15rem; font-weight:bold; color:#ffffff; margin-top:2px;">${data.model || data.name}</div>
                <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:3px;">${data.subtitle || ''}</div>
            </div>
            <!-- 专业硬件矢量 Clipart 图标容器 -->
            <div style="width:72px; height:72px; background:rgba(0,0,0,0.6); padding:8px; border-radius:var(--radius-md); border:1px solid rgba(0,243,255,0.3); display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 0 15px rgba(0,243,255,0.15);">
                ${getPartClipart(partId)}
            </div>
        </div>

        <!-- 核心规格参数表格 -->
        ${data.specs ? `
            <div>
                <div style="font-size:0.85rem; font-weight:bold; color:#ffffff; margin-bottom:6px;">📊 硬件核心参数与电气规格</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                    ${data.specs.map(s => `
                        <div style="background:#090d16; border:1px solid rgba(255,255,255,0.06); padding:6px 10px; border-radius:4px; font-size:0.75rem;">
                            <span style="color:#94a3b8;">${s.label}:</span> 
                            <span style="color:#f8fafc; font-weight:600; margin-left:4px;">${s.value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        <!-- 独中资讯科技高频考点 -->
        ${data.curriculumPoints ? `
            <div style="background:rgba(0,243,255,0.06); border:1px solid rgba(0,243,255,0.25); border-radius:var(--radius-md); padding:1rem;">
                <div style="font-size:0.85rem; font-weight:bold; color:var(--cyan-primary); margin-bottom:6px;">
                    📘 独中统考 / 校内期末高频考点：
                </div>
                <ul style="padding-left:1.2rem; font-size:0.8rem; color:#cbd5e1; display:flex; flex-direction:column; gap:4px; line-height:1.5;">
                    ${data.curriculumPoints.map(p => `<li>${p.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#ffffff;">$1</strong>')}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        <!-- 装机避坑实战提示 -->
        ${data.assemblyTip ? `
            <div style="background:rgba(255,183,3,0.08); border:1px solid rgba(255,183,3,0.3); border-radius:var(--radius-md); padding:0.85rem 1rem; font-size:0.8rem; color:#fde68a; line-height:1.45;">
                ⚠️ <strong>装机实战防呆避坑指南</strong>：${data.assemblyTip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            </div>
        ` : ''}
    `;

    modal.classList.add('open');
}

// 获取部件对应的专业矢量 Clipart (完全杜绝幼稚 Emoji)
function getPartClipart(partId) {
    if (window.HARDWARE_CLIPARTS) {
        if (partId === 'ram1' || partId === 'ram2') return window.HARDWARE_CLIPARTS.ram;
        if (window.HARDWARE_CLIPARTS[partId]) return window.HARDWARE_CLIPARTS[partId];
    }
    return '';
}
