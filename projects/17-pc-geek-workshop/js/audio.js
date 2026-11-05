/**
 * 独中高中资讯科技 - 电脑硬件互动教育游戏
 * Web Audio API 音效引擎 (全纯程序合成，无需外部音频文件，零网络依赖)
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.fanNode = null;
        this.fanGain = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.fanGain) {
            this.fanGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    // 轻柔界面点击声
    playClick() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // 机械卡扣扣紧声 (Snap / Click)
    playSnap() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        // 双重脉冲模拟弹簧卡扣咬合
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

        // 高频咔哒谐波
        const highOsc = this.ctx.createOscillator();
        const highGain = this.ctx.createGain();
        highOsc.type = 'square';
        highOsc.frequency.setValueAtTime(2400, t + 0.01);
        highOsc.frequency.exponentialRampToValueAtTime(800, t + 0.05);

        highGain.gain.setValueAtTime(0.25, t + 0.01);
        highGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        highOsc.connect(highGain);
        highGain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.09);
        highOsc.start(t + 0.01);
        highOsc.stop(t + 0.06);
    }

    // 涂抹导热硅脂湿润挤出声
    playPaste() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.linearRampToValueAtTime(540, t + 0.08);
        osc.frequency.linearRampToValueAtTime(280, t + 0.15);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.17);
    }

    // 主板开机自检正常：经典单声清脆蜂鸣 (Beep ~ 1000Hz)
    playPostSuccessBeep() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, t); // C6 亮音

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.setValueAtTime(0.3, t + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
    }

    // 错误警报：蜂鸣器长鸣报警
    playAlarmBeep() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const playBeepAt = (time, duration, freq) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.setValueAtTime(0.2, time + duration - 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(time);
            osc.stop(time + duration);
        };

        // 1 长 2 短 经典显卡/内存故障音
        playBeepAt(t, 0.35, 880);
        playBeepAt(t + 0.45, 0.15, 880);
        playBeepAt(t + 0.70, 0.15, 880);
    }

    // 启动风扇运转白噪音与电机嗡鸣
    startFanSound() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        if (this.fanGain) {
            this.fanGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            return;
        }

        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);
        filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

        const motorOsc = this.ctx.createOscillator();
        motorOsc.type = 'sawtooth';
        motorOsc.frequency.setValueAtTime(65, this.ctx.currentTime); // 电机转速嗡鸣

        const motorGain = this.ctx.createGain();
        motorGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

        this.fanGain = this.ctx.createGain();
        this.fanGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        this.fanGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.2);

        whiteNoise.connect(filter);
        filter.connect(this.fanGain);
        motorOsc.connect(motorGain);
        motorGain.connect(this.fanGain);
        this.fanGain.connect(this.ctx.destination);

        whiteNoise.start();
        motorOsc.start();
        this.fanNode = { whiteNoise, motorOsc };
    }

    stopFanSound() {
        if (!this.fanGain || !this.ctx) return;
        this.fanGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
            if (this.fanNode) {
                try {
                    this.fanNode.whiteNoise.stop();
                    this.fanNode.motorOsc.stop();
                } catch(e) {}
                this.fanNode = null;
                this.fanGain = null;
            }
        }, 900);
    }

    // 闯关成功清脆悦耳和弦音
    playSuccessChord() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const t = this.ctx.currentTime + idx * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.18, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.65);
        });
    }

    // 错误沉闷提示音
    playErrorBuzz() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.linearRampToValueAtTime(110, t + 0.18);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
    }
}

window.soundEngine = new SoundEngine();
