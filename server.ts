import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import Logger from './middleware/Logger'
import task1 from './routes/task1'
import task2 from './routes/protectedRoute'
import task3 from './routes/factorial'
const app = new Koa()

const PORT = process.env.PORT || 3000

app.use(bodyParser())
app.use(Logger)
app.use(task1.routes()).use(task1.allowedMethods())
app.use(task2.routes()).use(task2.allowedMethods())
app.use(task3.routes()).use(task3.allowedMethods())

const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})

export default server
