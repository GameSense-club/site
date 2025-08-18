class Router {
    constructor(routes) {
        this.routes = routes;
        this.root = document.getElementById('app');
        window.addEventListener('popstate', () => this.route());
        document.addEventListener('DOMContentLoaded', () => this.route());
    }

    async route() {
        const path = window.location.pathname;
        const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '*');
        
        if (route) {
            // Загрузка компонента
            if (typeof route.component === 'function') {
                this.root.innerHTML = await route.component();
            } else {
                this.root.innerHTML = route.component;
            }
            
            // Обновление активных ссылок
            document.querySelectorAll('[data-link]').forEach(link => {
                link.classList.toggle('active', link.href === window.location.href);
            });
        }
    }

    navigate(path) {
        history.pushState({}, '', path);
        this.route();
    }
}

// Инициализация
const router = new Router([
    { path: '/', component: '<h1>Главная</h1>' },
    { path: '/about', component: async () => (await fetch('/partials/about.html')).text() },
    { path: '/contact', component: '<contact-form></contact-form>' },
    { path: '*', component: '<h1>404</h1>' }
]);

// Использование в навигации
document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
        e.preventDefault();
        router.navigate(e.target.href);
    }
});