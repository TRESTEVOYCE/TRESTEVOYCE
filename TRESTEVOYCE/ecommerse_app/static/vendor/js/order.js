document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('order-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const rows = document.querySelectorAll('.orders-table tbody tr');

    function filterOrders() {
        const searchText = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.status;

        rows.forEach(row => {
            const rowText = row.innerText.toLowerCase();
            const rowStatus = row.dataset.status;

            const matchesSearch = rowText.includes(searchText);
            const matchesStatus = activeFilter === 'all' || rowStatus === activeFilter;

            row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
        });
    }

    // Search
    searchInput.addEventListener('keyup', filterOrders);

    // Status filter
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterOrders();
        });
    });

});
