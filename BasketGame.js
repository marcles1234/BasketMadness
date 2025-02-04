function loadPage(page) {
    const contentDiv = document.getElementById('page-content-wrapper');

    fetch(page)
        .then(response => response.text())
        .then(data => {
            contentDiv.innerHTML = data;
        })
    .catch(error => {
            console.error('Error loading content:', error);
            contentDiv.innerHTML = '<p>Error loading the content.</p>';
        });
    }

    window.onload = loadPage('home.html');

