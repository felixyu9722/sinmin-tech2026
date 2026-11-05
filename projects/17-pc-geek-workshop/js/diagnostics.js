/**
 * 独中高中资讯科技 - 电脑硬件互动教育游戏
 * 电脑硬件故障排查诊断实验室 (实战场景分析 + Debug LED / 蜂鸣器报警模拟)
 */

class DiagnosticsEngine {
    constructor() {
        this.currentCaseIndex = 0;
        this.answeredCases = {}; // 记录每一关答题状态
    }

    init() {
        this.renderCaseList();
        this.renderActiveCase();
    }

    // 渲染左侧故障实录案例列表
    renderCaseList() {
        const listContainer = document.getElementById('diag-case-list');
        if (!listContainer || !window.DIAGNOSTIC_CASES) return;

        listContainer.innerHTML = '';
        window.DIAGNOSTIC_CASES.forEach((c, idx) => {
            const item = document.createElement('div');
            item.className = `case-item ${idx === this.currentCaseIndex ? 'active' : ''}`;
            item.dataset.index = idx;

            const isDone = this.answeredCases[c.id];
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <span class="case-badge">实录 0${idx + 1} • ${c.difficulty}</span>
                    ${isDone ? '<span style="color:#00f59b; font-size:0.75rem;">已排解 ✓</span>' : ''}
                </div>
                <div class="case-item-title">${c.title.split('：')[0]}</div>
                <div style="font-size:0.75rem; color:var(--text-muted); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
                    ${c.title.split('：')[1] || ''}
                </div>
            `;

            item.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                this.currentCaseIndex = idx;
                this.renderCaseList();
                this.renderActiveCase();
            });

            listContainer.appendChild(item);
        });
    }

    // 渲染当前选中的排错案例详情与答题选项
    renderActiveCase() {
        const container = document.getElementById('diag-case-stage');
        if (!container || !window.DIAGNOSTIC_CASES) return;

        const currentCase = window.DIAGNOSTIC_CASES[this.currentCaseIndex];
        if (!currentCase) return;

        container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
            
            <!-- 案例头部 -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border-color); padding-bottom:1rem;">
                <div>
                    <div style="font-size:0.75rem; color:var(--amber-warning); font-family:var(--font-mono); margin-bottom:4px;">
                        CASE 0${this.currentCaseIndex + 1} • 难度: ${currentCase.difficulty}
                    </div>
                    <h3 style="font-size:1.15rem; color:#ffffff; font-weight:700;">${currentCase.title}</h3>
                </div>
                <button id="btn-replay-alarm" class="ctrl-btn" style="border-color:var(--amber-warning); color:var(--amber-warning);">
                    <span>🔊</span> 听取报警蜂鸣音 (Beep)
                </button>
            </div>

            <!-- 现场实况与故障表象 -->
            <div class="symptom-box">
                <div class="symptom-title">
                    <span>🔍</span> 现场勘验与异常症状采集：
                </div>
                <ul class="symptom-list">
                    ${currentCase.symptoms.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>

            <!-- 诊断决策选项 -->
            <div style="display:flex; flex-direction:column; gap:0.6rem;">
                <div style="font-size:0.88rem; font-weight:bold; color:var(--cyan-primary);">
                    👉 作为硬件维修工程师，你判定根本原因与解决措施是：
                </div>
                <div class="diag-options-grid">
                    ${currentCase.options.map(opt => `
                        <button class="diag-option-btn" data-opt-id="${opt.id}">
                            <span class="diag-opt-key">${opt.id}</span>
                            <span style="flex:1;">${opt.text}</span>
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- 诊断反馈与知识精析 -->
            <div id="diag-feedback" class="diag-feedback-box"></div>

        </div>
        `;

        // 绑定报警音按钮
        const alarmBtn = document.getElementById('btn-replay-alarm');
        if (alarmBtn) {
            alarmBtn.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playAlarmBeep();
            });
        }

        // 绑定选项点击事件
        const optionBtns = container.querySelectorAll('.diag-option-btn');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const optId = btn.dataset.optId;
                this.handleOptionSelect(currentCase, optId);
            });
        });
    }

    // 判定用户诊断选项
    handleOptionSelect(currentCase, optId) {
        const option = currentCase.options.find(o => o.id === optId);
        if (!option) return;

        const feedbackBox = document.getElementById('diag-feedback');
        if (!feedbackBox) return;

        if (option.isCorrect) {
            // 答对
            if (window.soundEngine) window.soundEngine.playSuccessChord();
            feedbackBox.className = 'diag-feedback-box correct';
            feedbackBox.innerHTML = `
                <div style="font-size:0.95rem; font-weight:bold; margin-bottom:6px; color:#00f59b;">
                    ✓ 诊断精准！故障成功排解！
                </div>
                <div style="margin-bottom:8px;">${option.feedback}</div>
                <div style="border-top:1px dashed rgba(0,245,155,0.3); padding-top:8px; font-size:0.8rem; color:#bbf7d0;">
                    📘 <strong>独中课纲考点透视</strong>：${currentCase.explanation}
                </div>
            `;
            this.answeredCases[currentCase.id] = true;
            this.renderCaseList();
        } else {
            // 答错
            if (window.soundEngine) window.soundEngine.playErrorBuzz();
            feedbackBox.className = 'diag-feedback-box wrong';
            feedbackBox.innerHTML = `
                <div style="font-size:0.95rem; font-weight:bold; margin-bottom:6px; color:#ff4757;">
                    ✕ 诊断偏差，未能解决根本故障！
                </div>
                <div>${option.feedback}</div>
                <div style="margin-top:6px; font-size:0.8rem; color:#fca5a5;">
                    💡 提示：请结合主板 Debug LED 指示灯或硬件工作温度等物理表象再次分析。
                </div>
            `;
        }
    }
}

window.diagnosticsEngine = new DiagnosticsEngine();
