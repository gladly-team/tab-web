import React from 'react'
import { shallow } from 'enzyme'
import { SketchPicker } from 'react-color'

jest.mock('react-color')

const mockOnBackgroundColorSelection = jest.fn()
const mockProps = {
  user: {
    backgroundColor: '#FF0000',
  },
  onBackgroundColorSelection: mockOnBackgroundColorSelection,
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('Background color picker component', () => {
  it('renders without error', () => {
    const BackgroundColorPicker =
      require('src/components/BackgroundColorPicker').default
    expect(() =>
      shallow(<BackgroundColorPicker {...mockProps} />)
    ).not.toThrow()
  })

  it('calls onBackgroundColorSelection callback when the color changes', () => {
    const BackgroundColorPicker =
      require('src/components/BackgroundColorPicker').default
    const wrapper = shallow(<BackgroundColorPicker {...mockProps} />)

    // Mock that our color picker fires its change callback
    const colorData = {
      hex: '#CDCDCD',
    }
    wrapper.find(SketchPicker).prop('onChangeComplete')(colorData)
    expect(mockOnBackgroundColorSelection).toHaveBeenCalledWith('#CDCDCD')
  })
})
