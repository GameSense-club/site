// updateUserData()
const userData = localStorage.getItem('user');
const user = JSON.parse(userData);
const inventory = user.inventory.time_packages

const host = "https://api.game-sense.net"; // замените на актуальный хост
const container = document.getElementById("cardsContainer"); // предположим, у тебя есть контейнер
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

			card.innerHTML = `
			<img alt="Пакет" src="${host}/images/time_packages/${item.id}">
			<button class="buy-button"><h5>Активировать</h5></button>
			`;

			container.appendChild(card);
		}})

	.catch(error => {
		console.error(`Ошибка при загрузке товара с ID=${id}:`, error);
	});
}