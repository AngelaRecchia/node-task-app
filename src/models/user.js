const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
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
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) throw new Error("Invalid email")
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 7,
            validate(value) {
                if (value.includes('password')) throw new Error("Password cannot be 'password")
            },
            trim: true
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
})

// set relationship with tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    let userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

// create method: on instance user
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({_id: this._id.toString()}, 'thisisastring')

    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

//create new method: on User
userSchema.statics.findByCredentials = async (email, password)=> {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login on pws')
    }

    return user
}


userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User