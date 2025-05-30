document.addEventListener('DOMContentLoaded', function() {
    const menus = document.querySelectorAll('.menu');
    const menuButtons = document.querySelectorAll('[data-menu]');
    const overlay = document.getElementById("overlay");
    let currentOpenMenu = null;

    // Открытие меню по кнопке
    menuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const menuId = this.getAttribute('data-menu');
            const menu = document.getElementById(menuId);
            
            overlay.style.display = 'flex';

            // Закрываем предыдущее открытое меню
            if (currentOpenMenu && currentOpenMenu !== menu) {
                currentOpenMenu.style.display = 'none';
            }
            
            // Переключаем текущее меню
            if (menu.style.display === 'flex') {
                menu.style.display = 'none';
                currentOpenMenu = null;
            } else {
                menu.style.display = 'flex';
                currentOpenMenu = menu;
            }
        });
    });

    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(e) {
        if (currentOpenMenu && !currentOpenMenu.contains(e.target)) {
            currentOpenMenu.style.display = 'none';
            currentOpenMenu = null;
            overlay.style.display = 'none';
        }
    });

    // Предотвращаем закрытие при клике внутри меню
    menus.forEach(menu => {
        menu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
});