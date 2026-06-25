document.addEventListener('DOMContentLoaded', () => {
  const comparisons = document.querySelectorAll('[data-before-after]');

  comparisons.forEach((comparison) => {
    const range = comparison.querySelector('[data-before-after-range]');
    const afterWrap = comparison.querySelector('[data-before-after-after-wrap]');
    const divider = comparison.querySelector('[data-before-after-divider]');

    if (!range || !afterWrap || !divider) return;

    const min = Number(range.min || 0);
    const max = Number(range.max || 100);
    let isDragging = false;

    const clamp = (value) => Math.min(max, Math.max(min, value));

    const updateComparison = () => {
      const value = clamp(Number(range.value));
      afterWrap.style.width = `${value}%`;
      divider.style.left = `${value}%`;
    };

    const updateFromClientX = (clientX) => {
      const bounds = comparison.getBoundingClientRect();
      if (!bounds.width) return;

      const percent = ((clientX - bounds.left) / bounds.width) * 100;
      range.value = String(clamp(percent));
      updateComparison();
    };

    const onPointerDown = (event) => {
      isDragging = true;
      updateFromClientX(event.clientX);
      comparison.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!isDragging) return;
      updateFromClientX(event.clientX);
    };

    const onPointerUp = (event) => {
      isDragging = false;
      comparison.releasePointerCapture?.(event.pointerId);
    };

    range.addEventListener('input', updateComparison);
    comparison.addEventListener('pointerdown', onPointerDown);
    comparison.addEventListener('pointermove', onPointerMove);
    comparison.addEventListener('pointerup', onPointerUp);
    comparison.addEventListener('pointercancel', onPointerUp);
    comparison.addEventListener('pointerleave', onPointerUp);

    updateComparison();
  });
});
