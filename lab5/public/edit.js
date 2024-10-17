const form = document.getElementById("form");
const index = localStorage.getItem("editIndex");
const animal = JSON.parse(localStorage.getItem("editCard"));
document.getElementById("content__name").value = animal.name;
document.getElementById("content__description").value = animal.description;
document.getElementById("content__cost").value = animal.cost;


document.addEventListener("DOMContentLoaded", function () {

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const updatedAnimal = {
            name: document.getElementById("content__name").value,
            description: document.getElementById("content__description").value,
            cost: document.getElementById("content__cost").value,
        };

        fetch(`/api/animals/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAnimal),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Animal updated:', data);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});