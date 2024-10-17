const nameInput = document.getElementById("content__name");
const descriptionInput = document.getElementById("content__description");
const costInput = document.getElementById("content__cost");
const submitButton = document.getElementById("submit__button");


document.addEventListener("DOMContentLoaded", function () {
    const cardData = JSON.parse(localStorage.getItem("editCard"));
    
    if (cardData) {
        nameInput.value = cardData.name;
        descriptionInput.value = cardData.description;
        costInput.value = cardData.cost;
    }

    // Обробник події для кнопки Submit
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        
        // Оновлюємо дані картки
        const updatedCard = {
            name: nameInput.value,
            description: descriptionInput.value,
            cost: costInput.value,
        };

        const editIndex = localStorage.getItem("editIndex");
        const cards = JSON.parse(localStorage.getItem("cards"));
        
        cards[editIndex] = updatedCard; // Оновлюємо дані картки

        // Зберігаємо оновлений масив карток
        localStorage.setItem("cards", JSON.stringify(cards));

        // Видаляємо непотрібні дані з sessionStorage
        localStorage.removeItem("editIndex");
        localStorage.removeItem("editCard");

        // Переходимо на головну сторінку після редагування
        window.location.href = "index.html";
    });
});
