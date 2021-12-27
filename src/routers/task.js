const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.send(e)
    }
})

router.get('/tasks/:id', async (req, res) => {

    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).send()
        res.send(task)
    } catch(e) {
        res.send(e)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperator) res.status(400).send({error: "Can't update that property"})

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        if (!task) res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (task) return res.status(404).send()
        else return res.send(task)
    } catch {
        res.status(500).send()
    }
})

module.exports = router