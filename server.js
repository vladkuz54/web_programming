import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import User from './src/models/User.js';
import Cart from './src/models/Cart.js';
import initDb from './src/initDb.js';

const app = express();
const PORT = 5000;

app.use(express.json());

initDb();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getCards = async () => {
  const filePath = path.join(__dirname, 'src/api/Cards.json');
  try {
    await fs.access(filePath);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error accessing or reading Cards.json:', error);
    throw error;
  }
};

app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/cards', async (req, res) => {
  try {
    const { limit = 3, offset = 0 } = req.query;
    const cards = await getCards();
    const paginatedCards = cards.slice(Number(offset), Number(offset) + Number(limit));

    res.json(paginatedCards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load cards' });
  }
});

app.get('/api/cards-catalog', async (req, res) => {
  try {
    const { searchTerm = '', sortType = 'none', sortFeat = 'none', sortOrder = 'descending' } = req.query;
    let cards = await getCards();

    if (searchTerm) {
      cards = cards.filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (sortType !== 'none') {
      cards = cards.filter(card => card.type === sortType);
    }

    if (sortFeat !== 'none') {
      cards = cards.sort((a, b) => {
        if (sortFeat === 'price') {
          return sortOrder === 'descending' ? b.price - a.price : a.price - b.price;
        }
        if (sortFeat === 'name') {
          return sortOrder === 'descending' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
        }
        return 0;
      });
    }

    await delay(500);

    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load cards' });
  }
});

app.get('/api/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cards = await getCards();
    const card = cards.find(card => card.id === parseInt(id, 10));

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    await delay(500);

    res.json(card);
  } catch (error) {
    console.error('Error loading card:', error);
    res.status(500).json({ error: 'Failed to load card' });
  }
});

app.patch('/api/cards', async (req, res) => {
  const { id, color, amount } = req.body;
  const filePath = path.join(__dirname, 'src/api/Cards.json');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const cards = JSON.parse(data);

    const card = cards.find(card => card.id === id);
    if (card) {
      const stockItem = card.stock.find(item => item.color === color);
      if (stockItem) {
        stockItem.amount -= amount;
        if (stockItem.amount < 0) {
          stockItem.amount = 0;
        }
      }
    }

    await fs.writeFile(filePath, JSON.stringify(cards, null, 2));
    res.json({ success: true, updatedCard: card });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

app.patch('/api/update-stock', async (req, res) => {
  const { id, color, amount } = req.body;
  const filePath = path.join(__dirname, 'src/api/Cards.json');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const cards = JSON.parse(data);

    const card = cards.find(card => card.id === id);
    if (card) {
      const stockItem = card.stock.find(item => item.color === color);
      if (stockItem) {
        stockItem.amount += amount;
        if (stockItem.amount < 0) {
          stockItem.amount = 0;
        }
      }
    }

    await fs.writeFile(filePath, JSON.stringify(cards, null, 2));
    res.json({ success: true, updatedCard: card });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

app.patch('/api/clear-cart', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const user = await User.findOne({ where: { email: token } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const cart = await Cart.findOne({ where: { user_id: user.id } });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    await Cart.create({ user_id: user.id, items: [] });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    let cart = await Cart.findOne({ where: { user_id: user.id } });
    if (!cart) {
      await Cart.create({ user_id: user.id, items: [] });
    }
    res.status(200).json({ token: email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/user', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const user = await User.findOne({ where: { email: token } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user-info', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const user = await User.findOne({ where: { email: token } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/cart', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { items } = req.body;
  try {
    const user = await User.findOne({ where: { email: token } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    let cart = await Cart.findOne({ where: { user_id: user.id } });
    if (cart) {
      cart.items = items.length ? items : [];
      await cart.save();
    } else {
      cart = await Cart.create({ user_id: user.id, items: items.length ? items : [] });
    }
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cart', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const user = await User.findOne({ where: { email: token } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const cart = await Cart.findOne({ where: { user_id: user.id } });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cart', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const user = await User.findOne({ where: { email: token } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const cart = await Cart.findOne({ where: { user_id: user.id } });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    await cart.destroy();
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/cart/remove-item', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { itemId, itemColor } = req.body;
  try {
    const user = await User.findOne({ where: { email: token } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const cart = await Cart.findOne({ where: { user_id: user.id } });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    cart.items = cart.items.filter(item => !(item.id === itemId && item.color === itemColor));
    await cart.save();
    res.status(200).json({ message: 'Item removed successfully', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

initDb();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});