// =====================================================
// ResinLux Studio — Layout Direction Toggler (RTL/LTR)
// =====================================================

// Run immediately on script load to prevent layout shifts
(function() {
  const savedDir = localStorage.getItem('rl-dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  
  // Swap Bootstrap to RTL if needed
  const bootstrapLink = document.querySelector('link[href*="bootstrap.min.css"], link[href*="bootstrap.rtl.min.css"]');
  if (bootstrapLink && savedDir === 'rtl') {
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css';
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const dirToggle = document.getElementById('dirToggle');
  
  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    
    // Swap Bootstrap stylesheet
    const bootstrapLink = document.querySelector('link[href*="bootstrap.min.css"], link[href*="bootstrap.rtl.min.css"]');
    if (bootstrapLink) {
      bootstrapLink.href = dir === 'rtl' 
        ? 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css'
        : 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    }
    
    if (dirToggle) {
      dirToggle.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      dirToggle.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    }
  }

  // Set initial button state
  const savedDir = localStorage.getItem('rl-dir') || 'ltr';
  applyDirection(savedDir);

  if (dirToggle) {
    dirToggle.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      localStorage.setItem('rl-dir', nextDir);
      applyDirection(nextDir);
    });
  }
});
