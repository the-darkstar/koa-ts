import * as request from 'supertest'
import server from '../server'

afterAll(() => {
  server.close()
})

describe('Tests for task1', () => {
  test('should return world', async () => {
    const response = await request(server).get('/hello')
    expect(response.text).toBe('world')
  })

  test('should return query params', async () => {
    const response = await request(server).get(
      `/echo?name=savez&hobby=fiddling`
    )
    expect(response.body).toEqual({
      name: 'savez',
      hobby: 'fiddling',
    })
  })

  test('should return error', async () => {
    const response = await request(server).get('/error')
    expect(response.body).toEqual({
      error: {
        message: 'internal server error',
        status: 500,
      },
    })
  })
})
