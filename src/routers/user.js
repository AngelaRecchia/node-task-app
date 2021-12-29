const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router()
const sharp = require('sharp')
const { sendWelcome, sendBye } = require('../emails/account')

// setup multer to save pics in folder avatars
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // cb (new Error('Wrong file'))
        // cb(undefined, true)
        
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a photo max 1MB'))
        }

        cb(undefined, true)
        
    }
})

// upload profile pic
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

// delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// get profile pic as url
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById({_id: req.params.id})

        if (!user || !user.avatar) throw new Error()

        res.set('Content-Type', 'image/png').send(user.avatar)
    } catch (e) {
        res.status(504).send()
    }
})

//sign up
router.post('/users',  async (req, res) => {
    try {
        const user = new User(req.body)
        // sendWelcome(user.email, user.name)
        const token = await user.generateAuthToken()
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
        // sendBye(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router