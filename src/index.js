const app = require('./app')
const port = process.env.PORT

// maintenance mode
// app.use((req, res, next) => {
//     res.status(503).send('Site under maintenance')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Server is up on port ", port)
}) 