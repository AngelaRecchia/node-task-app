const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://localhost:27017/task-app-api')

// user model

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error ("Age must me a positive number")
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("Invalid email")
        }
    }
})

const me = new User({
    name: "Mia    ",
    email: "fa@laJJJBJa.it"
})

me.save().then((me) => {console.log(me)})
        .catch((error) => {console.log(error)})

// task model
// const Task = mongoose.model('Task', {
//     description: {
//         type: String
//     },
//     completed: {
//         type: Boolean
//     }
// })

// const shower = new Task({
//     description: "Have a shower",
//     completed: false
// })

// shower.save().then((task) => {console.log(task)})
//             .catch((error) => {console.log(error);})