const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/task-app-api')

// user model

// const User = mongoose.model('User', {
//     name: {
//         type: String
//     },
//     age: {
//         type: Number
//     }
// })

// const me = new User({
//     name: "Erin",
//     age: 32
// })

// me.save().then((me) => {console.log(me)})
//         .catch((error) => {console.log(error)})

// task model
const Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
})

const shower = new Task({
    description: "Have a shower",
    completed: false
})

shower.save().then((task) => {console.log(task)})
            .catch((error) => {console.log(error);})