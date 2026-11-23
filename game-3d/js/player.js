/**
 * player.js - 3D Articulated Character Model, Movement Physics, and Procedural Animations
 * Petualangan Dunia 3D - SMK Plus Pelita Nusantara
 */

class Player3D {
  constructor(scene) {
    this.scene = scene;
    this.position = new THREE.Vector3(0, 5, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 0.22;
    this.baseSpeed = 0.22;
    this.boostSpeed = 0.38;
    this.speedBoostTimer = 0;
    this.jumpForce = 0.36;
    this.gravity = 0.016;
    this.grounded = false;

    this.health = 100;
    this.maxHealth = 100;
    this.invulnerableTimer = 0;

    this.facingAngle = 0;
    this.animTime = 0;

    this.buildCharacterModel();
  }

  buildCharacterModel() {
    this.group = new THREE.Group();

    // Materials
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xffd166 });
    const shirtMat = new THREE.MeshLambertMaterial({ color: 0x0284c7 });
    const capMat = new THREE.MeshLambertMaterial({ color: 0xef4444 });
    const pantsMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const shoeMat = new THREE.MeshLambertMaterial({ color: 0x475569 });

    // 1. Torso
    const torsoGeo = new THREE.BoxGeometry(0.8, 1.0, 0.5);
    this.torso = new THREE.Mesh(torsoGeo, shirtMat);
    this.torso.position.y = 1.3;
    this.torso.castShadow = true;
    this.torso.receiveShadow = true;
    this.group.add(this.torso);

