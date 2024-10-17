const sortCheckbox = document.getElementById("sort_checkbox");
const searchButton = document.getElementById("search_button");
const countButton = document.getElementById("count_button");
const clearButton = document.getElementById("clear_button");
const findItem = document.getElementById("find_item");
const сountClearButton = document.getElementById("count_clear_button");

let cards = document.querySelectorAll(".cards__content");

let originalOrder = Array.from(cards);

let cardPrice = Array.from(cards).map(card => {
  return {
    element: card,
    price: parseInt(card.querySelector(".cards__price").textContent.replace("Price: ", "", "$"))
  };
});

function sortCardsByPrice(descending = true) {
  if (descending) {
    cardPrice.sort((a, b) => b.price - a.price);
  } else {
    cardPrice = originalOrder.map(card => {
      return {
        element: card,
        price: parseInt(card.querySelector(".cards__price").textContent.replace("Price: ", "", "$"))
      };
    });
  }

  let container = document.querySelector(".cards");
  cardPrice.forEach(cardObj => {
    container.appendChild(cardObj.element);
  });
}

sortCheckbox.addEventListener("change", (event) => {
  const descending = event.target.checked;
  sortCardsByPrice(descending);
});

function filterCards() {
    const searchTerm = findItem.value.toLowerCase(); 
    
    let filteredCards = Array.from(cards).filter(card => {
        const title = card.querySelector("h2").textContent.toLowerCase();
        return title.includes(searchTerm);
    });
    
    cards.forEach(card => card.style.display = "none");
    
    filteredCards.forEach(card => card.style.display = "block");
}

searchButton.addEventListener("click", filterCards);

clearButton.addEventListener("click", () => {
  findItem.value = "";
  filterCards();
});



function calculateTotalPrice() {
    let total = cardPrice.reduce((sum, cardObj) => {
        if (cardObj.element.style.display !== "none") {
            return sum + cardObj.price;
        }
        return sum;
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
    totalSumElement.textContent = "0";
});