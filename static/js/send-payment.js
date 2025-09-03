
document.addEventListener('DOMContentLoaded', function() {
    const paymentButtons = document.querySelectorAll('.payment-methods button');
    const amountInput = document.getElementById('amount');
    const confirmBtn = document.getElementById('confirm-btn');

    paymentButtons.forEach(button => {
        button.addEventListener('click', function() {
            paymentButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            validateForm();
        });
    });

    // Обработчик ввода суммы
    amountInput.addEventListener('input', validateForm);

    // Проверка условий активации кнопки
    function validateForm() {
        const isMethodSelected = document.querySelector('.payment-methods .active') !== null;
        const amount = parseFloat(amountInput.value);
        const isAmountValid = !isNaN(amount) && amount > 0 && amount <= 10000;

        if (isMethodSelected && isAmountValid) {
            confirmBtn.classList.remove('deactivate');
        } else {
            confirmBtn.classList.add('deactivate');
        }
    }

    // Обработчик подтверждения (отправка данных)
    confirmBtn.addEventListener('click', function() {
        if (!this.classList.contains('deactivate')) {
            const method = document.querySelector('.payment-methods .active').dataset.method;
            const amount = amountInput.value;
            
            // Здесь будет ваша логика отправки данных
            console.log('Отправка данных:', {
                paymentMethod: method,
                amount: amount
            });
            
            // sendToCashRegister(method, amount);
        }
    });
});