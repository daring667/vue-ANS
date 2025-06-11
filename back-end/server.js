const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/products/electronic', express.static(__dirname + '/src/data/electronic'));

const readUsers = () => {
    try {
        const usersPath = './src/data/users.json';
        const usersData = fs.readFileSync(usersPath, 'utf8');
        return JSON.parse(usersData);
    } catch (error) {
        console.error('Error reading users file:', error);
        return []; 
    }
};

const writeUsers = (users) => {
    try {
        const usersPath = './src/data/users.json';
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing users file:', error);
    }
};

app.get('/', (req, res) => {
    res.send('Welcome to the Neo-commerce Backend API!');
});

app.get('/api/products/get-products', (req, res) => {
    try {
        const productsPath = './src/data/electronic/products.json';
        const productsData = fs.readFileSync(productsPath, 'utf8');
        const products = JSON.parse(productsData);
        res.json(products);
    } catch (error) {
        console.error('Error reading products file:', error);
        res.status(500).json({ message: 'Error loading products' });
    }
});

app.post('/api/users/register', (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Email, password, and password confirmation are required.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    let users = readUsers();

    if (users.some(user => user.email === email)) {
        return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        email: email,
        password: password
    };

    users.push(newUser);
    writeUsers(users); 

    res.status(201).json({ message: 'User registered successfully. Please sign in.', user: { id: newUser.id, email: newUser.email } });
});

app.post('/api/users/sign-in', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password); 

    if (user) {
        res.status(200).json({
            message: 'Sign-in successful.',
            token: `dummy_jwt_for_${user.id}`,
            user: { id: user.id, email: user.email }
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password.' });
    }
});

app.post('/api/orders/add-order', (req, res) => {
    const { userId, items, total } = req.body;
    
    if (!userId || !items || items.length === 0 || !total) {
        return res.status(400).json({ message: 'User ID, items, and total are required for an order.' });
    }

    const ordersPath = './src/data/orders.json';
    let orders = [];
    try {
        orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    } catch (e) {
    }

    const newOrder = {
        id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
        userId: userId,
        items: items,
        total: total,
        date: new Date().toISOString()
    };
    orders.push(newOrder);
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2), 'utf8');

    console.log(`Order added for userId ${userId}:`, newOrder);
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
});

app.get('/api/orders/get-orders/:idUser', (req, res) => {
    const userId = parseInt(req.params.idUser); 

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid User ID provided.' });
    }

    const ordersPath = './src/data/orders.json';
    let orders = [];
    try {
        orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    } catch (e) {
        // Файла нет или пуст
    }

    const userOrders = orders.filter(order => order.userId === userId);

    res.status(200).json(userOrders);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
});

// Получить избранное пользователя
app.get('/api/favorites/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const favoritesPath = './src/data/favorites.json';
    let favorites = [];
    try {
        favorites = JSON.parse(fs.readFileSync(favoritesPath, 'utf8'));
    } catch (e) {}
    const userFavorites = favorites.filter(fav => fav.userId === userId);
    res.json(userFavorites);
});

// Добавить/удалить товар в избранное
app.post('/api/favorites/toggle', (req, res) => {
    const { userId, product } = req.body;
    if (!userId || !product) {
        return res.status(400).json({ message: 'userId и product обязательны.' });
    }
    const favoritesPath = './src/data/favorites.json';
    let favorites = [];
    try {
        favorites = JSON.parse(fs.readFileSync(favoritesPath, 'utf8'));
    } catch (e) {}

    const exists = favorites.some(fav => fav.userId === userId && fav.product.id === product.id);
    if (exists) {
        favorites = favorites.filter(fav => !(fav.userId === userId && fav.product.id === product.id));
    } else {
        favorites.push({ userId, product });
    }
    fs.writeFileSync(favoritesPath, JSON.stringify(favorites, null, 2), 'utf8');
    res.json({ success: true, favorites });
});