function logout() {
    // Удаление cookie jwt_token
    document.cookie = "jwt_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Удаление данных из localStorage
    localStorage.removeItem("user");

    // Перезагрузка страницы или переход на главную/авторизацию
    window.location.href = "/"; // можно заменить на нужный URL
}