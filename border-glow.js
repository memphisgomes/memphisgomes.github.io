/**
 * BorderGlow - Efeito de glow interativo nas bordas
 * Adaptado para HTML/CSS puro - sem dependências
 */

class BorderGlow {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      edgeSensitivity: options.edgeSensitivity || 30,
      glowColor: options.glowColor || '40 80 80',
      glowRadius: options.glowRadius || 40,
      glowIntensity: options.glowIntensity || 1.0,
      coneSpread: options.coneSpread || 25,
      animated: options.animated || false,
      ...options,
    };

    this.init();
  }

  init() {
    this.setupStyles();
    this.setupEventListeners();
    if (this.options.animated) {
      this.playAnimation();
    }
  }

  setupStyles() {
    const { glowColor, glowIntensity, edgeSensitivity, glowRadius, coneSpread } = this.options;
    const { h, s, l } = this.parseHSL(glowColor);
    
    // Set CSS variables
    this.element.style.setProperty('--edge-proximity', '0');
    this.element.style.setProperty('--cursor-angle', '45deg');
    this.element.style.setProperty('--edge-sensitivity', edgeSensitivity);
    this.element.style.setProperty('--glow-padding', `${glowRadius}px`);
    this.element.style.setProperty('--cone-spread', coneSpread);
    
    // Glow colors with opacity levels
    const opacities = [100, 60, 50, 40, 30, 20, 10];
    const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
    
    for (let i = 0; i < opacities.length; i++) {
      const opacity = Math.min(opacities[i] * glowIntensity, 100);
      this.element.style.setProperty(
        `--glow-color${keys[i]}`,
        `hsl(${h}deg ${s}% ${l}% / ${opacity}%)`
      );
    }

    this.element.classList.add('border-glow-card');
  }

  setupEventListeners() {
    this.element.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    this.element.addEventListener('pointerleave', () => this.handlePointerLeave());
  }

  parseHSL(hslStr) {
    const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
    if (!match) return { h: 40, s: 80, l: 80 };
    return {
      h: parseFloat(match[1]),
      s: parseFloat(match[2]),
      l: parseFloat(match[3]),
    };
  }

  getCenterOfElement() {
    const rect = this.element.getBoundingClientRect();
    return [rect.width / 2, rect.height / 2];
  }

  getEdgeProximity(x, y) {
    const [cx, cy] = this.getCenterOfElement();
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;

    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);

    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }

  getCursorAngle(x, y) {
    const [cx, cy] = this.getCenterOfElement();
    const dx = x - cx;
    const dy = y - cy;

    if (dx === 0 && dy === 0) return 0;

    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;

    if (degrees < 0) degrees += 360;

    return degrees;
  }

  handlePointerMove(e) {
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const edge = this.getEdgeProximity(x, y);
    const angle = this.getCursorAngle(x, y);

    this.element.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
    this.element.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }

  handlePointerLeave() {
    this.element.style.setProperty('--edge-proximity', '0');
  }

  playAnimation() {
    this.element.classList.add('sweep-active');
    
    const duration = 4000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Animate edge proximity
      const proximityStart = 0;
      const proximityEnd = 100;
      const proximityValue = proximityStart + (proximityEnd - proximityStart) * this.easeOutCubic(progress);
      this.element.style.setProperty('--edge-proximity', proximityValue);

      // Animate angle
      const angleStart = 0;
      const angleEnd = 360;
      const angleValue = angleStart + (angleEnd - angleStart) * this.easeOutCubic(progress);
      this.element.style.setProperty('--cursor-angle', `${angleValue}deg`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.element.classList.remove('sweep-active');
      }
    };

    requestAnimationFrame(animate);
  }

  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.cover[data-glow]').forEach((el) => {
    new BorderGlow(el, {
      edgeSensitivity: 25,
      glowColor: '120 100 50',
      glowRadius: 35,
      glowIntensity: 0.8,
      coneSpread: 28,
      animated: false,
    });
  });
});

export default BorderGlow;
