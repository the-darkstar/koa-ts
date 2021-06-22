import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import routes from './routes/routes'
const app = new Koa()

const PORT = process.env.PORT || 3000

app.use(bodyParser())
app.use(routes.routes())

const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})

export default server
