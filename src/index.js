const express = require('express')
require('./DB/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then(() => {
        res.status(201).send(user)
    }).catch((e) => {
        res.send(e)
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.send(e)
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch(() => {})
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id
    User.findById(_id).then((user) => {
        if (!user) return res.status(404).send()
        res.send(user)
    }).catch((e) => {
        res.send(e)
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.send(e)
    })
})

app.get('/tasks/:id', (req, res) => {
    Task.findById(req.params.id).then((task) => {
        if (!task) return res.status(404).send()
        res.send(task)
    }).catch((e) => {
        res.send(e)
    })
})

app.listen(port, () => {
    console.log("Server is up on port ", port);
}) 