const form = document.getElementById("loginForm");
const buttons = form.querySelectorAll("button");

const loginBtn = buttons[0];
const registerBtn = buttons[1];

// Функция для отправки формы входа
async function handleLoginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Показываем индикатор загрузки
    loginBtn.disabled = true;
    loginBtn.textContent = 'Вход...';

    try {
        const response = await fetch('https://api.game-sense.ru/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Ошибка входа');
        }

        // Успешный вход
        document.cookie = `jwt_token=${result.token}; path=/; SameSite=Strict`;
        showNotification("Успешный вход! Перенаправляем в магазин...", "success");
        
        // Обновляем данные пользователя и перенаправляем
        await updateUserData();
        setTimeout(() => {
            window.location.href = '/shop';
        }, 1000);
        
    } catch (error) {

    }
}

// Функция для отправки формы регистрации
async function handleRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Валидация данных
    if (!data.first_name || !data.last_name || !data.email || !data.password) {
        showNotification("Пожалуйста, заполните все поля", "error");
        return;
    }

    if (data.password.length < 6) {
        showNotification("Пароль должен содержать минимум 6 символов", "error");
        return;
    }

    // Показываем индикатор загрузки
    registerBtn.disabled = true;
    registerBtn.textContent = 'Регистрация...';

    try {
        const response = await fetch('https://api.game-sense.ru/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 400) {

            }
        }

        // Успешная регистрация
        document.cookie = `jwt_token=${result.token}; path=/; SameSite=Strict`;
        showNotification("Регистрация успешна! Добро пожаловать в магазин!", "success");
        
        // Обновляем данные пользователя и перенаправляем
        await updateUserData();
        setTimeout(() => {
            window.location.href = '/shop';
        }, 1500);
        
    } catch (error) {


    // Заменяем identifier на email
    const identifier = form.querySelector('[name="identifier"]');
    if (identifier) {
        const emailField = document.createElement("input");
        emailField.type = "email";
        emailField.name = "email";
        emailField.placeholder = "E-mail:";
        emailField.required = true;
        emailField.className = "form-input";
        emailField.value = identifier.value;

        identifier.parentNode.replaceChild(emailField, identifier);

    }

    // Превращаем кнопку регистрации в submit
    registerBtn.type = "submit";
    loginBtn.type = "button";



    // Удаляем обработчик регистрации
    form.removeEventListener('submit', handleRegisterSubmit);
    form.addEventListener('submit', handleLoginSubmit);

    // Скрываем имя и фамилию
    const firstNameField = form.querySelector('#first_name');
    const lastNameField = form.querySelector('#last_name');
    
    if (firstNameField) firstNameField.classList.add("none");
    if (lastNameField) lastNameField.classList.add("none");

    // Обновляем кнопки
    loginBtn.textContent = 'Войти';
    loginBtn.classList.remove('btn-back');
    registerBtn.textContent = 'Регистрация';
    registerBtn.classList.remove('btn-register');

    // Настраиваем поля
    if (firstNameField) {
        firstNameField.removeAttribute("name");
        firstNameField.required = false;
    }
    if (lastNameField) {
        lastNameField.removeAttribute("name");
        lastNameField.required = false;
    }

    // Удаляем email и возвращаем identifier
    const emailField = form.querySelector('[name="email"]');
    if (emailField) {
        const identifierField = document.createElement("input");
        identifierField.type = "text";
        identifierField.name = "identifier";
        identifierField.placeholder = "E-mail:";
        identifierField.required = true;
        identifierField.className = "form-input";
        identifierField.value = emailField.value;

        emailField.parentNode.replaceChild(identifierField, emailField);
    }

    // Возвращаем тип кнопок
    loginBtn.type = "submit";
    registerBtn.type = "button";

    // Обновляем заголовок
    const title = form.querySelector('.logo h2');
    if (title) title.textContent = 'Вход в систему';
}

// Обработчики событий
loginBtn.addEventListener("click", function(e) {
    if (loginBtn.type === "button") {
        e.preventDefault();
        switchToLogin();
    }
});

registerBtn.addEventListener("click", function(e) {
    if (registerBtn.type === "button") {
        e.preventDefault();
        switchToRegister();
    }
});
