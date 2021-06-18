import * as Router from 'koa-router'
import Auth from '../middleware/Auth'
import { routeHelper } from './routerHandler'
import { middleware } from '../types'

interface task2Router {
  getAccess: () => string
}

export class Task2 implements task2Router {
  public static instance: Task2 | undefined = undefined
  public static getInstance(): Task2 {
    if (this.instance !== undefined) return this.instance
    this.instance = new Task2()
    return this.instance
  }
  constructor() {}

  getAccess = () => {
    return `if you're seeing this message. You have access.`
  }
}

const router = new Router()
const Task2Instance = Task2.getInstance()
type methods = 'GET'

const routes: {
  url: string
  methods: methods[]
  middleware?: middleware[]
  route: Function
}[] = [
  {
    url: '/protected',
    methods: ['GET'],
    middleware: [Auth],
    route: Task2Instance.getAccess,
  },
]

routeHelper(routes, router)
export default router
