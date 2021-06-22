import * as request from 'supertest'
import { createWinstonLogger } from '../middleware/Logger'
import server from '../server'

afterAll(() => {
  server.close()
})

describe('Tests for task1', () => {
  test('should return world', async () => {
    const response = await request(server).get('/hello')
    expect(response.status).toBe(200)
    expect(response.text).toBe('world')
  })

  test('should return query params', async () => {
    const response = await request(server).get(
      `/echo?name=savez&hobby=fiddling`
    )
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      name: 'savez',
      hobby: 'fiddling',
    })
  })

  test('should return error', async () => {
    const response = await request(server).get('/error')
    expect(response.status).toBe(500)
    expect(response.body).toEqual({ msg: 'server error' })
  })
})

describe('Tests for task2', () => {
  test('should return string after authentication', async () => {
    const response = await request(server)
      .get('/protected')
      .set('Authorization', 'Basic YWRtaW46MTIz')

    expect(response.status).toBe(200)
    expect(response.text).toBe(
      `if you're seeing this message. You have access.`
    )
  })

  test('should return header not present after authentication failure', async () => {
    const response = await request(server).get('/protected')
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ msg: 'authentication header not present' })
  })

  test('should return header not present after authentication failure', async () => {
    const response = await request(server)
      .get('/protected')
      .set('Authorization', 'Basic YWRtaW48MTIz')
    expect(response.status).toBe(401)
    expect(response.body).toEqual({ msg: 'invalid username or password' })
  })
})

describe('tests for logger', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('log method should be called', async () => {
    const spy = jest.spyOn(createWinstonLogger(), 'log')
    await request(server).get('/hello')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('log method should be called even when error', async () => {
    const spy = jest
      .spyOn(createWinstonLogger(), 'log')
      .mockImplementationOnce(() => {
        throw new Error('generated error')
      })
    await request(server).get('/hello')
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
