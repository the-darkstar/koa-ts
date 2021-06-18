import * as Router from 'koa-router'
import { KoaContext } from '../types'
import { routeHelper } from './routerHandler'

interface taskOneRouter {
  getWorld: () => string
  getQueryParams: (ctx: KoaContext) => any
  getError: () => { error: { msg: string } }
}

export class TaskOne implements taskOneRouter {
  public static instance: TaskOne | undefined = undefined
  public static getInstance(): TaskOne {
    if (this.instance !== undefined) return this.instance
    this.instance = new TaskOne()
    return this.instance
  }
  constructor() {}

  getWorld = () => {
    return 'world'
  }

  getQueryParams = (ctx: KoaContext) => {
    return ctx.request.query
  }

  getError = () => {
    return {
      error: { msg: 'server error' },
    }
  }
}

const router = new Router()
const taskOneInstance = TaskOne.getInstance()
type methods = 'GET'

const routes: { url: string; methods: methods[]; route: Function }[] = [
  {
    url: '/hello',
    methods: ['GET'],
    route: taskOneInstance.getWorld,
  },
  {
    url: '/echo',
    methods: ['GET'],
    route: taskOneInstance.getQueryParams,
  },
  {
    url: '/error',
    methods: ['GET'],
    route: taskOneInstance.getError,
  },
]

routeHelper(routes, router)
export default router
