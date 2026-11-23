/**
 * game.js - Core 3D Adventure Game Engine with Three.js
 * Petualangan Dunia 3D - SMK Plus Pelita Nusantara
 */

class Game3D {
  constructor() {
    this.container = document.querySelector('.game-viewport');
    this.canvas = document.getElementById('threeCanvas');

    this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER, WIN
    this.currentLevelIndex = 1;
    this.score = 0;
    this.crystalsCollected = 0;
    this.totalCrystals = 0;

    // Camera parameters
    this.cameraAngle = 0;
    this.cameraPitch = 0.35;
    this.isDraggingMouse = false;
    this.previousMouseX = 0;
    this.previousMouseY = 0;

    // Movement inputs
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false
    };

    this.initThree();
    this.initPlayer();
    this.initEvents();
    this.initUI();

    this.levelBuilder = new LevelBuilder3D(this.scene);
    this.loadLevel(1);

    window.addEventListener('resize', this.onResize.bind(this));
    this.onResize();

    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0284c7);
    this.scene.fog = new THREE.FogExp2(0x38bdf8, 0.015);

    // Renderer with soft shadow maps
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Camera
    this.camera = new THREE.PerspectiveCamera(55, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 300);

    // Lighting
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.65);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfffbeb, 0.9);
    this.dirLight.position.set(25, 40, 20);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 120;
    const d = 40;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);
  }

  initPlayer() {
    this.player = new Player3D(this.scene);
  }

  loadLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    const info = this.levelBuilder.buildLevel(levelIndex);
    this.totalCrystals = info.totalCrystals;
    this.crystalsCollected = 0;

    this.scene.background = new THREE.Color(info.skyColor);
    this.scene.fog.color = new THREE.Color(info.fogColor);

    this.player.reset(info.playerSpawn.x, info.playerSpawn.y, info.playerSpawn.z);
    this.cameraAngle = 0;

    // Update HUD
    const lvlEl = document.getElementById('hudLevel');
    if (lvlEl) lvlEl.textContent = info.name;
    this.updateHUD();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') this.keys.forward = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') this.keys.backward = true;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') this.keys.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') this.keys.right = true;
      if (e.key === ' ') this.keys.jump = true;
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') this.togglePause();
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') this.keys.forward = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') this.keys.backward = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') this.keys.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') this.keys.right = false;
      if (e.key === ' ') this.keys.jump = false;
    });

    // Mouse Drag Camera Orbit
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDraggingMouse = true;
      this.previousMouseX = e.clientX;
      this.previousMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDraggingMouse = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDraggingMouse) return;
      const deltaX = e.clientX - this.previousMouseX;
      const deltaY = e.clientY - this.previousMouseY;
      this.previousMouseX = e.clientX;
      this.previousMouseY = e.clientY;

      this.cameraAngle -= deltaX * 0.006;
      this.cameraPitch = Math.max(0.1, Math.min(0.85, this.cameraPitch + deltaY * 0.004));
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

    bindTouch('btnDpadUp', 'forward');
    bindTouch('btnDpadDown', 'backward');
    bindTouch('btnDpadLeft', 'left');
    bindTouch('btnDpadRight', 'right');
    bindTouch('btnTouchActionJump', 'jump');
  }

  initUI() {
    const btnStart = document.getElementById('btnStart3D');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        window.soundSystem3D.init();
        window.soundSystem3D.startBgm();
        this.score = 0;
        this.player.health = 100;
        this.loadLevel(1);
        this.setScreenState('PLAYING');
      });
    }

    const btnHowToPlay = document.getElementById('btnHowToPlay3D');
    const modalHowToPlay = document.getElementById('modalHowToPlay3D');
    const btnCloseHowToPlay = document.getElementById('btnCloseHowToPlay3D');
    if (btnHowToPlay && modalHowToPlay && btnCloseHowToPlay) {
      btnHowToPlay.addEventListener('click', () => {
        modalHowToPlay.classList.remove('hidden');
      });
      btnCloseHowToPlay.addEventListener('click', () => {
        modalHowToPlay.classList.add('hidden');
      });
    }

    const btnToggleSound = document.getElementById('btnToggleSound3D');
    if (btnToggleSound) {
      btnToggleSound.addEventListener('click', () => {
        const muted = window.soundSystem3D.toggleMute();
        btnToggleSound.textContent = muted ? '🔇 Suara: Mati' : '🔊 Suara: Nyala';
      });
    }

    const btnResume = document.getElementById('btnResume3D');
    if (btnResume) {
      btnResume.addEventListener('click', () => this.togglePause());
    }

    const bindRestart = (id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          this.player.health = 100;
          this.loadLevel(this.currentLevelIndex);
          this.setScreenState('PLAYING');
          window.soundSystem3D.startBgm();
        });
      }
    };
    bindRestart('btnRestartGameOver3D');
    bindRestart('btnRestartWin3D');
    bindRestart('btnRestartPause3D');

    const bindReturnMenu = (id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          window.soundSystem3D.stopBgm();
          this.setScreenState('MENU');
        });
      }
    };
    bindReturnMenu('btnMenuGameOver3D');
    bindReturnMenu('btnMenuWin3D');
    bindReturnMenu('btnMenuPause3D');

    const btnNext = document.getElementById('btnNextLevel3D');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.currentLevelIndex === 1) {
          this.loadLevel(2);
          this.setScreenState('PLAYING');
          window.soundSystem3D.startBgm();
        } else {
          this.setScreenState('MENU');
        }
      });
    }
  }

  setScreenState(newState) {
    this.state = newState;
    const screens = {
      MENU: document.getElementById('screenMenu3D'),
      PLAYING: null,
      PAUSED: document.getElementById('screenPause3D'),
      GAMEOVER: document.getElementById('screenGameOver3D'),
      WIN: document.getElementById('screenWin3D')
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
      window.soundSystem3D.stopBgm();
      window.soundSystem3D.playGameOver();
      const scoreEl = document.getElementById('finalScoreGameOver3D');
      if (scoreEl) scoreEl.textContent = this.score;
    } else if (newState === 'WIN') {
      window.soundSystem3D.stopBgm();
      window.soundSystem3D.playWin();
      const scoreEl = document.getElementById('finalScoreWin3D');
      if (scoreEl) scoreEl.textContent = this.score;
      const crystalEl = document.getElementById('crystalsWin3D');
      if (crystalEl) crystalEl.textContent = `${this.crystalsCollected} / ${this.totalCrystals}`;

      const btnNext = document.getElementById('btnNextLevel3D');
      if (btnNext) {
        if (this.currentLevelIndex === 1) {
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
      window.soundSystem3D.stopBgm();
    } else if (this.state === 'PAUSED') {
      this.setScreenState('PLAYING');
      window.soundSystem3D.startBgm();
    }
  }

  updateHUD() {
    const healthFill = document.getElementById('healthFill');
    if (healthFill) {
      healthFill.style.width = `${Math.max(0, this.player.health)}%`;
      if (this.player.health <= 30) {
        healthFill.classList.add('low');
      } else {
        healthFill.classList.remove('low');
      }
    }

    const crystalEl = document.getElementById('hudCrystals');
    if (crystalEl) crystalEl.textContent = `💎 ${this.crystalsCollected} / ${this.totalCrystals}`;

    const scoreEl = document.getElementById('hudScore');
    if (scoreEl) scoreEl.textContent = `⭐ ${this.score}`;
  }

  updatePhysics() {
    if (this.state !== 'PLAYING') return;

    // Movement calculation
    let moveX = 0;
    let moveZ = 0;
    if (this.keys.forward) moveZ += 1;
    if (this.keys.backward) moveZ -= 1;
    if (this.keys.left) moveX -= 1;
    if (this.keys.right) moveX += 1;

    // Normalize
    const len = Math.hypot(moveX, moveZ);
    if (len > 0) {
      moveX /= len;
      moveZ /= len;
    }

    this.player.update(moveX, moveZ, this.keys.jump, this.cameraAngle);

    // Update moving platforms
    this.levelBuilder.movingPlatforms.forEach(mp => {
      if (mp.axis === 'z') {
        mp.mesh.position.z += mp.speed * mp.dir;
        if (mp.mesh.position.z > mp.maxZ) { mp.mesh.position.z = mp.maxZ; mp.dir = -1; }
        if (mp.mesh.position.z < mp.minZ) { mp.mesh.position.z = mp.minZ; mp.dir = 1; }
      } else if (mp.axis === 'x') {
        mp.mesh.position.x += mp.speed * mp.dir;
        if (mp.mesh.position.x > mp.maxX) { mp.mesh.position.x = mp.maxX; mp.dir = -1; }
        if (mp.mesh.position.x < mp.minX) { mp.mesh.position.x = mp.minX; mp.dir = 1; }
      }
    });

    // 3D Collision Detection
    this.checkPlatformCollisions();

    // Check bottomless void
    if (this.player.position.y < -6.0) {
      this.player.takeDamage(25);
      this.updateHUD();
      if (this.player.health <= 0) {
        this.setScreenState('GAMEOVER');
      } else {
        // Respawn on start
        this.player.reset(0, 3, 0);
      }
    }

    // Check Obstacles
    this.updateObstacles();

    // Check Collectibles
    this.updateCollectibles();

    // Check Interactive Triggers
    this.updateInteractiveTriggers();

    if (this.player.health <= 0 && this.state === 'PLAYING') {
      this.setScreenState('GAMEOVER');
    }
  }

  checkPlatformCollisions() {
    const p = this.player;
    const playerRadius = 0.45;
    const playerFeet = p.position.y;
    let onGround = false;

    const allPlatforms = [
      ...this.levelBuilder.colliders,
      ...this.levelBuilder.movingPlatforms.map(m => m.mesh)
    ];

    for (const mesh of allPlatforms) {
      const box = new THREE.Box3().setFromObject(mesh);

      // Check vertical landing
      if (
        p.position.x >= box.min.x - playerRadius &&
        p.position.x <= box.max.x + playerRadius &&
        p.position.z >= box.min.z - playerRadius &&
        p.position.z <= box.max.z + playerRadius
      ) {
        // Near top of platform
        if (playerFeet <= box.max.y + 0.25 && playerFeet >= box.max.y - 0.45 && p.velocity.y <= 0) {
          p.position.y = box.max.y;
          p.velocity.y = 0;
          p.grounded = true;
          onGround = true;

          // If on a moving platform, carry the player!
          const mp = this.levelBuilder.movingPlatforms.find(m => m.mesh === mesh);
          if (mp) {
            if (mp.axis === 'z') {
              p.position.z += mp.speed * mp.dir;
            } else if (mp.axis === 'x') {
              p.position.x += mp.speed * mp.dir;
            }
          }
        }
      }
    }

    if (!onGround && p.grounded) {
      p.grounded = false;
    }
  }

  updateObstacles() {
    const p = this.player;
    this.levelBuilder.obstacles.forEach(obs => {
      if (obs.type === 'rotator') {
        obs.mesh.rotation.y += obs.speed;

        // Check if player is near center hub
        const dist = Math.hypot(p.position.x - obs.mesh.position.x, p.position.z - obs.mesh.position.z);
        if (dist < obs.radius && Math.abs(p.position.y - obs.mesh.position.y) < 1.4) {
          // Check collision with rotating cross arm
          const angle = Math.atan2(p.position.z - obs.mesh.position.z, p.position.x - obs.mesh.position.x);
          const relAngle = Math.abs(Math.sin(angle - obs.mesh.rotation.y));
          if (relAngle < 0.25) {
            p.takeDamage(20, obs.mesh.position);
            this.updateHUD();
          }
        }
      } else if (obs.type === 'drone') {
        obs.mesh.position.x += obs.speed * obs.dir;
        if (obs.mesh.position.x > obs.maxX) { obs.mesh.position.x = obs.maxX; obs.dir = -1; }
        if (obs.mesh.position.x < obs.minX) { obs.mesh.position.x = obs.minX; obs.dir = 1; }
        obs.mesh.position.y = obs.baseY + Math.sin(Date.now() * 0.005) * 0.35;

        // Distance check
        const dist = p.position.distanceTo(obs.mesh.position);
        if (dist < obs.radius + 0.4) {
          p.takeDamage(15, obs.mesh.position);
          this.updateHUD();
        }
      }
    });
  }

  updateCollectibles() {
    const p = this.player;
    const time = Date.now() * 0.003;

    this.levelBuilder.collectibles.forEach(col => {
      if (col.collected) return;

      // Animate spin & bob
      col.mesh.rotation.y += 0.04;
      col.mesh.position.y = col.baseY + Math.sin(time + col.mesh.position.x) * 0.2;

      // Check pickup
      const dist = p.position.distanceTo(col.mesh.position);
      if (dist < 1.2) {
        col.collected = true;
        col.mesh.visible = false;
        this.crystalsCollected++;
        this.score += 100;
        window.soundSystem3D.playCrystal();
        this.updateHUD();
      }
    });
  }

  updateInteractiveTriggers() {
    const p = this.player;
    const time = Date.now() * 0.003;

    this.levelBuilder.interactiveTriggers.forEach(trig => {
      if (trig.type === 'health' && !trig.used) {
        trig.mesh.rotation.y += 0.03;
        trig.mesh.position.y = trig.baseY + Math.sin(time) * 0.2;
        if (p.position.distanceTo(trig.mesh.position) < trig.radius) {
          trig.used = true;
          trig.mesh.visible = false;
          p.health = Math.min(p.maxHealth, p.health + 30);
          this.score += 50;
          window.soundSystem3D.playCrystal();
          this.updateHUD();
        }
      } else if (trig.type === 'jumppad') {
        const dist2D = Math.hypot(p.position.x - trig.mesh.position.x, p.position.z - trig.mesh.position.z);
        if (dist2D < trig.radius && Math.abs(p.position.y - trig.mesh.position.y) < 1.0) {
          if (p.velocity.y <= 0.05) {
            p.velocity.y = trig.launchY;
            p.grounded = false;
            window.soundSystem3D.playLaunchPad();
          }
        }
      } else if (trig.type === 'speedring' && !trig.used) {
        trig.mesh.rotation.z += 0.05;
        if (p.position.distanceTo(trig.mesh.position) < trig.radius) {
          trig.used = true;
          trig.mesh.visible = false;
          p.applySpeedBoost(6);
          this.score += 75;
          this.updateHUD();
        }
      } else if (trig.type === 'goal') {
        const dist2D = Math.hypot(p.position.x - trig.mesh.position.x, p.position.z - trig.mesh.position.z);
        if (dist2D < trig.radius && Math.abs(p.position.y - trig.mesh.position.y) < 2.0) {
          this.setScreenState('WIN');
        }
      }
    });
  }

  updateCamera() {
    if (this.state === 'MENU') {
      // Gentle orbit around the starting island
      this.cameraAngle += 0.003;
      const dist = 18;
      this.camera.position.x = Math.sin(this.cameraAngle) * dist;
      this.camera.position.z = Math.cos(this.cameraAngle) * dist;
      this.camera.position.y = 8;
      this.camera.lookAt(0, 2, 0);
      return;
    }

    // Chase camera tracking behind player
    const dist = 9.0;
    const targetY = this.player.position.y + 1.6;

    const camX = this.player.position.x - Math.sin(this.cameraAngle) * dist * Math.cos(this.cameraPitch);
    const camZ = this.player.position.z - Math.cos(this.cameraAngle) * dist * Math.cos(this.cameraPitch);
    const camY = targetY + dist * Math.sin(this.cameraPitch);

    // Smooth lerp
    this.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.15);
    this.camera.lookAt(this.player.position.x, targetY, this.player.position.z);

    // Directional light follows player
    this.dirLight.position.set(this.player.position.x + 20, 35, this.player.position.z + 15);
    this.dirLight.target.position.copy(this.player.position);
    this.dirLight.target.updateMatrixWorld();
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  loop(timestamp) {
    this.updatePhysics();
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop.bind(this));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game3d = new Game3D();
});
