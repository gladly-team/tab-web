import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'

jest.mock('src/utils/navigation')
jest.mock('src/utils/logger')

beforeAll(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  existingId: 'abcd',
  onCancel: jest.fn(),
  onSave: jest.fn(),
})

describe('AddShortcut component', () => {
  it('renders without error', () => {
    const AddShortcut = require('src/components/AddShortcut').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<AddShortcut {...mockProps} />)
    }).not.toThrow()
  })

  it('calls handler, clears fields and closes on clicking cancel', () => {
    const AddShortcut = require('src/components/AddShortcut').default
    const mockProps = getMockProps()
    const wrapper = mount(<AddShortcut {...mockProps} />)

    wrapper.update()

    const cancelButton = wrapper.find(Button).at(0)
    expect(cancelButton.text()).toEqual('Cancel')
    cancelButton.simulate('click')

    wrapper.update()

    expect(mockProps.onCancel).toHaveBeenCalled()
  })

  it('calls handler and closes on clicking save', async () => {
    const AddShortcut = require('src/components/AddShortcut').default
    const mockProps = getMockProps()
    const wrapper = mount(<AddShortcut {...mockProps} />)

    wrapper
      .find(TextField)
      .at(0)
      .find('input')
      .simulate('change', { target: { value: 'test' } })
    wrapper
      .find(TextField)
      .at(1)
      .find('input')
      .simulate('change', { target: { value: 'test.com' } })

    const saveButton = wrapper.find(Button).at(1)
    expect(saveButton.text()).toEqual('Save')
    saveButton.simulate('click')

    wrapper.update()
    expect(mockProps.onSave).toHaveBeenCalledWith(
      mockProps.existingId,
      'test',
      'http://test.com'
    )
  })

  it('default save and cancel handlers do not throw', async () => {
    const AddShortcut = require('src/components/AddShortcut').default
    let wrapper = mount(<AddShortcut />)

    expect(() => wrapper.find(Button).at(0).simulate('click')).not.toThrow()

    wrapper = mount(<AddShortcut />)

    expect(() => wrapper.find(Button).at(1).simulate('click')).not.toThrow()
  })

  it('puts default values when for name and url', async () => {
    const AddShortcut = require('src/components/AddShortcut').default
    const name = 'name'
    const url = 'url'
    const wrapper = mount(<AddShortcut existingName={name} existingUrl={url} />)

    const textFields = wrapper.find(TextField)

    expect(textFields.at(0).prop('value')).toEqual(name)
    expect(textFields.at(1).prop('value')).toEqual(url)
  })
})
