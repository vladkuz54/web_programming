const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFilePath = path.join(__dirname, 'public', 'animals.json');
const sortFilePath = path.join(__dirname, 'public', 'animals_sort.json');

const readAnimalsFromFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

const writeAnimalsToFile = (filePath, animals) => {
    fs.writeFileSync(filePath, JSON.stringify(animals, null, 2));
};

app.get('/api/animals', (req, res) => {
    const animalsSort = readAnimalsFromFile(sortFilePath);
    if (animalsSort.length === 0) {
        const animals = readAnimalsFromFile(dataFilePath);
        writeAnimalsToFile(sortFilePath, animals); 
        res.json(animals);
    } else {
        res.json(animalsSort);
    }
});

app.get('/api/animals/search', (req, res) => {
    const searchTerm = req.query.name ? req.query.name.toLowerCase() : '';
    const animals = readAnimalsFromFile(dataFilePath);
    let filteredAnimals = animals.filter(animal => 
        animal.name.toLowerCase().includes(searchTerm)
    );

    if (!searchTerm) {
        filteredAnimals = animals;
    }

    writeAnimalsToFile(sortFilePath, filteredAnimals);
    res.json(filteredAnimals);
});

app.get('/api/animals/sort', (req, res) => {
    const sortOrder = req.query.order === 'desc' ? 'desc' : 'index';  
    const animals = readAnimalsFromFile(sortFilePath); 

    let sortedAnimals;
    if (sortOrder === 'desc') {
        sortedAnimals = animals.sort((a, b) => b.cost - a.cost);
    } else {
        sortedAnimals = animals.sort((a, b) => animals.indexOf(a) - animals.indexOf(b));
    }

    res.json(sortedAnimals);
});


app.get('/api/animals/total-price', (req, res) => {
    const animals = readAnimalsFromFile(sortFilePath);
    const totalPrice = animals.reduce((sum, animal) => sum + parseInt(animal.cost), 0);
    res.json({ total: totalPrice });
});


app.post('/api/animals', (req, res) => {
    const newAnimal = req.body;
    const animals = readAnimalsFromFile(dataFilePath);
    animals.push(newAnimal);  
    writeAnimalsToFile(dataFilePath, animals);  
    writeAnimalsToFile(sortFilePath, animals);  
    res.status(201).json(newAnimal); 
});

app.put('/api/animals/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    const updatedAnimal = req.body;
    const animals = readAnimalsFromFile(dataFilePath);

    if (index >= 0 && index < animals.length) {
        animals[index] = updatedAnimal;  
        writeAnimalsToFile(dataFilePath, animals);  
        writeAnimalsToFile(sortFilePath, animals);  
        res.json(updatedAnimal);  
    } else {
        res.status(404).send('Animal not found');  
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
