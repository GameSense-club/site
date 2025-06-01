function showPC() {
    const jwtToken = getCookie('jwt_token');

    fetch('https://api.game-sense.net/pc', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("pcContainer");
        const dropdownContainer = document.getElementById("dropdownContainer");

        // Очищаем контейнеры перед добавлением новых элементов
        container.innerHTML = '';
        dropdownContainer.innerHTML = '';

        // Сортируем компьютеры по number_pc
        data.sort((a, b) => a.number_pc - b.number_pc);

        data.forEach(item => {
            const pc = document.createElement("div");
            pc.className = "pc";
            pc.id = item.id;
            pc.setAttribute('dropdown', `dropdown${item.id}`);

            // Функция для добавления 4 часов к времени
            function add4Hours(datetime) {
                if (!datetime) return datetime;
                
                const date = new Date(datetime);
                date.setHours(date.getHours() + 10);
                return date.toISOString().slice(0, 16);
            }

            const dropdown = document.createElement("div");
            dropdown.id = `dropdown${item.id}`;
            dropdown.className = "dropdown-content";
            dropdown.innerHTML = `
                <h4>Компьютер: ${item.number_pc}</h4>
                <input type="datetime-local" id="timeActive" value="${add4Hours(item.time_active)}">
                <select id="statusPC">
                    <option value="активен">Активен</option>
                    <option value="занят">Занят</option>
                    <option value="заблокирован">Заблокирован</option>
                    <option value="ремонт">На ремонте</option>
                </select>
            `;

            // Устанавливаем выбранное значение в зависимости от item.status
            const statusSelect = dropdown.querySelector('#statusPC');
            if (statusSelect) {
                statusSelect.value = item.status;
            }

            if (item.status === "занят") {
                pc.innerHTML = `<p class="iconoir-computer"></p>`;
                pc.classList.add("employ");
            }
            else if (item.status === "ремонт") {
                pc.innerHTML = `<p class="iconoir-pc-no-entry"></p>`;
                pc.classList.add("fix");
            }
            else {
                pc.innerHTML = `<p class="iconoir-pc-check"></p>`;
                pc.classList.add("active");
            }
            
            container.appendChild(pc); 
            dropdownContainer.appendChild(dropdown);

            // Добавляем обработчики событий для автоматической отправки данных
            const timeInput = dropdown.querySelector('#timeActive');
            statusSelect.addEventListener('change', () => sendUpdate(item.token, statusSelect.value, timeInput.value));
            timeInput.addEventListener('change', () => sendUpdate(item.token, statusSelect.value, timeInput.value));
        });
    })
    .catch(error => {
        console.log(error);
    });
}

// Модифицированная функция для отправки данных на сервер
function sendUpdate(token, status, time) {
    const jwtToken = getCookie('jwt_token');
    if (status === "занят" || time === null) {
        time = "2125-06-01T23:46"
    }
    if (status === "активен") {
        time = "1125-06-01T23:46"
    }
    const data = {
        token: token,
        status: status,
        time: time
    };

    fetch('https://api.game-sense.net/pc/status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(responseData => {
        // Обновляем интерфейс после успешной отправки
        showPC();
    })
    .catch(error => {
        console.log(error);
    });
}

showPC();