const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFilePath = path.join(__dirname, 'public', 'animals.json');
const sortFilePath = path.join(__dirname, 'public', 'animals_sort.json');

// Читання з файлу
const readAnimalsFromFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

// Запис у файл
const writeAnimalsToFile = (filePath, animals) => {
    fs.writeFileSync(filePath, JSON.stringify(animals, null, 2));
};

// Завантажити всіх тварин з animals_sort.json
app.get('/api/animals', (req, res) => {
    const animalsSort = readAnimalsFromFile(sortFilePath);
    if (animalsSort.length === 0) {
        const animals = readAnimalsFromFile(dataFilePath);
        writeAnimalsToFile(sortFilePath, animals); // Якщо порожньо, копіюємо дані
        res.json(animals);
    } else {
        res.json(animalsSort);
    }
});

// Оновити animals_sort.json після пошуку
app.get('/api/animals/search', (req, res) => {
    const searchTerm = req.query.name ? req.query.name.toLowerCase() : '';
    const animals = readAnimalsFromFile(dataFilePath);
    let filteredAnimals = animals.filter(animal => 
        animal.name.toLowerCase().includes(searchTerm)
    );

    // Якщо пошук порожній, повертаємо всі тваринки
    if (!searchTerm) {
        filteredAnimals = animals;
    }

    writeAnimalsToFile(sortFilePath, filteredAnimals);
    res.json(filteredAnimals);
});

app.get('/api/animals/sort', (req, res) => {
    const sortOrder = req.query.order === 'desc' ? 'desc' : 'index';  // Перевіряємо напрямок сортування
    const animals = readAnimalsFromFile(sortFilePath);  // Читаємо тваринок із оригінального файлу

    let sortedAnimals;
    if (sortOrder === 'desc') {
        // Сортуємо за ціною від більшого до меншого
        sortedAnimals = animals.sort((a, b) => b.cost - a.cost);
    } else {
        // Повертаємо початковий порядок, який відповідає індексам
        sortedAnimals = animals.sort((a, b) => animals.indexOf(a) - animals.indexOf(b));
    }

    res.json(sortedAnimals);  // Повертаємо відсортовані тваринки або за ціною, або за індексом
});


// Підрахунок загальної ціни
app.get('/api/animals/total-price', (req, res) => {
    const animals = readAnimalsFromFile(sortFilePath);
    const totalPrice = animals.reduce((sum, animal) => sum + parseInt(animal.cost), 0);
    res.json({ total: totalPrice });
});


// Створення нової картки (POST запит)
app.post('/api/animals', (req, res) => {
    const newAnimal = req.body;
    const animals = readAnimalsFromFile(dataFilePath);
    animals.push(newAnimal);  // Додаємо нову картку до масиву
    writeAnimalsToFile(dataFilePath, animals);  // Записуємо оновлений масив у файл
    writeAnimalsToFile(sortFilePath, animals);  // Оновлюємо також animals_sort.json
    res.status(201).json(newAnimal);  // Повертаємо створену картку
});

// Оновлення картки (PUT запит)
app.put('/api/animals/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    const updatedAnimal = req.body;
    const animals = readAnimalsFromFile(dataFilePath);

    if (index >= 0 && index < animals.length) {
        animals[index] = updatedAnimal;  // Оновлюємо картку в масиві
        writeAnimalsToFile(dataFilePath, animals);  // Записуємо оновлений масив у файл
        writeAnimalsToFile(sortFilePath, animals);  // Оновлюємо також animals_sort.json
        res.json(updatedAnimal);  // Повертаємо оновлену картку
    } else {
        res.status(404).send('Animal not found');  // Повертаємо помилку, якщо картку не знайдено
    }
});


app.delete('/api/animals/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    let animals = readAnimalsFromFile(dataFilePath);
    let sortedAnimals = readAnimalsFromFile(sortFilePath);

    if (index >= 0 && index < animals.length) {
        animals.splice(index, 1);
        writeAnimalsToFile(dataFilePath, animals);

        sortedAnimals.splice(index, 1);
        writeAnimalsToFile(sortFilePath, sortedAnimals);

        res.status(204).send();
    } else {
        res.status(404).send('Animal not found');
    }
});

app.post('/api/animals/clear-total', (req, res) => {
    res.json({ total: 0 });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
