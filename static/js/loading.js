window.loading = function(form, isLoading) {
    const loaderId = 'form-loader';
    
    if (isLoading) {
        const loader = document.createElement('div');
        loader.id = loaderId;
        loader.className = 'loader';
        document.body.appendChild(loader);
        
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.dataset.previousHtml = submitButton.innerHTML;
        submitButton.innerHTML = 'Отправка...';
    } else {
        const loader = document.getElementById(loaderId);
        if (loader) loader.remove();
        
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            if (submitButton.dataset.previousHtml) {
                submitButton.innerHTML = submitButton.dataset.previousHtml;
            }
        }
    }
};