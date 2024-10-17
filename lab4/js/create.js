const form = document.getElementById("form");
const nameInput = document.getElementById("content__name");
const descriptionInput = document.getElementById("content__description");
const costInput = document.getElementById("content__cost");
const editButton = document.getElementById("edit_button");


form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInputValue = nameInput.value.trim();
    const descriptionInputValue = descriptionInput.value.trim();
    const costInputValue = costInput.value.trim();
    
    if (nameInputValue === "" || descriptionInputValue === "" || costInputValue === "") {
        alert("Please fill in all fields.");
        return;
    }
    
    if (isNaN(costInputValue)) {
        alert("Please fill a number in cost.");
        return;
    }

    let cards = JSON.parse(localStorage.getItem("cards")) || [];

    const newCard = {
        name: nameInputValue,
        description: descriptionInputValue,
        cost: costInputValue
    };

    cards.push(newCard);
    localStorage.setItem("cards", JSON.stringify(cards));
    form.reset();
    window.location.href = "/html/index.html";
});

