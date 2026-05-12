// Region links toggle in footer
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-region-toggle]');
  const links = document.querySelector('[data-region-links]');
  
  if (!toggle || !links) return;
  
  const icon = toggle.querySelector('svg');
  
  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    // Toggle visibility
    links.classList.toggle('hidden');
    
    // Update ARIA
    toggle.setAttribute('aria-expanded', !isExpanded);
    
    // Rotate icon
    if (icon) {
      icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
    }
  });
});
