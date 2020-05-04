import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'

describe('flushAllPromises', () => {
  test('flushAllPromises works as expected', async () => {
    expect.assertions(1)

    const anotherTestFunc = jest.fn()
    const testFunc = () => {
      Promise.resolve().then(() => {
        anotherTestFunc('hi')
      })
    }

    testFunc()
    await flushAllPromises()
    expect(anotherTestFunc).toHaveBeenCalledWith('hi')
  })

  test('without flushAllPromises, the same test as above would fail', async () => {
    expect.assertions(1)

    const anotherTestFunc = jest.fn()
    const testFunc = () => {
      Promise.resolve().then(() => {
        anotherTestFunc('hi')
      })
    }

    testFunc()
    expect(anotherTestFunc).not.toHaveBeenCalled()
  })
})
