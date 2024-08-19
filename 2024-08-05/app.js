const express = require('express')

const app = express();
const users = [
    { id: 1, name: 'Matheus', status: 'Estudando' },
    { id: 2, name: 'Alice', status: 'Disponível' },
     { id: 3, name: 'Marina', status: 'Ocupada' },
      { id: 4, name: 'Lucca', status: 'Nenhum' }
]

/*app.get('/api/users', (req, res) => {
    return res.status(200).json(users)
})*/

//Route params
app.get('/api/users/:id', (req, res) => {
    console.log(req.params)
    const id = parseInt(req.params.id);
    console.log(id)

    if (isNaN(id)) {
        return res.status(404).json({ error: 'O ID do usuário deve ser um número.' })
    }

    const user = users.find(user => user.id === id)
    console.log(user)
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' })
    }

    return res.status(200).json(user)
})

//Get localhost:3000/api/users
app.get('/api/users', (req, res) => {
    //Query params
    console.log(req.query);

    const status = req.query.status

    if (status) {
        return res.status(200).json(users.filter(user => user.status === status))
    }

    return res.status(200).json(users)
})

//Express JSON - Configurar servidor para receber dados JSON
app.use(express.json())

//Post localhost:3000/api/users
app.post('/api/users', (req, res) => {
    console.log(req.body);

    const {body} = req;
    const id = users.length + 1;
    const newUser = {  id, ...body };
    users.push(newUser);

    return res.status(201).json(newUser);
});

//Delete
app.delete("/api/users/:id", (req, res) => {
    console.log(req.params);
    const id = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === id)
    if (index === -1) {
        return res.sendStatus(404)
    }

    users.splice(index, 1);
    return res.sendStatus(204)
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000!')
})
