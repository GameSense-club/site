const userData = localStorage.getItem('user');
const user = JSON.parse(userData);
const inventory = user.inventory.time_packages;

const host = "https://api.game-sense.net"; // замените на актуальный хост
const container = document.getElementById("cardsContainer"); // предположим, у тебя есть контейнер
const pc_token = getCookie('pc_token');
const jwtToken = getCookie('jwt_token');
for (const id in inventory) {
	fetch(`${host}/time_packages/${id}`, {

		method: 'GET',
		headers: {
            'Authorization': `Bearer ${jwtToken}`, // добавляем токен
            'Content-Type': 'application/json'
        }
    })
	.then(response => response.json())
	.then(item => {
		for (let i = 0; i < inventory[id]; i++) {
			const card = document.createElement("div");
			card.className = "card card_product";

			let buttonHTML = `<button class="buy-button details"><h5>Подробнее</h5></button>`;
			if (pc_token) {
				buttonHTML = 
				buttonHTML = `<button onclick="activate_package(${item.id})" class="buy-button"><h5>Активировать</h5></button>`;
			}

			card.innerHTML = `
                <img alt="Пакет" src="${host}/images/time_packages/${item.id}">
                ${buttonHTML}
			`;

			container.appendChild(card);
		}})

	.catch(error => {
		console.error(`Ошибка при загрузке товара с ID=${id}:`, error);
	});
}
