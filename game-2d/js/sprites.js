/**
 * sprites.js - Procedural sprite and tile rendering
 * Produces crisp, beautiful 2D pixel-art style sprites on canvas
 */

class SpriteManager {
  constructor() {
    this.sprites = {};
    this.initSprites();
  }

  createCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return { canvas: c, ctx: c.getContext('2d') };
  }

  initSprites() {
    this.sprites.playerIdle = this.generatePlayerSprite('idle');
    this.sprites.playerRun1 = this.generatePlayerSprite('run1');
    this.sprites.playerRun2 = this.generatePlayerSprite('run2');
    this.sprites.playerJump = this.generatePlayerSprite('jump');
    this.sprites.playerHurt = this.generatePlayerSprite('hurt');

    this.sprites.coinFrames = [
      this.generateCoinSprite(1.0),
      this.generateCoinSprite(0.7),
      this.generateCoinSprite(0.3),
      this.generateCoinSprite(0.05),
      this.generateCoinSprite(0.3),
      this.generateCoinSprite(0.7)
    ];

    this.sprites.slime1 = this.generateSlimeSprite(0);
    this.sprites.slime2 = this.generateSlimeSprite(1);
    this.sprites.bat1 = this.generateBatSprite(0);
    this.sprites.bat2 = this.generateBatSprite(1);
    this.sprites.spikes = this.generateSpikeSprite();
    this.sprites.heart = this.generateHeartSprite();
    this.sprites.chestClosed = this.generateChestSprite(false);
    this.sprites.chestOpen = this.generateChestSprite(true);
    this.sprites.flag = this.generateFlagSprite();
    this.sprites.portal = this.generatePortalSprite();
  }

  generatePlayerSprite(state) {
    const { canvas, ctx } = this.createCanvas(36, 44);
    ctx.imageSmoothingEnabled = false;

    // Body colors
    const skinColor = state === 'hurt' ? '#fca5a5' : '#fcd34d';
    const shirtColor = state === 'hurt' ? '#ef4444' : '#2563eb';
    const pantsColor = '#1e293b';
    const capColor = '#dc2626';

    // Head
    ctx.fillStyle = capColor;
    ctx.fillRect(8, 6, 20, 8); // Cap
    ctx.fillRect(14, 10, 16, 4); // Visor

    ctx.fillStyle = skinColor;
    ctx.fillRect(10, 14, 16, 12); // Face
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 17, 3, 4); // Eye

    // Body / Shirt
    ctx.fillStyle = shirtColor;
    ctx.fillRect(8, 26, 20, 10);
    // Belt
    ctx.fillStyle = '#78350f';
    ctx.fillRect(8, 34, 20, 3);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(16, 34, 4, 3);

    // Legs based on state
    ctx.fillStyle = pantsColor;
    if (state === 'run1') {
      ctx.fillRect(8, 37, 7, 7);
      ctx.fillRect(21, 37, 7, 4);
    } else if (state === 'run2') {
      ctx.fillRect(8, 37, 7, 4);
      ctx.fillRect(21, 37, 7, 7);
    } else if (state === 'jump') {
      ctx.fillRect(6, 36, 8, 5);
      ctx.fillRect(22, 36, 8, 5);
    } else {
      // Idle
      ctx.fillRect(9, 37, 7, 7);
      ctx.fillRect(20, 37, 7, 7);
    }

    // Shoes
    ctx.fillStyle = '#475569';
    if (state === 'run1') {
      ctx.fillRect(6, 41, 10, 3);
      ctx.fillRect(21, 39, 8, 3);
    } else if (state === 'run2') {
      ctx.fillRect(8, 39, 8, 3);
      ctx.fillRect(20, 41, 10, 3);
    } else {
      ctx.fillRect(7, 41, 9, 3);
      ctx.fillRect(20, 41, 9, 3);
    }

    return canvas;
  }

  generateCoinSprite(scaleX) {
    const { canvas, ctx } = this.createCanvas(24, 24);
    ctx.save();
    ctx.translate(12, 12);
    ctx.scale(Math.max(0.1, scaleX), 1.0);

    // Outer rim
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
    ctx.fill();

    // Inner highlight star
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-2, -5, 4, 10);
    ctx.fillRect(-5, -2, 10, 4);

    ctx.restore();
    return canvas;
  }

  generateSlimeSprite(frame) {
    const { canvas, ctx } = this.createCanvas(32, 28);
    const squish = frame === 0 ? 0 : 2;

    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.ellipse(16, 18 + squish, 14, 9 - squish, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.ellipse(16, 16 + squish, 12, 7 - squish, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 12 + squish, 4, 5);
    ctx.fillRect(18, 12 + squish, 4, 5);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(12, 14 + squish, 2, 3);
    ctx.fillRect(20, 14 + squish, 2, 3);

    return canvas;
  }

  generateBatSprite(frame) {
    const { canvas, ctx } = this.createCanvas(34, 28);
    const wingY = frame === 0 ? 6 : 14;

    // Wings
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.moveTo(17, 14);
    ctx.lineTo(2, wingY);
    ctx.lineTo(8, 20);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(17, 14);
    ctx.lineTo(32, wingY);
    ctx.lineTo(26, 20);
    ctx.closePath();
    ctx.fill();

    // Body
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.arc(17, 15, 6, 0, Math.PI * 2);
    ctx.fill();

    // Red eyes
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(14, 13, 2, 2);
    ctx.fillRect(18, 13, 2, 2);

    return canvas;
  }

  generateSpikeSprite() {
    const { canvas, ctx } = this.createCanvas(32, 24);
    ctx.fillStyle = '#94a3b8';

    // 3 spikes
    for (let i = 0; i < 3; i++) {
      const x = i * 10 + 2;
      ctx.beginPath();
      ctx.moveTo(x, 24);
      ctx.lineTo(x + 5, 4);
      ctx.lineTo(x + 10, 24);
      ctx.closePath();
      ctx.fill();

      // Highlight
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(x + 5, 4);
      ctx.lineTo(x + 5, 24);
      ctx.lineTo(x + 10, 24);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#64748b';
    }
    return canvas;
  }

  generateHeartSprite() {
    const { canvas, ctx } = this.createCanvas(24, 24);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(12, 20);
    ctx.bezierCurveTo(4, 14, 2, 6, 7, 4);
    ctx.bezierCurveTo(10, 2, 12, 6, 12, 8);
    ctx.bezierCurveTo(12, 6, 14, 2, 17, 4);
    ctx.bezierCurveTo(22, 6, 20, 14, 12, 20);
    ctx.fill();

    // Highlight sheen
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(7, 6, 2.5, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  }

  generateChestSprite(isOpen) {
    const { canvas, ctx } = this.createCanvas(32, 26);
    // Base wood
    ctx.fillStyle = '#78350f';
    ctx.fillRect(3, 10, 26, 14);

    // Iron bands
    ctx.fillStyle = '#64748b';
    ctx.fillRect(6, 10, 3, 14);
    ctx.fillRect(23, 10, 3, 14);

    if (!isOpen) {
      // Closed lid
      ctx.fillStyle = '#92400e';
      ctx.fillRect(2, 4, 28, 8);
      // Gold lock
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(14, 10, 4, 5);
    } else {
      // Open lid
      ctx.fillStyle = '#92400e';
      ctx.fillRect(2, 0, 28, 6);
      // Gold sparkle inside
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(10, 8, 12, 4);
    }
    return canvas;
  }

  generateFlagSprite() {
    const { canvas, ctx } = this.createCanvas(32, 48);
    // Pole
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(4, 4, 4, 42);
    // Base
    ctx.fillStyle = '#475569';
    ctx.fillRect(1, 44, 10, 4);
    // Gold finial
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(6, 4, 4, 0, Math.PI * 2);
    ctx.fill();

    // Banner
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(8, 8);
    ctx.lineTo(28, 16);
    ctx.lineTo(8, 24);
    ctx.closePath();
    ctx.fill();

    return canvas;
  }

  generatePortalSprite() {
    const { canvas, ctx } = this.createCanvas(36, 52);
    // Outer stone frame
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(18, 26, 16, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Energy core
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(18, 26, 11, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.ellipse(18, 26, 6, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  }
}

window.spriteManager = new SpriteManager();
