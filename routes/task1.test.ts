import { TaskOne } from './task1'
import { createMockContext } from '@shopify/jest-koa-mocks'

describe('tests for task1', () => {
  const taskOneInstance = TaskOne.getInstance()

  test('should return world', () => {
    const response = taskOneInstance.getWorld()
    expect(response).toBe('world')
  })

  test('should return ctx.query', () => {
    const ctx = createMockContext({ url: '/echo?name=savez&hobby=fiddling' })
    const response = taskOneInstance.getQueryParams(ctx)
    expect(response).toEqual({
      name: 'savez',
      hobby: 'fiddling',
    })
  })

  test('should return error', () => {
    const response = taskOneInstance.getError()
    expect(response).toEqual({
      error: { msg: 'server error' },
    })
  })
})
