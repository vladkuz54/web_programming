const itemsContainer = document.getElementById("items_container");
const searchButton = document.getElementById("search_button");
const clearButton = document.getElementById("clear_button");

const countButton = document.getElementById("count_button");
const countClearButton = document.getElementById("count_clear_button");
const totalSumElement = document.getElementById("sumprice");


document.addEventListener("DOMContentLoaded", function () {
    const sortCheckBox = document.getElementById("sort_checkbox");

    let animals = [];
    let filteredAnimals = [];
    let originalOrder = [];

    fetch('/api/animals')
        .then(response => response.json())
        .then(data => {
            animals = data;
            filteredAnimals = [...animals];
            originalOrder = [...animals];
            renderCards(filteredAnimals);
        })
        .catch(error => {
            console.error('Помилка при завантаженні тварин:', error);
        });

    function renderCards(animalsToRender) {
        itemsContainer.innerHTML = "";
        if (animalsToRender.length === 0) {
            itemsContainer.innerHTML = "<p>No animals found</p>";
        } else {
            animalsToRender.forEach((animal, index) => {
                const cardHTML = `
                    <li class="cards__content">
                        <img src="/image/photo_2024-09-22_21-51-58.jpg" alt="" class="cards__img">
                        <h2>${animal.name}</h2>
                        <p>${animal.description}</p>
                        <p>Price: ${animal.cost} $</p>
                        <button class="cards__edit" data-index="${index}">Edit</button>
                        <button class="cards__remove" data-index="${index}">Remove</button>
                    </li>`
                ;
                itemsContainer.insertAdjacentHTML("beforeend", cardHTML);
            });
        }
        addEditRemoveListeners();
    }

    function addEditRemoveListeners() {
        document.querySelectorAll('.cards__edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                localStorage.setItem("editIndex", index);
                localStorage.setItem("editCard", JSON.stringify(filteredAnimals[index]));
                window.location.href = "edit.html";
            });
        });

        document.querySelectorAll('.cards__remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                fetch(`/api/animals/${index}`, { method: 'DELETE' })
                    .then(() => {
                        filteredAnimals.splice(index, 1);  
                        renderCards(filteredAnimals); 
                    })
                    .catch(error => {
                        console.error('Помилка при видаленні тваринки:', error);
                    });
            });
        });
    }

    function calculateTotalPrice() {
        fetch('/api/animals/total-price')
            .then(response => response.json())
            .then(data => {
                totalSumElement.textContent = `${data.total} $`;  
            })
            .catch(error => {
                console.error('Помилка при підрахунку загальної ціни:', error);
            });
    }

    countClearButton.addEventListener("click", (event) => {
        event.preventDefault();
        fetch('/api/animals/clear-total', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                totalSumElement.textContent = `${data.total} $`; 
            })
            .catch(error => {
                console.error('Помилка при очищенні загальної ціни:', error);
            });
    });

    countButton.addEventListener("click", (event) => {
        event.preventDefault();
        calculateTotalPrice();
    });

    searchButton.addEventListener("click", () => {
        const searchTerm = document.getElementById("find_item").value.trim().toLowerCase();
        fetch(`/api/animals/search?name=${searchTerm}`)
            .then(response => response.json())
            .then(filtered => {
                filteredAnimals = filtered;
                originalOrder = [...filteredAnimals];
                renderCards(filteredAnimals);
            })
            .catch(error => {
                console.error('Помилка при пошуку:', error);
            });
    });

    clearButton.addEventListener("click", () => {
        document.getElementById("find_item").value = '';
        fetch(`/api/animals/search?name=`)
            .then(response => response.json())
            .then(filteredAnimals => {
                renderCards(filteredAnimals);
            })
            .catch(error => {
                console.error('Помилка при очищенні пошуку:', error);
            });
    });

    sortCheckBox.addEventListener("change", () => {
        let sortOrder;
        
        console.log("Чекбокс стан: ", sortCheckBox.checked);

        if (sortCheckBox.checked) {
            sortOrder = 'desc';  
        } else {
            sortOrder = 'index';  
        }
  
        fetch(`/api/animals/sort?order=${sortOrder}`)
            .then(response => response.json())
            .then(sortedAnimals => {
                filteredAnimals = sortedAnimals; 
                renderCards(filteredAnimals);    
            })
            .catch(error => {
                console.error('Помилка при сортуванні:', error);
            });
    });
    


});