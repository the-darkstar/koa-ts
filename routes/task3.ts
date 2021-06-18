import * as Router from 'koa-router'
import Auth from '../middleware/Auth'
import { routeHelper } from './routerHandler'
import { KoaContext, middleware } from '../types'

interface Task3Router {
  fast: (n: number) => number
  slow: (n: number) => number
  calculateFactorial: (ctx: KoaContext) => response | errorResponse
}

type response = {
  data: {
    factorial: {
      value: number
      timeTaken: number
    }
  }
}

type errorResponse = {
  error: {
    reason: string
    dateTime: Date
    message: string
    details: {
      [key: string]: any
    }
  }
}

export class Task3 implements Task3Router {
  public static instance: Task3 | undefined = undefined
  private divisor = 1e9 + 7
  private lookup = {}
  public static getInstance(): Task3 {
    if (this.instance !== undefined) return this.instance
    else {
      this.instance = new Task3()
      return this.instance
    }
  }

  constructor() {}

  slow = (n: number) => {
    if (n === 1) return 1
    else {
      this.lookup[n] = (n * this.slow(n - 1)) % this.divisor
      return this.lookup[n]
    }
  }

  fast = (n: number) => {
    if (n === 1) return 1
    if (this.lookup[n]) return this.lookup[n]
    else {
      this.lookup[n] = (n * this.slow(n - 1)) % this.divisor
      return this.lookup[n]
    }
  }

  calculateFactorial = (ctx: KoaContext) => {
    const n: number = parseInt(ctx.params.number)
    const method = ctx.query.request

    if (n < 1 || n > 1e8) {
      const errorResponse: errorResponse = {
        error: {
          reason: ' 1 <= number <= 1e8',
          dateTime: new Date(),
          message: 'number out of range',
          details: { n },
        },
      }
      return errorResponse
    } else {
      const start = Date.now()
      const result = method === 'fast' ? this.fast(n) : this.slow(n)
      const end = Date.now()
      const duration = end - start

      const response: response = {
        data: {
          factorial: {
            value: result,
            timeTaken: duration,
          },
        },
      }
      return response
    }
  }
}

const router = new Router()
const Task3Instance = Task3.getInstance()
type methods = 'GET'

const routes: {
  url: string
  methods: methods[]
  middleware?: middleware[]
  route: Function
}[] = [
  {
    url: `/api/v1/factorial/:number`,
    methods: ['GET'],
    middleware: [Auth],
    route: Task3Instance.calculateFactorial,
  },
]

routeHelper(routes, router)
export default router
