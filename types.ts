import { ParameterizedContext, DefaultState, DefaultContext } from 'koa'
export type KoaContext = ParameterizedContext<DefaultState, DefaultContext>
export type middleware = (
  ctx: KoaContext,
  next: () => Promise<any>
) => Promise<any>
