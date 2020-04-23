jest.mock('src/components/MoneyRaised')

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

// TODO: we can probably create a test-util helper to
//   run a bunch of standard tests on container modules.
//   E.g., it would be nice to test the fetched data against
//   the module's prop-types.
describe('MoneyRaised container', () => {
  it('wraps the correct component', () => {
    const { createFragmentContainer } = require('react-relay')
    const MoneyRaised = require('src/components/MoneyRaised').default
    // eslint-disable-next-line no-unused-expressions
    require('src/components/MoneyRaisedContainer').default
    expect(createFragmentContainer).toHaveBeenCalledWith(
      MoneyRaised,
      expect.any(Object)
    )
  })

  // TODO: test that the container data fully represents
  //   the component's prop types.
  //   The prop-types library doesn't support introspection,
  //   which makes this challenging:
  //   https://github.com/facebook/prop-types/issues/60
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
