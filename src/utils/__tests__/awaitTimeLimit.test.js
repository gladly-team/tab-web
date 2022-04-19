import awaitTimeLimit from 'src/utils/awaitTimeLimit'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'

beforeAll(() => {
  jest.useFakeTimers()
})

describe('awaitTimeLimit', () => {
  it('resolves when the promise resolves immediately', async () => {
    expect.assertions(1)
    const asyncFunc = async () => 'foo'
    const prom = asyncFunc()

    // await flushAllPromises()
    const result = await awaitTimeLimit(prom, 50)
    expect(result).toEqual('foo')
  })

  it('resolves when the promise resolves quickly', async () => {
    expect.assertions(1)
    const asyncFunc = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('blah')
        }, 10)
      })
    const prom = asyncFunc()
    const resultPromise = awaitTimeLimit(prom, 50)
    jest.advanceTimersByTime(12)
    await flushAllPromises()
    const result = await resultPromise
    expect(result).toEqual('blah')
  })

  it('rejects with a timeout when the promise does not resolve before the timeout', async () => {
    expect.assertions(1)
    const asyncFunc = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('blah')
        }, 100)
      })

    let err
    const prom = asyncFunc()
    const resultPromise = awaitTimeLimit(prom, 50).catch((e) => {
      err = e
    })
    jest.advanceTimersByTime(51)
    await flushAllPromises()
    expect(err).toEqual(new Error('Awaited promise timed out.'))
  })
})
