import * as Router from 'koa-router'
import Auth from '../middleware/Auth'
import Logger from '../middleware/Logger'
import { routeHelper } from './routeHandler'
import { KoaContext, middleware } from '../types'

interface TaskOneRouter {
  getWorld: () => string
  getQueryParams: (ctx: KoaContext) => any
  getError: () => { error: { msg: string } }
}

export class TaskOne implements TaskOneRouter {
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

interface TaskTwoRouter {
  getAccess: () => string
}

export class TaskTwo implements TaskTwoRouter {
  public static instance: TaskTwo | undefined = undefined
  public static getInstance(): TaskTwo {
    if (this.instance !== undefined) return this.instance
    this.instance = new TaskTwo()
    return this.instance
  }
  constructor() {}

  getAccess = () => {
    return `if you're seeing this message. You have access.`
  }
}

interface FactorialRouter {
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

export class Factorial implements FactorialRouter {
  public static instance: Factorial | undefined = undefined
  private divisor = 1e9 + 7
  private lookup = {}
  public static getInstance(): Factorial {
    if (this.instance !== undefined) return this.instance
    this.instance = new Factorial()
    return this.instance
  }

  constructor() {}

  slow = (n: number) => {
    let result = 1
    for (let i = 1; i <= n; i++) {
      result = (result * i) % this.divisor
      this.lookup[i] = result
    }
    return result
  }

  fast = (n: number) => {
    if (this.lookup[n]) return this.lookup[n]

    let result = 1
    for (let i = n; i >= 1; i--) {
      if (this.lookup[i]) {
        result = (result * this.lookup[i]) % this.divisor
        this.lookup[n] = result
        break
      }
      result = (result * i) % this.divisor
    }
    return result
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
          details: { number: n },
        },
      }
      return errorResponse
    } else if (!(method === 'fast' || method === 'slow')) {
      const errorResponse: errorResponse = {
        error: {
          reason: 'request can either be fast or slow',
          dateTime: new Date(),
          message: 'invalid request',
          details: { request: method || '' },
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
const taskOneInstance = TaskOne.getInstance()
const taskTwoInstance = TaskTwo.getInstance()
const factorialInstance = Factorial.getInstance()
type methods = 'GET'

const routes: {
  url: string
  methods: methods[]
  middleware: middleware[]
  route: Function
}[] = [
  {
    url: '/hello',
    methods: ['GET'],
    middleware: [Logger],
    route: taskOneInstance.getWorld,
  },
  {
    url: '/echo',
    methods: ['GET'],
    middleware: [Logger],
    route: taskOneInstance.getQueryParams,
  },
  {
    url: '/error',
    methods: ['GET'],
    middleware: [Logger],
    route: taskOneInstance.getError,
  },
  {
    url: '/protected',
    methods: ['GET'],
    middleware: [Auth, Logger],
    route: taskTwoInstance.getAccess,
  },
  {
    url: `/api/v1/factorial/:number`,
    methods: ['GET'],
    middleware: [Auth, Logger],
    route: factorialInstance.calculateFactorial,
  },
]

routeHelper(routes, router)
export default router
