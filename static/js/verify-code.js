const userData = localStorage.getItem('user');
const user = JSON.parse(userData);
const email = user?.email || 'Email не найден'; // Защита от undefined

fetch('https://api.game-sense.net/verify-code/send', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${jwtToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({email:email})
	})


function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}


document.getElementById("email").textContent = email;

const inputs = document.querySelectorAll('input');
const resendBtn = document.getElementById('resendBtn');

    // Фокус на первое поле
inputs[0].focus();

    // Переключение фокуса при вводе
inputs.forEach((input, index) => {
	input.addEventListener('input', () => {
		if (input.value.length === 1 && index < inputs.length - 1) {
			inputs[index + 1].focus();
		}

            // Проверка, заполнены ли все поля
		const allFilled = Array.from(inputs).every(input => input.value.length === 1);
		if (allFilled) {
                sendData(); // Отправляем данные, когда все поля заполнены
            }
        });

        // Поддержка Backspace для перемещения назад
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Backspace' && input.value === '' && index > 0) {
			inputs[index - 1].focus();
		}
	});
});

function sendData() {
	const code = Array.from(inputs).map(input => input.value).join('');
	const jwtToken = getCookie('jwt_token');
	const data = { email: email, code: code };

	fetch('https://api.game-sense.net/verify-code ', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${jwtToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then(response => {
		if (!response.ok) {
            // Пробуем получить текст ошибки
			return response.json()
			.then(errorData => {
				const errorMessage = errorData.error || 'Неверный код';
				throw new Error(errorMessage);
			});
		}
		return response.json();
	})
	.then(result => {
		window.location.href = '/';
	})
	.catch(error => {
        showNotification(error.message); // Показываем конкретную ошибку
    });
}

// Включаем кнопку через 10 секунд
setTimeout(() => {
	resendBtn.classList.remove('deactivate');
}, 30000);

// Обработчик кнопки повторной отправки
resendBtn.addEventListener('click', async () => { // добавлен async для использования await
	resendBtn.classList.add('deactivate');

	setTimeout(() => {
		resendBtn.classList.remove('deactivate');
	}, 30000);

	const code = Array.from(inputs).map(input => input.value).join('');
	const jwtToken = getCookie('jwt_token');
    const data = { email: email }; // убедитесь, что переменная email определена

    try {
        const response = await fetch('https://api.game-sense.net/verify-code/send ', { // убран лишний пробел
        	method: 'POST',
        	headers: {
        		'Authorization': `Bearer ${jwtToken}`,
        		'Content-Type': 'application/json'
        	},
        	body: JSON.stringify(data)
        });

        if (!response.ok) {
        	let errorMessage = 'Ошибка на сервере';
            // Пытаемся получить текст ошибки
        	const contentType = response.headers.get("content-type");
        	if (contentType && contentType.includes("application/json")) {
        		const errorData = await response.json();
        		errorMessage = errorData.error || errorMessage;
        	} else {
        		const errorText = await response.text();
        		errorMessage = errorText || errorMessage;
        	}

        	throw new Error(errorMessage);
        }

        const result = await response.json();

    } catch (error) {
        showNotification(error.message); // показываем конкретную ошибку
    }
});