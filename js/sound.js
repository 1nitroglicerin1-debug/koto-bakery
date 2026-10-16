/* ===========================================================================
   sound.js — звуковые эффекты (SoundFX), процедурный Web Audio API синтез
   и фоновая Lo-Fi музыка (65 BPM). Извлечено 1-в-1 из index.html (Фаза 1).
   ФАЗА 2: исправлен баг структуры объекта (suspendAudio/resumeAudio были
   ошибочно вложены в init() — теперь корректные методы SoundFX).
   Экспорт: window.SoundFX и window.KotoApp.SoundFX
   =========================================================================== */
    const SoundFX = {
      ctx: null,
      musicMasterGain: null,
      musicFilter: null,
      musicTimer: null,
      purrOsc: null,
      purrMod: null,
      purrNoise: null,
      isMusicPlaying: false,
      musicStep: 0,
      tempoBpm: 65,
      init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioContextClass();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      },
      suspendAudio() {
        if (this.ctx && this.ctx.state === 'running') {
          this.ctx.suspend().catch(() => {});
        }
      },
      resumeAudio() {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      },
      playClick(isMuted) {
        if (isMuted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const t = this.ctx.currentTime;
          osc.frequency.setValueAtTime(320, t);
          osc.frequency.exponentialRampToValueAtTime(140, t + 0.06);
          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.07);
        } catch (e) {}
      },
      playBuy(isMuted) {
        if (isMuted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          [587.33, 880].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + idx * 0.06);
            gain.gain.setValueAtTime(0.2, t + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + idx * 0.06);
            osc.stop(t + idx * 0.06 + 0.13);
          });
        } catch (e) {}
      },
      playFever(isMuted) {
        if (isMuted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          [440, 554.37, 659.25, 880].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.07);
            gain.gain.setValueAtTime(0.25, t + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.18);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + idx * 0.07);
            osc.stop(t + idx * 0.07 + 0.19);
          });
        } catch (e) {}
      },
      startPurr() {
        if (!this.ctx || this.purrOsc) return;
        try {
          const t = this.ctx.currentTime;

          // Низкочастотный вибрирующий тон котика 28 Гц
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(28, t);

          // Амплитудная модуляция 18 Гц (вибрация горлышка)
          const mod = this.ctx.createOscillator();
          mod.type = 'sine';
          mod.frequency.setValueAtTime(18, t);

          const modGain = this.ctx.createGain();
          modGain.gain.setValueAtTime(0.5, t);
          mod.connect(modGain.gain);

          const purrGain = this.ctx.createGain();
          purrGain.gain.setValueAtTime(0.035, t);

          osc.connect(modGain);
          modGain.connect(purrGain);
          purrGain.connect(this.musicMasterGain);

          osc.start(t);
          mod.start(t);

          // Мягкий бархатный белый шум на фоне
          const bufferSize = this.ctx.sampleRate * 2;
          const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }

          const whiteNoise = this.ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          const noiseFilter = this.ctx.createBiquadFilter();
          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.setValueAtTime(90, t);
          noiseFilter.Q.setValueAtTime(2.5, t);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.015, t);

          whiteNoise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(this.musicMasterGain);
          whiteNoise.start(t);

          this.purrOsc = osc;
          this.purrMod = mod;
          this.purrNoise = whiteNoise;
        } catch (e) {}
      },
      stopPurr() {
        try {
          if (this.purrOsc) { this.purrOsc.stop(); this.purrOsc.disconnect(); this.purrOsc = null; }
          if (this.purrMod) { this.purrMod.stop(); this.purrMod.disconnect(); this.purrMod = null; }
          if (this.purrNoise) { this.purrNoise.stop(); this.purrNoise.disconnect(); this.purrNoise = null; }
        } catch (e) {}
      },
      playLoFiChord(freqs, duration) {
        if (!this.ctx || !this.isMusicPlaying) return;
        try {
          const t = this.ctx.currentTime;
          freqs.forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            // Мягкая Lo-Fi атака и плавный спад
            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.linearRampToValueAtTime(0.045, t + 0.35);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

            osc.connect(gain);
            gain.connect(this.musicFilter);
            osc.start(t);
            osc.stop(t + duration + 0.1);
          });
        } catch (e) {}
      },
      scheduleMusicTick() {
        if (!this.isMusicPlaying) return;

        // Тёплая Lo-Fi гармония 65 BPM (аккорды: Cmaj7 -> Am7 -> Dm7 -> G7sus)
        const chords = [
          [130.81, 196.00, 246.94, 293.66], // Cmaj9 (C3, G3, B3, D4)
          [110.00, 164.81, 220.00, 261.63], // Am7 (A2, E3, A3, C4)
          [146.83, 220.00, 261.63, 329.63], // Dm9 (D3, A3, C4, E4)
          [98.00, 146.83, 220.00, 293.66]   // G9sus (G2, D3, A3, D4)
        ];

        const currentChord = chords[this.musicStep % chords.length];
        this.playLoFiChord(currentChord, 3.4);
        this.musicStep++;

        this.musicTimer = setTimeout(() => {
          this.scheduleMusicTick();
        }, Math.round(60000 / Math.max(30, this.tempoBpm || 65) / 4)); // 4 удара на такт, темп зависит от tempoBpm
      },
      startMusic(isMuted) {
        if (isMuted) return;
        this.init();
        if (!this.ctx) return;
        if (this.isMusicPlaying) return;

        try {
          this.isMusicPlaying = true;

          // Мастер-громкость фоновой музыки с фильтром низких частот
          if (!this.musicMasterGain) {
            this.musicMasterGain = this.ctx.createGain();
            this.musicFilter = this.ctx.createBiquadFilter();
            this.musicFilter.type = 'lowpass';
            this.musicFilter.frequency.setValueAtTime(520, this.ctx.currentTime); // Lo-Fi теплота

            this.musicFilter.connect(this.musicMasterGain);
            this.musicMasterGain.connect(this.ctx.destination);
          }

          const t = this.ctx.currentTime;
          this.musicMasterGain.gain.cancelScheduledValues(t);
          this.musicMasterGain.gain.setValueAtTime(0.0001, t);
          this.musicMasterGain.gain.linearRampToValueAtTime(0.14, t + 1.2); // Мягкий fade-in

          this.startPurr();
          this.scheduleMusicTick();
        } catch (e) {}
      },
      stopMusic() {
        if (!this.isMusicPlaying) return;
        try {
          this.isMusicPlaying = false;
          if (this.musicTimer) {
            clearTimeout(this.musicTimer);
            this.musicTimer = null;
          }
          if (this.ctx && this.musicMasterGain) {
            const t = this.ctx.currentTime;
            this.musicMasterGain.gain.cancelScheduledValues(t);
            this.musicMasterGain.gain.setValueAtTime(this.musicMasterGain.gain.value, t);
            this.musicMasterGain.gain.linearRampToValueAtTime(0.0001, t + 0.6); // Плавный fade-out
            setTimeout(() => {
              this.stopPurr();
            }, 600);
          } else {
            this.stopPurr();
          }
        } catch (e) {}
      },
    
      setTempo(bpm) {
        this.tempoBpm = Math.max(30, Math.min(200, bpm));
      },
      resetTempo() {
        this.tempoBpm = 65;
      }
};
/* === Экспорт === */
window.SoundFX = SoundFX;
window.KotoApp = window.KotoApp || {};
window.KotoApp.SoundFX = SoundFX;