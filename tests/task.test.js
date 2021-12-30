const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOneId, userOne, userTwo, taskOne, setUpDB} = require('./fixtures/db')

// runs before every test: wipe users from DB, adds default one
beforeEach(setUpDB)

test('Should create task for user', async() => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "From testing"
        })
        .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should get all task - owner', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const tasks = await Task.find({owner: userOneId})
    expect(response.body.length).toEqual(2)
})

// userTwo fails to delete taskOne (userOne)
test('Should not delete other users tasks', async() => {
    const response = await request(app)
        .delete(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404)

        const task = await Task.findById(taskOne._id)
        expect(task).not.toBeNull()

})