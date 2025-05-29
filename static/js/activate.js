function activate_package(id_product) {
    const pc_token = getCookie('pc_token');
    const data = { 
        id: id_product, 
        type: "time_packages",
        quality: 1,
        token: `${pc_token}`
         };

    fetch('https://api.game-sense.net/activate_product', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json()
                .then(errorData => {
                    const errorMessage = errorData.error;
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