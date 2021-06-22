import * as request from 'supertest'
import { createWinstonLogger } from '../middleware/Logger'
import server from '../server'
import mockdate from 'mockdate'

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
    expect(response.body).toEqual({
      error: { msg: 'server error' },
    })
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

describe('tests for factorial route', () => {
  test(`should return factorial when query "request" is slow`, async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000)
    const resp = await request(server)
      .get('/api/v1/factorial/1000?request=slow')
      .set('Authorization', 'Basic YWRtaW46MTIz')

    expect(resp.body).toEqual({
      data: {
        factorial: {
          value: 641419708,
          timeTaken: 0,
        },
      },
    })
  })

  test(`should return factorial when query "request" is fast`, async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000)
    const resp = await request(server)
      .get('/api/v1/factorial/10000?request=fast')
      .set('Authorization', 'Basic YWRtaW46MTIz')

    expect(resp.body).toEqual({
      data: {
        factorial: {
          value: 531950724,
          timeTaken: 0,
        },
      },
    })
  })

  test('should return proper error message when number is out of range', async () => {
    mockdate.set('2000-11-22')
    const resp = await request(server)
      .get('/api/v1/factorial/1000000000?request=fast')
      .set('Authorization', 'Basic YWRtaW46MTIz')

    expect(resp.body).toEqual({
      error: {
        reason: ' 1 <= number <= 1e8',
        dateTime: '2000-11-22T00:00:00.000Z',
        message: 'number out of range',
        details: { number: 1e9 },
      },
    })
  })

  test('should return proper error message when query is invalid', async () => {
    mockdate.set('2000-11-22')
    const resp = await request(server)
      .get('/api/v1/factorial/1000?request=GodKnowsWhat')
      .set('Authorization', 'Basic YWRtaW46MTIz')

    expect(resp.body).toEqual({
      error: {
        reason: 'request can either be fast or slow',
        dateTime: '2000-11-22T00:00:00.000Z',
        message: 'invalid request',
        details: { request: 'GodKnowsWhat' },
      },
    })
  })

  test('should return proper error message when query is not given', async () => {
    mockdate.set('2000-11-22')
    const resp = await request(server)
      .get('/api/v1/factorial/1000')
      .set('Authorization', 'Basic YWRtaW46MTIz')

    expect(resp.body).toEqual({
      error: {
        reason: 'request can either be fast or slow',
        dateTime: '2000-11-22T00:00:00.000Z',
        message: 'invalid request',
        details: { request: '' },
      },
    })
  })
})
