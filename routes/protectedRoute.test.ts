import { Task2 } from './protectedRoute'

describe('tests for task2', () => {
  const task2 = Task2.getInstance()
  test('should return a string', () => {
    const response = task2.getAccess()
    expect(response).toBe(`if you're seeing this message. You have access.`)
  })
})