    // Backpack
    const packGeo = new THREE.BoxGeometry(0.5, 0.6, 0.3);
    const packMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });
    const backpack = new THREE.Mesh(packGeo, packMat);
    backpack.position.set(0, 0, -0.35);
    backpack.castShadow = true;
    this.torso.add(backpack);

    // 2. Head & Cap
    const headGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    this.head = new THREE.Mesh(headGeo, skinMat);
    this.head.position.y = 0.85;
    this.head.castShadow = true;
    this.torso.add(this.head);

    // Cap
    const capGeo = new THREE.BoxGeometry(0.66, 0.2, 0.66);
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.35;
    cap.castShadow = true;
    this.head.add(cap);

    // Cap Visor
    const visorGeo = new THREE.BoxGeometry(0.6, 0.08, 0.3);
    const visor = new THREE.Mesh(visorGeo, capMat);
    visor.position.set(0, 0.25, 0.4);
    visor.castShadow = true;
    this.head.add(visor);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.05);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.16, 0.05, 0.31);
    this.head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(-0.16, 0.05, 0.31);
    this.head.add(rightEye);

    // 3. Left Arm with shoulder pivot
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(0.55, 0.4, 0);
    const armGeo = new THREE.BoxGeometry(0.25, 0.8, 0.25);
    armGeo.translate(0, -0.35, 0);
    this.leftArm = new THREE.Mesh(armGeo, shirtMat);
    this.leftArm.castShadow = true;
    this.leftArmPivot.add(this.leftArm);
    this.torso.add(this.leftArmPivot);

    // 4. Right Arm with shoulder pivot
    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(-0.55, 0.4, 0);
    this.rightArm = new THREE.Mesh(armGeo, shirtMat);
    this.rightArm.castShadow = true;
    this.rightArmPivot.add(this.rightArm);
    this.torso.add(this.rightArmPivot);

    // 5. Left Leg with hip pivot
    this.leftLegPivot = new THREE.Group();
    this.leftLegPivot.position.set(0.24, -0.5, 0);
    const legGeo = new THREE.BoxGeometry(0.3, 0.8, 0.3);
    legGeo.translate(0, -0.4, 0);
    this.leftLeg = new THREE.Mesh(legGeo, pantsMat);
    this.leftLeg.castShadow = true;
    this.leftLegPivot.add(this.leftLeg);

    const shoeGeo = new THREE.BoxGeometry(0.32, 0.2, 0.42);
    shoeGeo.translate(0, -0.75, 0.06);
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.castShadow = true;
    this.leftLegPivot.add(leftShoe);
    this.torso.add(this.leftLegPivot);

    // 6. Right Leg with hip pivot
    this.rightLegPivot = new THREE.Group();
    this.rightLegPivot.position.set(-0.24, -0.5, 0);
    this.rightLeg = new THREE.Mesh(legGeo, pantsMat);
    this.rightLeg.castShadow = true;
    this.rightLegPivot.add(this.rightLeg);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.castShadow = true;
    this.rightLegPivot.add(rightShoe);
    this.torso.add(this.rightLegPivot);

    this.group.position.copy(this.position);
    this.scene.add(this.group);
  }

  reset(x, y, z) {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
    this.grounded = false;
    this.speedBoostTimer = 0;
    this.speed = this.baseSpeed;
    this.invulnerableTimer = 0;
    this.group.position.copy(this.position);
  }

  takeDamage(amount, sourcePos) {
    if (this.invulnerableTimer > 0) return;

    this.health = Math.max(0, this.health - amount);
    this.invulnerableTimer = 60; // 1 second invulnerability
    window.soundSystem3D.playHurt();

    // Knockback
    if (sourcePos) {
      const kbDir = new THREE.Vector3().subVectors(this.position, sourcePos).normalize();
      this.velocity.x = kbDir.x * 0.18;
      this.velocity.z = kbDir.z * 0.18;
      this.velocity.y = 0.2;
    }
  }

  applySpeedBoost(durationSeconds = 6) {
    this.speedBoostTimer = durationSeconds * 60;
    this.speed = this.boostSpeed;
    window.soundSystem3D.playSpeedBoost();
  }

  update(moveX, moveZ, isJumping, cameraAngle) {
    // Speed boost countdown
    if (this.speedBoostTimer > 0) {
      this.speedBoostTimer--;
      if (this.speedBoostTimer <= 0) {
        this.speed = this.baseSpeed;
      }
    }

    // Invulnerability timer
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer--;
      this.group.visible = Math.floor(this.invulnerableTimer / 4) % 2 === 0;
    } else {
      this.group.visible = true;
    }

    // Movement relative to camera
    const isMoving = Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05;

    if (isMoving) {
      // Calculate world direction from input + camera angle
      const inputAngle = Math.atan2(moveX, moveZ);
      const moveAngle = inputAngle + cameraAngle;

      this.velocity.x = Math.sin(moveAngle) * this.speed;
      this.velocity.z = Math.cos(moveAngle) * this.speed;

      // Smooth rotate towards moving direction
      this.facingAngle = moveAngle;
      this.group.rotation.y = this.facingAngle;

      // Walk animation
      this.animTime += 0.25 * (this.speed / this.baseSpeed);
      this.leftLegPivot.rotation.x = Math.sin(this.animTime) * 0.65;
      this.rightLegPivot.rotation.x = -Math.sin(this.animTime) * 0.65;
      this.leftArmPivot.rotation.x = -Math.sin(this.animTime) * 0.55;
      this.rightArmPivot.rotation.x = Math.sin(this.animTime) * 0.55;
      this.torso.position.y = 1.3 + Math.abs(Math.sin(this.animTime * 2)) * 0.06;
    } else {
      // Idle state
      this.velocity.x *= 0.7;
      this.velocity.z *= 0.7;
      this.animTime += 0.05;
      this.leftLegPivot.rotation.x = 0;
      this.rightLegPivot.rotation.x = 0;
      this.leftArmPivot.rotation.x = 0;
      this.rightArmPivot.rotation.x = 0;
      this.torso.position.y = 1.3 + Math.sin(this.animTime) * 0.03;
    }

    // Jump
    if (isJumping && this.grounded) {
      this.velocity.y = this.jumpForce;
      this.grounded = false;
      window.soundSystem3D.playJump();
    }

    // Gravity
    this.velocity.y -= this.gravity;
    if (this.velocity.y < -0.6) this.velocity.y = -0.6; // Terminal velocity

    // Jump animation pose
    if (!this.grounded) {
      this.leftLegPivot.rotation.x = -0.4;
      this.rightLegPivot.rotation.x = 0.3;
      this.leftArmPivot.rotation.x = -1.1;
      this.rightArmPivot.rotation.x = -1.1;
    }

    // Update position
    this.position.add(this.velocity);
    this.group.position.copy(this.position);
  }
}

window.Player3D = Player3D;
