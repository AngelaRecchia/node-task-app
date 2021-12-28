const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

//sign up
router.post('/users',  async (req, res) => {
    const user = new User(req.body)
    const token = await user.generateAuthToken()

    try {
        await user.save()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
    
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.send(e)
    // })
})

// login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

// log out
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
    
})

// log out from all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logged out from all sessions')
    } catch (e) {
        res.status(500).send()
    }
})

// get user profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// update user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperator) {
        return res.status(400).send({error: "Can't update that property"})
    }

    try {
     
        let user = req.user
        if (!user) return res.status(404).send() 

        updates.forEach(update => {
            user[update] = req.body[update]
        })
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router