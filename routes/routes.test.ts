import { TaskOne, TaskTwo, Factorial } from './routes'
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

describe('tests for task2', () => {
  const task2 = TaskTwo.getInstance()
  test('should return a string', () => {
    const response = task2.getAccess()
    expect(response).toBe(`if you're seeing this message. You have access.`)
  })
})

describe('tests for factorial', () => {
  const factorial = Factorial.getInstance()
  test('should return factorial under different conditions', () => {
    let result = factorial.slow(10000)
    expect(result).toBe(531950728)
    result = factorial.fast(10000)
    expect(result).toBe(531950728)
    result = factorial.fast(10001)
    expect(result).toBe(39193488)
  })
})
