/**
 * levels.js - 3D World Environment, Terrain, Lighting, Collectibles, and Obstacles
 * Petualangan Dunia 3D - SMK Plus Pelita Nusantara
 */

class LevelBuilder3D {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
    this.movingPlatforms = [];
    this.collectibles = [];
    this.obstacles = [];
    this.interactiveTriggers = [];
    this.envObjects = [];
  }

  clear() {
    // Remove all dynamically added meshes
    const all = [
      ...this.colliders,
      ...this.movingPlatforms.map(p => p.mesh),
      ...this.collectibles.map(c => c.mesh),
      ...this.obstacles.map(o => o.mesh),
      ...this.interactiveTriggers.map(t => t.mesh),
      ...this.envObjects
    ];
    all.forEach(obj => {
      if (obj && obj.parent) {
        obj.parent.remove(obj);
      }
    });

    this.colliders = [];
    this.movingPlatforms = [];
    this.collectibles = [];
    this.obstacles = [];
    this.interactiveTriggers = [];
    this.envObjects = [];
  }

  buildLevel(levelId) {
    this.clear();

    if (levelId === 1) {
      return this.buildLevel1();
    } else {
      return this.buildLevel2();
    }
  }

  // --- Helper Methods ---
  createPlatform(x, y, z, w, h, d, color = 0x15803d, isStone = false) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshLambertMaterial({
      color: color
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    // Stone rim if grass
    if (!isStone) {
      const baseGeo = new THREE.BoxGeometry(w + 0.1, h * 0.4, d + 0.1);
      const baseMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -h * 0.3;
      mesh.add(baseMesh);
    }

    this.scene.add(mesh);
    this.colliders.push(mesh);
    return mesh;
  }

  createTree(x, y, z) {
    const group = new THREE.Group();
    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2.5, 6);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.25;
    trunk.castShadow = true;
    group.add(trunk);

    // Leaves
    const leavesGeo = new THREE.ConeGeometry(1.6, 3.2, 6);
    const leavesMat = new THREE.MeshLambertMaterial({ color: 0x16a34a });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = 3.2;
    leaves.castShadow = true;
    group.add(leaves);

    group.position.set(x, y, z);
    this.scene.add(group);
    this.envObjects.push(group);
  }

  createBoulder(x, y, z, scale = 1) {
    const geo = new THREE.DodecahedronGeometry(0.9 * scale, 0);
    const mat = new THREE.MeshLambertMaterial({ color: 0x64748b });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + 0.6 * scale, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.envObjects.push(mesh);
    this.colliders.push(mesh);
  }

  createCrystal(x, y, z, color = 0x38bdf8) {
    const geo = new THREE.OctahedronGeometry(0.45, 0);
    const mat = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.4,
      shininess: 90
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    this.scene.add(mesh);

    this.collectibles.push({
      mesh: mesh,
      baseY: y,
      type: 'crystal',
      collected: false
    });
  }

  createHeartItem(x, y, z) {
    const geo = new THREE.DodecahedronGeometry(0.4, 0);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.5,
      shininess: 100
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    this.scene.add(mesh);

    this.interactiveTriggers.push({
      mesh: mesh,
      baseY: y,
      type: 'health',
      radius: 1.2,
      used: false
    });
  }

  createJumpPad(x, y, z) {
    const group = new THREE.Group();
    // Base ring
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.3, 16);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.15;
    group.add(base);

    // Glowing spring center
    const padGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.35, 16);
    const padMat = new THREE.MeshPhongMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.6
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = 0.2;
    group.add(pad);

    group.position.set(x, y, z);
    this.scene.add(group);

    this.interactiveTriggers.push({
      mesh: group,
      type: 'jumppad',
      radius: 1.4,
      launchY: 0.65
    });
  }

  createSpeedRing(x, y, z) {
    const geo = new THREE.TorusGeometry(1.1, 0.15, 8, 20);
    const mat = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.6
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + 1.2, z);
    this.scene.add(mesh);

    this.interactiveTriggers.push({
      mesh: mesh,
      type: 'speedring',
      radius: 1.5,
      used: false
    });
  }

  createGoalAltar(x, y, z) {
    const group = new THREE.Group();
    // Marble altar base
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.8, 16);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.4;
    group.add(base);

    // 4 Corner Pillars
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const pilGeo = new THREE.CylinderGeometry(0.25, 0.25, 3.2, 8);
      const pil = new THREE.Mesh(pilGeo, baseMat);
      pil.position.set(Math.cos(angle) * 1.8, 2.0, Math.sin(angle) * 1.8);
      group.add(pil);
    }

    // Glowing beacon core
    const beaconGeo = new THREE.CylinderGeometry(0.8, 0.8, 6.0, 16, 1, true);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 3.8;
    group.add(beacon);

    group.position.set(x, y, z);
    this.scene.add(group);

    this.interactiveTriggers.push({
      mesh: group,
      type: 'goal',
      radius: 2.2
    });
  }

  createRotatingSpikeBar(x, y, z, length = 7.0) {
    const group = new THREE.Group();
    // Central hub
    const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 12);
    const hubMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.position.y = 0.6;
    group.add(hub);

    // Hazard cross bar
    const barGeo = new THREE.BoxGeometry(length, 0.4, 0.4);
    const barMat = new THREE.MeshPhongMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.4
    });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.y = 0.6;
    group.add(bar);

    group.position.set(x, y, z);
    this.scene.add(group);

    this.obstacles.push({
      mesh: group,
      type: 'rotator',
      speed: 0.035,
      radius: length * 0.5
    });
  }

  createPatrolDrone(x, y, z, minX, maxX, speed = 0.08) {
    const group = new THREE.Group();
    // Drone body
    const bodyGeo = new THREE.SphereGeometry(0.7, 12, 12);
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0x1e293b,
      shininess: 60
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.0;
    group.add(body);

    // Glowing eye
    const eyeGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0, 1.0, 0.6);
    group.add(eye);

    // Hover rings
    const ringGeo = new THREE.TorusGeometry(0.9, 0.08, 6, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.0;
    group.add(ring);

    group.position.set(x, y, z);
    this.scene.add(group);

    this.obstacles.push({
      mesh: group,
      type: 'drone',
      minX: minX,
      maxX: maxX,
      speed: speed,
      dir: 1,
      baseY: y,
      radius: 1.1
    });
  }

  // ============================================
  // LEVEL 1: Dataran Hijau Nusantara
  // ============================================
  buildLevel1() {
    // Starting Island
    this.createPlatform(0, 0, 0, 16, 2, 16, 0x15803d);
    this.createTree(-5, 1, -5);
    this.createTree(5, 1, -5);
    this.createBoulder(-5, 1, 4, 1.2);

    // Bridge 1
    this.createPlatform(0, 0, 14, 5, 1.5, 12, 0x64748b, true);

    // Intermediate Island 2 with Jump Pad & Rotating Bar
    this.createPlatform(0, 0, 30, 20, 2, 20, 0x15803d);
    this.createTree(7, 1, 30);
    this.createTree(-7, 1, 35);
    this.createJumpPad(6, 1, 36); // Launches up to High Pillar
    this.createHeartItem(-6, 1.5, 26);
    this.createRotatingSpikeBar(0, 1, 28, 7.5); // Obstacle 1

    // Patrol Drone over Bridge 2
    this.createPatrolDrone(0, 1, 46, -4, 4, 0.09); // Obstacle 2

    // Bridge 2
    this.createPlatform(0, 0, 46, 5, 1.5, 12, 0x64748b, true);

    // Elevated Pillar (reachable via Jump Pad or Stairs)
    this.createPlatform(0, 4, 62, 16, 2, 16, 0x15803d);
    this.createSpeedRing(0, 5, 62); // Speed booster

    // Bridge 3 to Sanctuary
    this.createPlatform(0, 4, 76, 5, 1.5, 12, 0x64748b, true);

    // Sanctuary Goal Island
    this.createPlatform(0, 4, 92, 22, 2, 20, 0x15803d);
    this.createTree(-8, 5, 92);
    this.createTree(8, 5, 92);
    this.createGoalAltar(0, 5, 96); // Finish

    // Place 12 Collectible Crystals (Requirement is at least 10)
    const crystalPositions = [
      [0, 1.8, 5],
      [4, 1.8, 3],
      [-4, 1.8, 3],
      [0, 1.8, 14],
      [0, 1.8, 20],
      [5, 1.8, 25],
      [-5, 1.8, 32],
      [0, 1.8, 35],
      [0, 1.8, 46],
      [3, 5.8, 60],
      [-3, 5.8, 64],
      [0, 5.8, 76]
    ];
    crystalPositions.forEach(pos => this.createCrystal(pos[0], pos[1], pos[2]));

    return {
      name: "Level 1: Dataran Hijau Nusantara",
      playerSpawn: new THREE.Vector3(0, 2, 0),
      totalCrystals: crystalPositions.length,
      skyColor: 0x0284c7,
      fogColor: 0x38bdf8
    };
  }

  // ============================================
  // LEVEL 2: Kuil Terapung Misteri
  // ============================================
  buildLevel2() {
    // Starting Temple Plaza
    this.createPlatform(0, 0, 0, 18, 2, 18, 0x3b0764);
    this.createBoulder(-6, 1, -5, 1.4);
    this.createBoulder(6, 1, -5, 1.4);
    this.createHeartItem(6, 1.5, 5);

    // Moving Platform 1 (Z-axis translation)
    const movGeo1 = new THREE.BoxGeometry(7, 1.2, 7);
    const movMat1 = new THREE.MeshLambertMaterial({ color: 0x0284c7 });
    const movMesh1 = new THREE.Mesh(movGeo1, movMat1);
    movMesh1.position.set(0, 0, 16);
    movMesh1.castShadow = true;
    movMesh1.receiveShadow = true;
    this.scene.add(movMesh1);
    this.movingPlatforms.push({
      mesh: movMesh1,
      minZ: 14,
      maxZ: 28,
      speed: 0.1,
      dir: 1,
      axis: 'z'
    });

    // Island 2: Double Rotating Spike Bar & Drone
    this.createPlatform(0, 0, 38, 22, 2, 22, 0x1e1b4b);
    this.createRotatingSpikeBar(-4, 1, 38, 8.0);
    this.createRotatingSpikeBar(4, 1, 38, 8.0);
    this.createPatrolDrone(0, 1.5, 34, -7, 7, 0.12);
    this.createJumpPad(0, 1, 46); // Launches over void to high temple ledge

    // Elevated Sanctuary Platform
    this.createPlatform(0, 6, 62, 18, 2, 18, 0x3b0764);
    this.createSpeedRing(0, 7, 60);
    this.createHeartItem(-6, 7.5, 64);
    this.createPatrolDrone(0, 7.5, 62, -5, 5, 0.14);

    // Moving Platform 2 (X-axis translation)
    const movGeo2 = new THREE.BoxGeometry(7, 1.2, 7);
    const movMat2 = new THREE.MeshLambertMaterial({ color: 0x0284c7 });
    const movMesh2 = new THREE.Mesh(movGeo2, movMat2);
    movMesh2.position.set(0, 6, 78);
    movMesh2.castShadow = true;
    movMesh2.receiveShadow = true;
    this.scene.add(movMesh2);
    this.movingPlatforms.push({
      mesh: movMesh2,
      minX: -8,
      maxX: 8,
      speed: 0.12,
      dir: 1,
      axis: 'x'
    });

    // Grand Altar Floating Island
    this.createPlatform(0, 6, 96, 24, 2, 24, 0x1e1b4b);
    this.createBoulder(-8, 7, 96, 1.5);
    this.createBoulder(8, 7, 96, 1.5);
    this.createGoalAltar(0, 7, 100);

    // 15 Collectible Crystals (Requirement: at least 10)
    const crystalPositions = [
      [0, 1.8, 3],
      [-5, 1.8, 0],
      [5, 1.8, 0],
      [0, 1.8, 16],
      [0, 1.8, 24],
      [-6, 1.8, 36],
      [6, 1.8, 36],
      [0, 1.8, 40],
      [0, 1.8, 44],
      [0, 7.8, 58],
      [-4, 7.8, 62],
      [4, 7.8, 62],
      [0, 7.8, 72],
      [-4, 7.8, 92],
      [4, 7.8, 92]
    ];
    crystalPositions.forEach(pos => this.createCrystal(pos[0], pos[1], pos[2], 0xc084fc));

    return {
      name: "Level 2: Kuil Terapung Misteri",
      playerSpawn: new THREE.Vector3(0, 2, 0),
      totalCrystals: crystalPositions.length,
      skyColor: 0x090d16,
      fogColor: 0x1e1b4b
    };
  }
}

window.LevelBuilder3D = LevelBuilder3D;
