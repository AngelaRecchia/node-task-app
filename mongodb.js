const { ObjectID } = require('bson')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const dbName = 'task-app'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if (error) return console.log('Unable to connetct to database!')
    const db = client.db(dbName)

    // insert one record

    // db.collection('users').insertOne({
    //     name: "Angela",
    //     age: 26
    // }, (error, result) => {
    //     if (error) console.log('Unable to insert user')
    //     console.log(result.insertedId);
    // })

    // insert many records

    // db.collection('users').insertMany([
    //     {
    //         name: "Ange",
    //         age: 27
    //     },{
    //         name: "Ange",
    //         age: 27
    //     }], (error, result) => {
    //         if (error) return console.log('Unable to insert user')
    //         console.log(result.insertedIds)
    // })

    // find one element by name
    // db.collection('users').findOne({name: "Ange"}, (error, user) => {
    //     if (error) return console.log('Unable to find user')
    //     console.log(user);
    // })

    // // find one element by id
    // db.collection('users').findOne({_id: new ObjectID("61c307fa6a4299d2a7b8eea5")}, (error, user) => {
    //     if (error) return console.log('Unable to find user')
    //     console.log(user);
    // })

    // find many: find -> to array / count
    // db.collection('users').find({name: "Ange"}).toArray((error, users) => {
    //     console.log(users)
    // })

    // // find task by id
    db.collection('tasks').findOne({_id: new ObjectID("61c30db2edcd4d269b779774")}, (error, task) => {
        if (error) return console.log('Unable to find task')
        console.log(task);
    })

    // find tasks that ara not completed
    db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
        console.log(tasks)
    })

})