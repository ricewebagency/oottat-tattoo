// Confetti animation for thank you page
(function () {
  'use strict';

  // Only run on thank you page
  if (!document.getElementById('thank-you')) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiColors = [
    '#D4AF37', // Gold (accent color)
    '#FFFFFF', // White
    '#FFD700', // Bright gold
    '#FFA500', // Orange-gold
    '#FFB347', // Pastel orange
    '#FAFAD2', // Light gold
  ];

  const shapes = ['circle', 'square', 'triangle', 'star'];

  const confettiPieces = [];
  const confettiCount = 120;
  const gravity = 0.4;
  const terminalVelocity = 6;
  const drag = 0.075;

  class ConfettiPiece {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height;
      this.size = Math.random() * 12 + 8; // Larger size range
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 12 - 6;
      this.velocityX = Math.random() * 8 - 4;
      this.velocityY = Math.random() * -12 - 6;
      this.opacity = 1;
      this.fadeRate = Math.random() * 0.003 + 0.002;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.1 + 0.05;
      this.glowPhase = Math.random() * Math.PI * 2; // For pulsing glow
      this.glowSpeed = 0.05;
    }

    update() {
      this.velocityY += gravity;
      this.velocityX *= 1 - drag;
      this.velocityY = Math.min(this.velocityY, terminalVelocity);
      
      this.wobble += this.wobbleSpeed;
      this.glowPhase += this.glowSpeed;
      this.x += this.velocityX + Math.sin(this.wobble) * 2;
      this.y += this.velocityY;
      this.rotation += this.rotationSpeed;

      // Fade out over time
      if (this.y > canvas.height * 0.75) {
        this.opacity -= this.fadeRate;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      // Pulsing glow effect for all confetti
      const glowIntensity = (Math.sin(this.glowPhase) + 1) / 2; // 0 to 1
      const blurAmount = 8 + glowIntensity * 12; // 8 to 20
      ctx.shadowBlur = blurAmount;
      ctx.shadowColor = this.color;

      ctx.fillStyle = this.color;

      switch (this.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        
        case 'square':
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
          break;
        
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
        
        case 'star':
          this.drawStar(0, 0, 5, this.size / 2, this.size / 4);
          break;
      }

      ctx.restore();
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    }

    isOutOfBounds() {
      return this.y > canvas.height + 20 || this.opacity <= 0;
    }
  }

  // Initialize confetti
  for (let i = 0; i < confettiCount; i++) {
    confettiPieces.push(new ConfettiPiece());
  }

  let animationId;
  let startTime = Date.now();
  const duration = 5000; // 5 seconds

  function animate() {
    const elapsed = Date.now() - startTime;

    if (elapsed > duration && confettiPieces.length === 0) {
      // Remove canvas when animation is done
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      confettiPieces[i].update();
      confettiPieces[i].draw();

      if (confettiPieces[i].isOutOfBounds()) {
        confettiPieces.splice(i, 1);
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Start animation after intro overlay
  const startConfetti = () => {
    setTimeout(() => {
      animate();
    }, 200);
  };

  // Wait for intro overlay to finish, or start immediately if no overlay
  const overlay = document.querySelector('[data-intro-overlay]');
  if (overlay) {
    const checkOverlay = setInterval(() => {
      const opacity = window.getComputedStyle(overlay).opacity;
      if (opacity === '0') {
        clearInterval(checkOverlay);
        startConfetti();
      }
    }, 100);
  } else {
    startConfetti();
  }
})();
