import { KoaContext } from '../types'

interface Authentication {
  handleAuth: (ctx: KoaContext, next: () => Promise<any>) => Promise<KoaContext>
}

class Auth implements Authentication {
  public static instance: Auth | undefined = undefined
  public static getInstance(): Auth {
    if (this.instance !== undefined) return this.instance
    this.instance = new Auth()
    return this.instance
  }

  constructor() {}

  handleAuth = async (ctx: KoaContext, next: () => Promise<any>) => {
    if (ctx.path === '/protected') {
      const base64Credentials = ctx.request.header?.authorization?.split(' ')[1]
      if (base64Credentials) {
        const credentials = Buffer.from(base64Credentials, 'base64').toString(
          'ascii'
        )
        const [username, password] = credentials.split(':')
        if (username === 'admin' && password === '123') {
          await next()
        } else {
          ctx.status = 500
          ctx.body = { msg: 'invalid username or password' }
          return ctx
        }
      } else {
        ctx.status = 401
        ctx.body = { msg: 'authentication header not present' }
        return ctx
      }
    } else {
      await next()
    }
  }
}

const authInstance = Auth.getInstance()
export default authInstance.handleAuth
