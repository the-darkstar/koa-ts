import * as Router from 'koa-router'
import { KoaContext } from '../types'

type methods = 'GET' | 'POST'

function routerHandler(route: Function) {
  return async (ctx: KoaContext, next: () => Promise<any>) => {
    await next()
    const response = await route(ctx)
    if (response.error) {
      const { status, body } = response.error
      ctx.status = status
      ctx.body = body
    } else {
      ctx.status = 200
      ctx.body = response
    }
  }
}
function routeHelper(
  routes: { url: string; methods: methods[]; route: Function }[],
  router: Router<any, {}>
) {
  for (let item of routes) {
    const { url, methods, route } = item
    router.register(url, methods, routerHandler(route))
  }
}
export { routerHandler, routeHelper }
