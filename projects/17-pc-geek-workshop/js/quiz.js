/**
 * 独中高中资讯科技 - 电脑硬件互动教育游戏
 * 课纲考点小测验系统 (自动判分 / 详细解析 / 成绩总评)
 */

class QuizEngine {
    constructor() {
        this.currentIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isLocked = false;
    }

    init() {
        this.currentIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isLocked = false;
        this.renderQuestion();
    }

    renderQuestion() {
        const wrapper = document.getElementById('quiz-stage');
        if (!wrapper || !window.QUIZ_QUESTIONS) return;

        const total = window.QUIZ_QUESTIONS.length;

        // 如果全部完成，显示成绩报告
        if (this.currentIndex >= total) {
            this.renderReport(wrapper, total);
            return;
        }

        const q = window.QUIZ_QUESTIONS[this.currentIndex];
        this.isLocked = false;

        wrapper.innerHTML = `
        <div class="quiz-card">
            <div class="quiz-meta-row">
                <div class="quiz-counter">QUESTION ${this.currentIndex + 1} / ${total}</div>
                <div style="display:flex; gap:0.5rem; align-items:center;">
                    <span style="font-size:0.75rem; background:rgba(0,243,255,0.12); color:var(--cyan-primary); padding:2px 8px; border-radius:8px;">${q.category}</span>
                    <span class="quiz-score-badge">当前得分: ${this.score} 分</span>
                </div>
            </div>

            <div class="quiz-question-text">
                ${this.currentIndex + 1}. ${q.question}
            </div>

            <div class="quiz-options-list" id="quiz-options-box">
                ${q.options.map((opt, idx) => `
                    <div class="quiz-option-item" data-index="${idx}">
                        <div class="diag-opt-key">${String.fromCharCode(65 + idx)}</div>
                        <div style="flex:1;">${opt}</div>
                    </div>
                `).join('')}
            </div>

            <!-- 解析栏 -->
            <div id="quiz-explain" class="quiz-explain-box">
                <div style="font-weight:bold; color:var(--cyan-primary); margin-bottom:4px;">📘 答案精析与考点透视：</div>
                <div id="quiz-explain-text">${q.explanation}</div>
            </div>

            <div class="quiz-footer-row">
                <button id="btn-next-question" class="ctrl-btn" style="display:none; background:linear-gradient(135deg, var(--cyan-primary), var(--violet-accent)); color:#07090e; font-weight:bold; padding:0.6rem 1.4rem;">
                    下一题 ➔
                </button>
            </div>
        </div>
        `;

        // 绑定选项点击
        const optionEls = wrapper.querySelectorAll('.quiz-option-item');
        optionEls.forEach(el => {
            el.addEventListener('click', () => {
                if (this.isLocked) return;
                const selectedIdx = parseInt(el.dataset.index, 10);
                this.handleAnswer(q, selectedIdx, optionEls);
            });
        });

        const nextBtn = document.getElementById('btn-next-question');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentIndex++;
                this.renderQuestion();
            });
        }
    }

    handleAnswer(q, selectedIdx, optionEls) {
        this.isLocked = true;
        const isCorrect = (selectedIdx === q.correct);

        optionEls.forEach(el => {
            el.classList.add('locked');
            const idx = parseInt(el.dataset.index, 10);
            if (idx === q.correct) {
                el.classList.add('correct');
            } else if (idx === selectedIdx && !isCorrect) {
                el.classList.add('wrong');
            }
        });

        const total = window.QUIZ_QUESTIONS ? window.QUIZ_QUESTIONS.length : 20;
        const ptsPerQ = Math.round(100 / total);

        if (isCorrect) {
            this.score += ptsPerQ;
            if (window.soundEngine) window.soundEngine.playSuccessChord();
        } else {
            if (window.soundEngine) window.soundEngine.playErrorBuzz();
        }

        this.userAnswers.push({
            questionId: q.id,
            selected: selectedIdx,
            isCorrect: isCorrect
        });

        // 展开解析并显示下一题
        const explainBox = document.getElementById('quiz-explain');
        if (explainBox) explainBox.style.display = 'block';

        const nextBtn = document.getElementById('btn-next-question');
        if (nextBtn) nextBtn.style.display = 'inline-flex';
    }

    renderReport(wrapper, total) {
        const percent = Math.min(100, Math.round(this.score));
        let evalTag = '潜力科技小白（多测两次变大神）';
        let evalColor = '#ff4757';
        if (percent >= 85) {
            evalTag = '🔥 数码与 AI 极客达人（告别所有小白坑）';
            evalColor = '#00f59b';
        } else if (percent >= 60) {
            evalTag = '⚡ 实用科技小能手（生活数码通）';
            evalColor = '#ffb703';
        }

        if (window.soundEngine) window.soundEngine.playSuccessChord();

        wrapper.innerHTML = `
        <div class="quiz-card" style="text-align:center; padding:3rem 2rem; align-items:center;">
            <div style="font-size:3rem; margin-bottom:0.5rem;">🏆</div>
            <h2 style="font-size:1.6rem; color:#ffffff; font-weight:800;">常识测验挑战圆满完成！</h2>
            <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1.5rem;">
                电脑硬件排障、网络实用技能与前沿 AI 生活常识综合评测
            </div>

            <div style="display:inline-flex; flex-direction:column; align-items:center; background:#090d16; border:2px solid ${evalColor}; padding:1.5rem 3rem; border-radius:var(--radius-xl); margin-bottom:1.5rem; box-shadow:0 0 30px rgba(0,0,0,0.8);">
                <div style="font-size:3.5rem; font-family:var(--font-mono); font-weight:900; color:${evalColor};">
                    ${this.score} <span style="font-size:1.2rem; color:var(--text-muted);">/ 100 分</span>
                </div>
                <div style="font-size:1rem; font-weight:bold; color:#ffffff; margin-top:4px;">
                    评级：<span style="color:${evalColor};">${evalTag}</span>
                </div>
            </div>

            <p style="max-width:560px; font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-bottom:2rem;">
                恭喜你完成了 20 道贴近生活的数码与科技挑战！你已成功掌握了电脑日常运行内存与硬盘辨别、开机黑屏排障、光猫与双频 Wi-Fi 选网常识、网线避坑指南，以及当今最热门的 ChatGPT 大模型幻觉防范、AI 提示词技巧与 Deepfake 换脸防骗神技！建议随时返回【装机实验室】或【网络拓扑】进行动手实践！
            </p>

            <button id="btn-restart-quiz" class="ctrl-btn" style="background:linear-gradient(135deg, var(--cyan-primary), var(--green-success)); color:#07090e; font-weight:bold; padding:0.75rem 2rem; font-size:1rem;">
                <span>↺</span> 重新挑战测验
            </button>
        </div>
        `;

        const restartBtn = document.getElementById('btn-restart-quiz');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.init();
            });
        }
    }
}

window.quizEngine = new QuizEngine();
