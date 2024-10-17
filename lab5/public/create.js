const form = document.getElementById("form");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const name = document.getElementById("content__name").value;
    const description = document.getElementById("content__description").value;
    const cost = document.getElementById("content__cost").value;
    
    if (name === "" || description === "" || cost === "") {
        alert("Please fill in all fields.");
        return;
    }

    const newAnimal = { name, description, cost };

    // Надсилаємо запит на сервер для створення нової картки
    fetch('/api/animals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnimal),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Animal created:', data);
        window.location.href = 'index.html';  // Після створення картки переходимо на index
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
