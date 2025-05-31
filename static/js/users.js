const host = "https://api.game-sense.net";
const url = `${host}/profile/all`;
let cardsData = []; // Глобальная переменная для хранения данных

const jwtToken = getCookie('jwt_token');

// Функция для отправки нового баланса
async function updateBalance(userId, newBalance) {
  try {
    const response = await fetch(`${host}/profile/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ balance: newBalance })
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка при обновлении баланса: ${response.status}`);
    }
    
    // Обновляем данные в cardsData
    const userIndex = cardsData.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      cardsData[userIndex].balance = newBalance;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при обновлении баланса:', error);
    throw error;
  }
}

// Функция для отображения карточек
function renderCards(data) {
  const container = document.getElementById("cardsContainer");
  const blockedContainer = document.getElementById("cardsContainerBlock");

  if (!container || !blockedContainer) {
    console.error("Контейнеры не найдены на странице.");
    return;
  }

  // Очищаем контейнеры
  container.innerHTML = '';
  blockedContainer.innerHTML = '';

  if (!Array.isArray(data)) {
    console.error("Полученные данные не являются массивом:", data);
    container.innerHTML = "<p>Ошибка: данные пришли в неверном формате.</p>";
    return;
  }

  if (data.length === 0) {
    container.innerHTML = "<p>Пользователи не найдены</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card card_user";

    card.innerHTML = `
      <h5>Имя: ${item.first_name}</h5>
      <h5>Фамилия: ${item.last_name}</h5>
      <h5>Почта: ${item.email}</h5>
      <h5 class="row">Баланс: <div class="row">
        <input type="number" min="0" value="${item.balance}" 
               oninput="validity.valid||(value='');" 
               onchange="handleBalanceChange(${item.id}, this.value)">
        ₽
      </div></h5>
      <h5>Роль: ${item.role}</h5>
    `;

    if (item.is_active === 2) {
      card.classList.add("deactivate");
      blockedContainer.appendChild(card);
    } else {
      container.appendChild(card);
    }
  });
}

// Обработчик изменения баланса
async function handleBalanceChange(userId, newBalance) {
  try {
    await updateBalance(userId, parseInt(newBalance));
    console.log(`Баланс пользователя ${userId} успешно обновлен`);
  } catch (error) {
    console.error('Не удалось обновить баланс:', error);
    // Можно добавить уведомление пользователю об ошибке
  }
}

// Функция для поиска
function searchCards(query) {
  if (!query) return cardsData;

  const searchTerms = query.toLowerCase().split(' ');

  return cardsData.filter(item => {
    const firstName = item.first_name.toLowerCase();
    const lastName = item.last_name.toLowerCase();

    // Проверяем, совпадает ли любой из терминов с именем или фамилией
    return searchTerms.some(term => 
      firstName.includes(term) || lastName.includes(term)
    );
  });
}

// Функция для сортировки
function sortCards(data, sortValue) {
  if (!sortValue) return data;

  const sortedData = [...data];

  switch(sortValue) {
    case 'role':
      sortedData.sort((a, b) => a.role.localeCompare(b.role));
      break;
    case 'balance-asc':
      sortedData.sort((a, b) => a.balance - b.balance);
      break;
    case 'balance-desc':
      sortedData.sort((a, b) => b.balance - a.balance);
      break;
  }

  return sortedData;
}

// Обработчики событий для поиска и сортировки
function setupEventListeners() {
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    const sortValue = document.getElementById('sortSelect').value;
    
    let filteredData = searchCards(query);
    filteredData = sortCards(filteredData, sortValue);
    
    renderCards(filteredData);
  });

  document.getElementById('sortSelect')?.addEventListener('change', (e) => {
    const query = document.getElementById('searchInput').value.trim();
    const sortValue = e.target.value;
    
    let filteredData = searchCards(query);
    filteredData = sortCards(filteredData, sortValue);
    
    renderCards(filteredData);
  });
}

// Основной запрос данных
fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
  return response.json();
})
.then(data => {
  cardsData = data; // Сохраняем данные в глобальную переменную
  renderCards(data); // Первоначальная отрисовка
  setupEventListeners(); // Настраиваем обработчики событий
})
.catch(error => {
  console.error("Ошибка загрузки данных:", error);
  const container = document.getElementById("cardsContainer");
  if (container) {
    container.innerHTML = "<p>Ошибка загрузки данных. Попробуйте позже.</p>";
  }
});