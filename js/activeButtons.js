const Btns = document.querySelectorAll('.filter-btn, .account-btn');

Btns.forEach(btn => {
    btn.addEventListener('click', () => {
        Btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});
