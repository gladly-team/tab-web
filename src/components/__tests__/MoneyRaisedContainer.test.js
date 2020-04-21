jest.mock('src/components/MoneyRaised')

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

describe('MoneyRaised container', () => {
  it('wraps the correct component', () => {
    const { createFragmentContainer } = require('react-relay')
    const MoneyRaised = require('src/components/MoneyRaised').default
    // eslint-disable-next-line no-unused-expressions
    require('src/components/MoneyRaisedContainer').default
    // console.log(createFragmentContainer.mock.calls)
    expect(createFragmentContainer).toHaveBeenCalledWith(
      MoneyRaised,
      expect.any(Object)
    )
  })

  // TODO: test that the container data fully represents
  //   the component's prop types.
  // eslint-disable-next-line
  //   it('fetches the expected data', () => {
  //     const { createFragmentContainer } = require('react-relay')
  //
  //     // eslint-disable-next-line no-unused-expressions
  //     require('src/components/MoneyRaisedContainer').default
  //
  //     const containerDataInput = createFragmentContainer.mock.calls[0][1]
  //     const fetchedData = Object.keys(containerDataInput).reduce((acc, key) => {
  //       const graphqlFunc = containerDataInput[key]
  //       const fetchedKeys = graphqlFunc().selections.map(
  //         selection => selection.name
  //       )
  //       const newAcc = { ...acc, [key]: fetchedKeys }
  //       return newAcc
  //     }, {})
  //     // console.log(fetchedData)
  //   })
})
