document.addEventListener('DOMContentLoaded', () => {
    const notificationList = document.getElementById('notification-list');
    const totalCount = document.getElementById('total-count');
    const unreadCount = document.getElementById('unread-count');
    const highPriorityCount = document.getElementById('high-priority-count');

    // Function to recalculate counts
    function updateCounts() {
        totalCount.textContent = notificationList.children.length;
        unreadCount.textContent = notificationList.querySelectorAll('.new').length;
        highPriorityCount.textContent = notificationList.querySelectorAll('.urgent').length;
    }

    // Mark All Read
    document.getElementById('mark-all-read').addEventListener('click', () => {
        notificationList.querySelectorAll('.new').forEach(badge => badge.remove());
        updateCounts();
        // Optional: send AJAX to Django to mark notifications as read
    });

    // Clear All
    document.getElementById('clear-all').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all notifications?')) {
            notificationList.innerHTML = '';
            updateCounts();
            // Optional: send AJAX to Django to delete all notifications
        }
    });

    // Delegate individual notification buttons
    notificationList.addEventListener('click', e => {
        const item = e.target.closest('.notification-item');
        if (!item) return;

        if (e.target.classList.contains('mark-read')) {
            item.querySelector('.new')?.remove();
            updateCounts();
            // Optional: AJAX to mark this notification as read
        }

        if (e.target.classList.contains('delete')) {
            item.remove();
            updateCounts();
            // Optional: AJAX to delete this notification
        }
    });

    updateCounts();
});
