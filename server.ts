import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import auth from './middleware/Auth'
import task1 from './routes/task1'
import task2 from './routes/task2'
const app = new Koa()

const PORT = process.env.PORT || 3000

app.use(bodyParser())
app.use(auth)
app.use(task1.routes()).use(task1.allowedMethods())
app.use(task2.routes()).use(task1.allowedMethods())

const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})

export default server
