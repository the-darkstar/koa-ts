import * as Router from 'koa-router'
import { KoaContext, middleware } from '../types'

type methods = 'GET' | 'POST'

function routerHandler(route: Function) {
  return async (ctx: KoaContext, next: () => Promise<any>) => {
    try {
      await next()
      const response = await route(ctx)
      ctx.status = 200
      ctx.body = response
    } catch (err) {
      ctx.throw(err)
    }
  }
}

function routeHelper(
  routes: {
    url: string
    methods: methods[]
    middleware?: middleware[]
    route: Function
  }[],
  router: Router<any, {}>
) {
  for (let item of routes) {
    const { url, methods, route, middleware } = item
    if (middleware) {
      router.register(url, methods, [...middleware, routerHandler(route)])
    } else router.register(url, methods, routerHandler(route))
  }
}
export { routerHandler, routeHelper }
