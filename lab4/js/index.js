const sortCheckbox = document.getElementById("sort_checkbox");
const searchButton = document.getElementById("search_button");
const countButton = document.getElementById("count_button");
const clearButton = document.getElementById("clear_button");
const findItem = document.getElementById("find_item");
const itemsContainer = document.getElementById("items_container");
const сountClearButton = document.getElementById("count_clear_button");


document.addEventListener("DOMContentLoaded", function () {
    let cards = JSON.parse(localStorage.getItem("cards")) || [];

    let originalOrder = [...cards];

    let filteredCards = [...cards];

    function renderCards(cardArray = filteredCards) {
        itemsContainer.innerHTML = "";

        cardArray.forEach((card, index) => {
            const cardHTML = `
                <li id="card${index + 1}" class="cards__content">
                    <img src="/image/photo_2024-09-22_21-51-58.jpg" alt="" class="cards__img">
                    <div class="cards__body">
                        <h2 id="title" class="cards__title">${card.name}</h2>
                        <p class="cards__parag">${card.description}</p>
                        <p class="cards__price">Price: ${card.cost} $</p>
                        <div class="cards__button">
                            <button class="cards__edit">Edit</button>
                            <button class="cards__remove">Remove</button>
                        </div>
                    </div>
                </li>
            `;

            itemsContainer.insertAdjacentHTML("beforeend", cardHTML);

            const removeButton = itemsContainer.querySelector(`#card${index + 1} .cards__remove`);
            removeButton.addEventListener("click", () => {
                removeCard(card);
            });

            const editButton = itemsContainer.querySelector(`#card${index + 1} .cards__edit`);
            editButton.addEventListener("click", () => {
                editCard(cards.indexOf(card));
            });
        });
    }
    

    function removeCard(card) {
        const cardIndex = cards.indexOf(card); 
        if (cardIndex > -1) {
            cards.splice(cardIndex, 1); 
            filteredCards = filteredCards.filter(item => item !== card); 
            renderCards(filteredCards); 
            localStorage.setItem("cards", JSON.stringify(cards)); 
        }
    }

  
    function editCard(index) {
        localStorage.setItem("editIndex", index);
        localStorage.setItem("editCard", JSON.stringify(cards[index]));
        window.location.href = "/html/edit.html";
    }


    function filterCards() {
        const searchTerm = findItem.value.toLowerCase();
        filteredCards = cards.filter(card => {
            const title = card.name.toLowerCase();
            return title.includes(searchTerm);
        });
        renderCards(filteredCards); 
    }

  
    function sortCardsByPrice(descending = true) {
        if (descending) {
            filteredCards.sort((a, b) => b.cost - a.cost);
        } else {
            filteredCards = [...cards].filter(card => filteredCards.includes(card));
        }

        renderCards(filteredCards); 
    } 
    

    sortCheckbox.addEventListener("change", (event) => {
        const descending = event.target.checked;
        sortCardsByPrice(descending);
    });
    
    
    function calculateTotalPrice() {
        let total = filteredCards.reduce((sum, card) => {
            return sum + parseInt(card.cost);
        }, 0);
        return total;
    }

    
    function displayTotalPrice() {
        let totalPrice = calculateTotalPrice();
        let totalSumElement = document.getElementById("sumprice");
        totalSumElement.textContent = `${totalPrice} $`;
    }

    
    countButton.addEventListener("click", (event) => {
        event.preventDefault();
        displayTotalPrice();
    });

    
    сountClearButton.addEventListener("click", (event) => {
        event.preventDefault();
        let totalSumElement = document.getElementById("sumprice");
        totalSumElement.textContent = "0 $";
    });


    searchButton.addEventListener("click", filterCards);

    
    clearButton.addEventListener("click", () => {
        findItem.value = "";
        filteredCards = [...cards];
        renderCards(filteredCards); 
    });

    renderCards();
    
});





