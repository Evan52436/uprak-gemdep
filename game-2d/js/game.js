/**
 * game.js - Core 2D Platformer Game Engine
 * Petualangan Mengumpulkan Koin - SMK Plus Pelita Nusantara
 */

class Game2D {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = 960;
    this.height = 540;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER, WIN
    this.currentLevelIndex = 0;
    this.score = 0;
    this.coinsCollected = 0;
    this.totalCoinsInLevel = 0;

    this.cameraX = 0;
    this.cameraY = 0;

    this.keys = {
      left: false,
      right: false,
      jump: false
    };

    this.particles = [];
    this.floatingTexts = [];

    this.initPlayer();
    this.initEvents();
    this.initUI();
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  initPlayer() {
    this.player = {
      x: 80,
      y: 380,
      w: 30,
      h: 42,
      vx: 0,
      vy: 0,
      speed: 4.2,
      jumpForce: -11.5,
      gravity: 0.52,
      grounded: false,
      coyoteTime: 0,
      facing: 1, // 1: right, -1: left
      lives: 3,
      maxLives: 3,
      invulnerableTimer: 0,
      animFrame: 0,
      animTimer: 0,
      state: 'idle' // idle, run, jump, hurt
    };
  }

  loadLevel(index) {
    this.currentLevelIndex = index;
    const data = GAME_LEVELS[this.currentLevelIndex];
    this.level = JSON.parse(JSON.stringify(data)); // Deep copy level data

    this.totalCoinsInLevel = this.level.coins.length;
    this.coinsCollected = 0;

    // Reset player position and status
    this.player.x = this.level.playerStart.x;
    this.player.y = this.level.playerStart.y;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.grounded = false;
    this.player.invulnerableTimer = 0;

    this.cameraX = 0;
    this.particles = [];
    this.floatingTexts = [];

    // Update level display in HUD
    const lvlEl = document.getElementById('levelIndicator');
    if (lvlEl) lvlEl.textContent = this.level.name;
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = true;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        this.keys.jump = true;
      }
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        this.togglePause();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = false;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        this.keys.jump = false;
      }
    });

    // Touch controls
    const bindTouch = (id, keyName) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.keys[keyName] = true;
      });
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.keys[keyName] = false;
      });
    };

    bindTouch('btnTouchLeft', 'left');
    bindTouch('btnTouchRight', 'right');
    bindTouch('btnTouchJump', 'jump');
  }

  initUI() {
    // Menu buttons
    const btnStart = document.getElementById('btnStart');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        window.soundSystem.init();
        window.soundSystem.startBgm();
        this.score = 0;
        this.player.lives = 3;
        this.loadLevel(0);
        this.setScreenState('PLAYING');
      });
    }

    const btnHowToPlay = document.getElementById('btnHowToPlay');
    const modalHowToPlay = document.getElementById('modalHowToPlay');
    const btnCloseHowToPlay = document.getElementById('btnCloseHowToPlay');
    if (btnHowToPlay && modalHowToPlay && btnCloseHowToPlay) {
      btnHowToPlay.addEventListener('click', () => {
        modalHowToPlay.classList.remove('hidden');
      });
      btnCloseHowToPlay.addEventListener('click', () => {
        modalHowToPlay.classList.add('hidden');
      });
    }

    // Audio toggle
    const btnToggleSound = document.getElementById('btnToggleSound');
    if (btnToggleSound) {
      btnToggleSound.addEventListener('click', () => {
        const muted = window.soundSystem.toggleMute();
        btnToggleSound.textContent = muted ? '🔇 Suara: Mati' : '🔊 Suara: Nyala';
      });
    }

    // Pause Resume
    const btnResume = document.getElementById('btnResume');
    if (btnResume) {
      btnResume.addEventListener('click', () => {
        this.togglePause();
      });
    }

    // Restart buttons
    const bindRestart = (id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          this.player.lives = 3;
          this.loadLevel(this.currentLevelIndex);
          this.setScreenState('PLAYING');
          window.soundSystem.startBgm();
        });
      }
    };
    bindRestart('btnRestartGameOver');
    bindRestart('btnRestartWin');
    bindRestart('btnRestartPause');

    // Menu Return buttons
    const bindReturnMenu = (id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          window.soundSystem.stopBgm();
          this.setScreenState('MENU');
        });
      }
    };
    bindReturnMenu('btnMenuGameOver');
    bindReturnMenu('btnMenuWin');
    bindReturnMenu('btnMenuPause');

    // Next Level button
    const btnNextLevel = document.getElementById('btnNextLevel');
    if (btnNextLevel) {
      btnNextLevel.addEventListener('click', () => {
        if (this.currentLevelIndex + 1 < GAME_LEVELS.length) {
          this.loadLevel(this.currentLevelIndex + 1);
          this.setScreenState('PLAYING');
          window.soundSystem.startBgm();
        } else {
          // Reached final level victory
          this.setScreenState('MENU');
        }
      });
    }
  }

  setScreenState(newState) {
    this.state = newState;
    const screens = {
      MENU: document.getElementById('screenMenu'),
      PLAYING: null,
      PAUSED: document.getElementById('screenPause'),
      GAMEOVER: document.getElementById('screenGameOver'),
      WIN: document.getElementById('screenWin')
    };

    Object.entries(screens).forEach(([key, el]) => {
      if (el) {
        if (key === newState) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    if (newState === 'GAMEOVER') {
      window.soundSystem.stopBgm();
      window.soundSystem.playGameOver();
      const scoreEl = document.getElementById('finalScoreGameOver');
      if (scoreEl) scoreEl.textContent = this.score;
    } else if (newState === 'WIN') {
      window.soundSystem.stopBgm();
      window.soundSystem.playWin();
      const scoreEl = document.getElementById('finalScoreWin');
      if (scoreEl) scoreEl.textContent = this.score;
      const coinEl = document.getElementById('coinsCollectedWin');
      if (coinEl) coinEl.textContent = `${this.coinsCollected} / ${this.totalCoinsInLevel}`;

      const btnNext = document.getElementById('btnNextLevel');
      if (btnNext) {
        if (this.currentLevelIndex + 1 < GAME_LEVELS.length) {
          btnNext.textContent = 'Lanjut ke Level 2 ➔';
          btnNext.style.display = 'block';
        } else {
          btnNext.textContent = 'Petualangan Selesai (Kembali)';
          btnNext.style.display = 'block';
        }
      }
    }
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.setScreenState('PAUSED');
      window.soundSystem.stopBgm();
    } else if (this.state === 'PAUSED') {
      this.setScreenState('PLAYING');
      window.soundSystem.startBgm();
    }
  }

  addScore(points, x, y) {
    this.score += points;
    this.floatingTexts.push({
      text: `+${points}`,
      x: x,
      y: y,
      vy: -1.5,
      alpha: 1.0,
      color: '#fbbf24'
    });
  }

  addParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02,
        color: color,
        size: Math.random() * 3 + 2
      });
    }
  }

  takeDamage(sourceX) {
    if (this.player.invulnerableTimer > 0) return;

    this.player.lives -= 1;
    this.player.invulnerableTimer = 90; // ~1.5s at 60fps
    window.soundSystem.playHurt();

    // Knockback
    const dir = this.player.x < sourceX ? -1 : 1;
    this.player.vx = dir * 4.5;
    this.player.vy = -6;

    this.addParticles(this.player.x + 15, this.player.y + 20, '#ef4444', 12);

    if (this.player.lives <= 0) {
      this.setScreenState('GAMEOVER');
    }
  }

  update() {
    if (this.state !== 'PLAYING') return;

    const p = this.player;

    // Horizontal Movement
    if (this.keys.left) {
      p.vx = -p.speed;
      p.facing = -1;
      p.state = 'run';
    } else if (this.keys.right) {
      p.vx = p.speed;
      p.facing = 1;
      p.state = 'run';
    } else {
      p.vx *= 0.78; // friction
      if (Math.abs(p.vx) < 0.1) p.vx = 0;
      p.state = 'idle';
    }

    // Animation stepping
    p.animTimer++;
    if (p.animTimer % 8 === 0) {
      p.animFrame = (p.animFrame + 1) % 4;
    }

    // Jumping & Coyote Time
    if (p.grounded) {
      p.coyoteTime = 6;
    } else {
      if (p.coyoteTime > 0) p.coyoteTime--;
    }

    if (this.keys.jump && (p.grounded || p.coyoteTime > 0)) {
      p.vy = p.jumpForce;
      p.grounded = false;
      p.coyoteTime = 0;
      window.soundSystem.playJump();
      this.addParticles(p.x + 15, p.y + p.h, '#e2e8f0', 4);
    }

    if (!p.grounded) {
      p.state = 'jump';
    }

    // Apply gravity
    p.vy += p.gravity;
    if (p.vy > 12) p.vy = 12; // Terminal velocity

    // Update Invulnerability timer
    if (p.invulnerableTimer > 0) {
      p.invulnerableTimer--;
      p.state = 'hurt';
    }

    // Update moving platforms
    this.level.movingPlatforms.forEach(mp => {
      if (mp.axis === 'x') {
        mp.x += mp.speed * mp.dir;
        if (mp.x > mp.maxX) { mp.x = mp.maxX; mp.dir = -1; }
        if (mp.x < mp.minX) { mp.x = mp.minX; mp.dir = 1; }
      } else {
        mp.y += mp.speed * mp.dir;
        if (mp.y > mp.maxY) { mp.y = mp.maxY; mp.dir = -1; }
        if (mp.y < mp.minY) { mp.y = mp.minY; mp.dir = 1; }
      }
    });

    // Horizontal Movement & Collision
    p.x += p.vx;
    this.checkHorizontalCollisions();

    // Vertical Movement & Collision
    p.grounded = false;
    p.y += p.vy;
    this.checkVerticalCollisions();

    // Pit Fall Check
    if (p.y > this.level.height + 60) {
      this.takeDamage(p.x);
      p.x = Math.max(80, p.x - 180);
      p.y = 300;
      p.vy = 0;
    }

    // Enemies update & interaction
    this.updateEnemies();

    // Collect Coins
    this.updateCoins();

    // Hazards (Spikes)
    this.updateSpikes();

    // Interactables (Chest, Heart, Goal)
    this.updateInteractables();

    // Camera follow player
    const targetCamX = p.x - this.width * 0.4;
    this.cameraX += (targetCamX - this.cameraX) * 0.1;
    this.cameraX = Math.max(0, Math.min(this.cameraX, this.level.width - this.width));

    // Particles update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= pt.decay;
      if (pt.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Floating text update
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.025;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  checkHorizontalCollisions() {
    const p = this.player;
    const allPlatforms = [...this.level.platforms, ...this.level.movingPlatforms];

    for (const plat of allPlatforms) {
      if (
        p.x < plat.x + plat.w &&
        p.x + p.w > plat.x &&
        p.y < plat.y + plat.h &&
        p.y + p.h > plat.y + 4 // small foot tolerance
      ) {
        if (p.vx > 0) {
          p.x = plat.x - p.w;
          p.vx = 0;
        } else if (p.vx < 0) {
          p.x = plat.x + plat.w;
          p.vx = 0;
        }
      }
    }
  }

  checkVerticalCollisions() {
    const p = this.player;
    const allPlatforms = [...this.level.platforms, ...this.level.movingPlatforms];

    for (const plat of allPlatforms) {
      if (
        p.x + p.w > plat.x + 4 &&
        p.x < plat.x + plat.w - 4 &&
        p.y + p.h >= plat.y &&
        p.y + p.h <= plat.y + 16 &&
        p.vy >= 0
      ) {
        p.y = plat.y - p.h;
        p.vy = 0;
        p.grounded = true;

        // If standing on moving platform, match its motion
        if (plat.speed) {
          if (plat.axis === 'x') {
            p.x += plat.speed * plat.dir;
          } else {
            p.y += plat.speed * plat.dir;
          }
        }
      } else if (
        p.x + p.w > plat.x + 4 &&
        p.x < plat.x + plat.w - 4 &&
        p.y <= plat.y + plat.h &&
        p.y >= plat.y + plat.h - 10 &&
        p.vy < 0
      ) {
        // Hitting platform from below
        p.y = plat.y + plat.h;
        p.vy = 0;
      }
    }
  }

  updateEnemies() {
    const p = this.player;
    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const en = this.level.enemies[i];

      if (en.type === 'slime') {
        en.x += en.speed * en.dir;
        if (en.x > en.maxX) { en.x = en.maxX; en.dir = -1; }
        if (en.x < en.minX) { en.x = en.minX; en.dir = 1; }
      } else if (en.type === 'bat') {
        en.x += en.speed * en.dir;
        if (en.x > en.maxX) { en.x = en.maxX; en.dir = -1; }
        if (en.x < en.minX) { en.x = en.minX; en.dir = 1; }
        en.y = en.baseY + Math.sin(Date.now() * 0.005 + en.x * 0.01) * 24;
      }

      // Check collision with player
      const enBox = { x: en.x, y: en.y, w: 32, h: 26 };
      if (
        p.x < enBox.x + enBox.w &&
        p.x + p.w > enBox.x &&
        p.y < enBox.y + enBox.h &&
        p.y + p.h > enBox.y
      ) {
        // Stomp condition: player is falling and player's feet are near enemy top
        if (p.vy > 0 && p.y + p.h - enBox.y < 18) {
          // Stomped enemy!
          window.soundSystem.playStomp();
          this.addScore(200, en.x, en.y);
          this.addParticles(en.x + 16, en.y + 12, '#10b981', 14);
          p.vy = p.jumpForce * 0.65; // Bounce up
          this.level.enemies.splice(i, 1);
        } else {
          // Player hurt
          this.takeDamage(en.x + 16);
        }
      }
    }
  }

  updateCoins() {
    const p = this.player;
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      const coin = this.level.coins[i];
      const dist = Math.hypot((p.x + p.w / 2) - (coin.x + 12), (p.y + p.h / 2) - (coin.y + 12));
      if (dist < 26) {
        window.soundSystem.playCoin();
        this.coinsCollected++;
        this.addScore(100, coin.x, coin.y);
        this.addParticles(coin.x + 12, coin.y + 12, '#fbbf24', 10);
        this.level.coins.splice(i, 1);
      }
    }
  }

  updateSpikes() {
    const p = this.player;
    this.level.spikes.forEach(spk => {
      if (
        p.x + p.w > spk.x + 4 &&
        p.x < spk.x + 28 &&
        p.y + p.h > spk.y + 6 &&
        p.y < spk.y + 24
      ) {
        this.takeDamage(spk.x + 16);
      }
    });
  }

  updateInteractables() {
    const p = this.player;
    this.level.interactables.forEach(item => {
      if (item.type === 'heart' && !item.collected) {
        const dist = Math.hypot((p.x + p.w / 2) - (item.x + 12), (p.y + p.h / 2) - (item.y + 12));
        if (dist < 26) {
          item.collected = true;
          if (p.lives < p.maxLives) p.lives++;
          window.soundSystem.playPowerup();
          this.addScore(50, item.x, item.y);
          this.addParticles(item.x + 12, item.y + 12, '#ef4444', 12);
        }
      } else if (item.type === 'chest' && !item.opened) {
        if (
          p.x + p.w > item.x &&
          p.x < item.x + 32 &&
          p.y + p.h > item.y &&
          p.y < item.y + 26
        ) {
          item.opened = true;
          window.soundSystem.playPowerup();
          this.addScore(300, item.x, item.y);
          this.addParticles(item.x + 16, item.y + 10, '#fef08a', 20);

          // Spawns 3 bonus coins into level
          for (let k = 0; k < 3; k++) {
            this.level.coins.push({
              x: item.x - 30 + k * 30,
              y: item.y - 45
            });
          }
          this.totalCoinsInLevel += 3;
        }
      } else if (item.type === 'goal') {
        const dist = Math.hypot((p.x + p.w / 2) - (item.x + 16), (p.y + p.h / 2) - (item.y + 24));
        if (dist < 36) {
          this.setScreenState('WIN');
        }
      }
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Parallax Background
    this.renderBackground();

    // 2. Camera transform
    this.ctx.save();
    this.ctx.translate(-Math.floor(this.cameraX), 0);

    // 3. Render Level Geometry (Platforms)
    this.renderPlatforms();

    // 4. Render Spikes
    this.level.spikes.forEach(spk => {
      this.ctx.drawImage(window.spriteManager.sprites.spikes, spk.x, spk.y);
    });

    // 5. Render Interactables
    this.level.interactables.forEach(item => {
      if (item.type === 'heart' && !item.collected) {
        const floatY = item.y + Math.sin(Date.now() * 0.006) * 4;
        this.ctx.drawImage(window.spriteManager.sprites.heart, item.x, floatY);
      } else if (item.type === 'chest') {
        const sprite = item.opened ? window.spriteManager.sprites.chestOpen : window.spriteManager.sprites.chestClosed;
        this.ctx.drawImage(sprite, item.x, item.y);
      } else if (item.type === 'goal') {
        if (item.kind === 'flag') {
          this.ctx.drawImage(window.spriteManager.sprites.flag, item.x, item.y);
        } else {
          this.ctx.drawImage(window.spriteManager.sprites.portal, item.x, item.y);
        }
      }
    });

    // 6. Render Coins
    const coinFrame = Math.floor((Date.now() / 120) % 6);
    this.level.coins.forEach(c => {
      this.ctx.drawImage(window.spriteManager.sprites.coinFrames[coinFrame], c.x, c.y);
    });

    // 7. Render Enemies
    this.level.enemies.forEach(en => {
      if (en.type === 'slime') {
        const frame = Math.floor((Date.now() / 200) % 2);
        const sprite = frame === 0 ? window.spriteManager.sprites.slime1 : window.spriteManager.sprites.slime2;
        this.ctx.drawImage(sprite, en.x, en.y);
      } else if (en.type === 'bat') {
        const frame = Math.floor((Date.now() / 150) % 2);
        const sprite = frame === 0 ? window.spriteManager.sprites.bat1 : window.spriteManager.sprites.bat2;
        this.ctx.drawImage(sprite, en.x, en.y);
      }
    });

    // 8. Render Player
    this.renderPlayer();

    // 9. Render Particles
    this.particles.forEach(pt => {
      this.ctx.fillStyle = pt.color;
      this.ctx.globalAlpha = Math.max(0, pt.life);
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1.0;

    // 10. Render Floating Scores
    this.floatingTexts.forEach(ft => {
      this.ctx.fillStyle = ft.color;
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.font = 'bold 16px monospace';
      this.ctx.fillText(ft.text, ft.x, ft.y);
    });
    this.ctx.globalAlpha = 1.0;

    this.ctx.restore();

    // 11. Render HUD directly on screen
    if (this.state === 'PLAYING' || this.state === 'PAUSED') {
      this.renderHUD();
    }
  }

  renderBackground() {
    const isCave = this.level.theme === 'cave';

    // Sky gradient
    const sky = this.ctx.createLinearGradient(0, 0, 0, this.height);
    if (!isCave) {
      sky.addColorStop(0, '#0284c7');
      sky.addColorStop(0.6, '#38bdf8');
      sky.addColorStop(1, '#bae6fd');
    } else {
      sky.addColorStop(0, '#0f172a');
      sky.addColorStop(0.7, '#1e1b4b');
      sky.addColorStop(1, '#312e81');
    }
    this.ctx.fillStyle = sky;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Layer 1: Distant mountains / cave stalagmites (0.1x speed)
    this.ctx.fillStyle = isCave ? '#1e1e38' : '#0369a1';
    for (let i = 0; i < 8; i++) {
      const bx = (i * 320) - (this.cameraX * 0.1) % 320;
      this.ctx.beginPath();
      this.ctx.moveTo(bx, this.height);
      this.ctx.lineTo(bx + 160, this.height - 180);
      this.ctx.lineTo(bx + 320, this.height);
      this.ctx.fill();
    }

    // Layer 2: Midground hills/trees (0.3x speed)
    this.ctx.fillStyle = isCave ? '#2e1065' : '#047857';
    for (let i = 0; i < 10; i++) {
      const bx = (i * 220) - (this.cameraX * 0.3) % 220;
      this.ctx.beginPath();
      this.ctx.arc(bx + 110, this.height - 40, 110, Math.PI, 0);
      this.ctx.fill();
    }
  }

  renderPlatforms() {
    const isCave = this.level.theme === 'cave';
    const topColor = isCave ? '#7c3aed' : '#22c55e';
    const bodyColor = isCave ? '#3b0764' : '#78350f';

    // Static platforms
    this.level.platforms.forEach(p => {
      // Body
      this.ctx.fillStyle = bodyColor;
      this.ctx.fillRect(p.x, p.y + 6, p.w, p.h - 6);
      // Top layer
      this.ctx.fillStyle = topColor;
      this.ctx.fillRect(p.x, p.y, p.w, 8);
      // Subtle grass fringe/crystal detail
      this.ctx.fillStyle = isCave ? '#c084fc' : '#86efac';
      for (let x = p.x; x < p.x + p.w; x += 12) {
        this.ctx.fillRect(x + 2, p.y + 8, 4, 3);
      }
    });

    // Moving platforms
    this.level.movingPlatforms.forEach(mp => {
      this.ctx.fillStyle = '#475569';
      this.ctx.fillRect(mp.x, mp.y, mp.w, mp.h);
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.fillRect(mp.x, mp.y, mp.w, 4);
      // Decorative mechanical bolts
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.fillRect(mp.x + 8, mp.y + 8, 4, 4);
      this.ctx.fillRect(mp.x + mp.w - 12, mp.y + 8, 4, 4);
    });
  }

  renderPlayer() {
    const p = this.player;

    // Blinking effect when taking damage
    if (p.invulnerableTimer > 0 && Math.floor(p.invulnerableTimer / 4) % 2 === 0) {
      return;
    }

    let sprite = window.spriteManager.sprites.playerIdle;
    if (p.state === 'run') {
      sprite = p.animFrame % 2 === 0 ? window.spriteManager.sprites.playerRun1 : window.spriteManager.sprites.playerRun2;
    } else if (p.state === 'jump') {
      sprite = window.spriteManager.sprites.playerJump;
    } else if (p.state === 'hurt') {
      sprite = window.spriteManager.sprites.playerHurt;
    }

    this.ctx.save();
    this.ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
    if (p.facing === -1) {
      this.ctx.scale(-1, 1);
    }
    this.ctx.drawImage(sprite, -18, -22);
    this.ctx.restore();
  }

  renderHUD() {
    this.ctx.save();
    // Dark top bar
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    this.ctx.fillRect(16, 12, this.width - 32, 44);
    this.ctx.strokeStyle = '#334155';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(16, 12, this.width - 32, 44);

    // 1. Health / Hearts
    for (let i = 0; i < this.player.maxLives; i++) {
      const hx = 32 + i * 28;
      if (i < this.player.lives) {
        this.ctx.drawImage(window.spriteManager.sprites.heart, hx, 22, 22, 22);
      } else {
        // Empty heart outline
        this.ctx.fillStyle = '#475569';
        this.ctx.beginPath();
        this.ctx.arc(hx + 11, 33, 9, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // 2. Score
    this.ctx.fillStyle = '#f1f5f9';
    this.ctx.font = 'bold 16px monospace';
    this.ctx.fillText(`SKOR: ${this.score}`, 140, 39);

    // 3. Coins collected
    const coinFrame = Math.floor((Date.now() / 150) % 6);
    this.ctx.drawImage(window.spriteManager.sprites.coinFrames[coinFrame], 280, 23, 22, 22);
    this.ctx.fillText(`x ${this.coinsCollected} / ${this.totalCoinsInLevel}`, 308, 39);

    // 4. Level info
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.font = 'bold 15px -apple-system, sans-serif';
    this.ctx.fillText(this.level.name, 480, 39);

    // 5. Controls reminder
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '13px monospace';
    this.ctx.fillText('A/D: Gerak | SPASI: Lompat | P: Jeda', 720, 39);

    this.ctx.restore();
  }

  loop(timestamp) {
    this.update();
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game2d = new Game2D();
});
