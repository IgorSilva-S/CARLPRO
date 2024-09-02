const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware para registrar chamadas à API
const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
};
app.use(loggingMiddleware);

// Middleware para analisar corpo JSON
app.use(bodyParser.json());

// Array de produtos (substitua com sua base de dados real)
const products = [];

// Middleware para encontrar um produto por ID
const findProductById = (req, res, next) => {
    const id = Number(req.params.id);
    const product = products.find((product) => product.id === id);
    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }
    req.product = product;
    next();
};

// Rotas

// POST: Cadastrar um produto
app.post('/products', (req, res) => {
    const { id, name, brand, price, stock, category, ratings, registrationDate } = req.body;

    if (!id || !name || !brand || !price || !stock || !category || !ratings || !registrationDate) {
        return res.status(400).json({ message: 'Dados do produto são inválidos' });
    }

    const existingProduct = products.find((product) => product.id === id);
    if (existingProduct) {
        return res.status(400).json({ message: 'Produto com esse ID já existe' });
    }

    const newProduct = { id, name, brand, price, stock, category, ratings, registrationDate };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// DELETE: Deletar um produto
app.delete('/products/:id', findProductById, (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex((product) => product.id === id);
    products.splice(index, 1);
    res.status(204).end();
});

// GET: Listar todos os produtos
app.get('/products', (req, res) => {
    try {
        const { name, price, rating, sortBy = 'registrationDate', sortOrder = 'asc' } = req.query;

        let filteredProducts = products;

        if (name) {
            filteredProducts = filteredProducts.filter((product) => product.name.includes(name));
        }
        if (price) {
            filteredProducts = filteredProducts.filter((product) => product.price < Number(price));
        }
        if (rating) {
            filteredProducts = filteredProducts.filter((product) => 
                product.ratings.reduce((acc, curr) => acc + curr, 0) / product.ratings.length > Number(rating)
            );
        }

        filteredProducts.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        });

        res.json(filteredProducts);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar produtos' });
    }
});

// GET: Buscar produto por ID
app.get('/products/:id', findProductById, (req, res) => {
    res.json(req.product);
});

// PUT: Atualizar todos os dados de um produto
app.put('/products/:id', findProductById, (req, res) => {
    const id = Number(req.params.id);
    const updatedProduct = req.body;


    const index = products.findIndex((product) => product.id === id);
    products[index] = { ...req.product, ...updatedProduct };

    res.json(products[index]);
});

// PATCH: Atualizar o preço de um produto
app.patch('/products/:id/price', findProductById, (req, res) => {
    try {
        const id = Number(req.params.id);
        const { discount } = req.body;
        if (typeof discount !== 'number' || discount < 0 || discount > 100) {
            return res.status(400).json({ message: 'Desconto inválido' });
        }

        const product = products.find((product) => product.id === id);
        product.price *= (1 - discount / 100);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o preço' });
    }
});

// PATCH: Atualizar o estoque de um produto
app.patch('/products/:id/stock', findProductById, (req, res) => {
    try {
        const id = Number(req.params.id);
        const { quantity } = req.body;
        if (typeof quantity !== 'number') {
            return res.status(400).json({ message: 'Quantidade inválida' });
        }

        const product = products.find((product) => product.id === id);
        product.stock += quantity;
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o estoque' });
    }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message });
});

// Inicialização do servidor
app.listen(3000, () => {
    console.log('API started on port 3000');
});
