document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('overlay');

  // Open sidebar function
  function openSidebar(sidebarId) {
    const sidebar = document.getElementById(sidebarId);
    if (sidebar) {
      sidebar.classList.add('active');
      overlay.style.display = 'block';
    }
  }

  // Close sidebar function
  function closeSidebar() {
    document.querySelectorAll('.sidebar.active').forEach(sidebar => {
      sidebar.classList.remove('active');
    });
    overlay.style.display = 'none';
  }

  // Click icon to open sidebar
  document.querySelectorAll('.icon-wrapper[data-sidebar]').forEach(icon => {
    icon.addEventListener('click', () => {
      const sidebarId = icon.getAttribute('data-sidebar');
      openSidebar(sidebarId);
    });
  });

  // Close sidebar when clicking overlay
  overlay.addEventListener('click', closeSidebar);

  // Close sidebar when clicking X button
  document.querySelectorAll('.sidebar .sidebar-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', closeSidebar);
  });

  // Optional: Close sidebar with ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });
});
