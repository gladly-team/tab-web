import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import ArrowRight from '@material-ui/icons/ArrowRight'
import Cancel from '@material-ui/icons/Cancel'
import CheckCircle from '@material-ui/icons/CheckCircle'

const getMockProps = () => ({
  impactText: 'Plant 1 tree',
  status: 'inProgress',
  taskText: 'Open 10 tabs',
})

describe('Achievement component', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const Achievement = require('src/components/Achievement').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<Achievement {...mockProps} />)
    }).not.toThrow()
  })

  it('displays the impactText as a large header', () => {
    expect.assertions(2)
    const Achievement = require('src/components/Achievement').default
    const mockProps = { ...getMockProps(), impactText: 'Do good stuff' }
    const wrapper = shallow(<Achievement {...mockProps} />)
    const impactTextElem = wrapper
      .find(Typography)
      .filterWhere((elem) => elem.render().text() === 'Do good stuff')
    expect(impactTextElem.exists()).toBe(true)
    expect(impactTextElem.prop('variant')).toEqual('h5')
  })

  it('displays the taskText', () => {
    expect.assertions(2)
    const Achievement = require('src/components/Achievement').default
    const mockProps = { ...getMockProps(), taskText: 'Open 121 tabs' }
    const wrapper = shallow(<Achievement {...mockProps} />)
    const impactTextElem = wrapper
      .find(Typography)
      .filterWhere((elem) => elem.render().text() === 'Open 121 tabs')
    expect(impactTextElem.exists()).toBe(true)
    expect(impactTextElem.prop('variant')).toEqual('subtitle1')
  })

  it('displays the expected icon next to the taskText', () => {
    expect.assertions(1)
    const Achievement = require('src/components/Achievement').default
    const mockProps = { ...getMockProps(), taskText: 'Open 121 tabs' }
    const wrapper = shallow(<Achievement {...mockProps} />)
    const impactTextIcon = wrapper.find(ArrowRight).first()
    expect(impactTextIcon.exists()).toBe(true)

    // TODO: we should test that the icon is a sibling of the text,
    // but Enzyme's parent() method is broken:
    // https://github.com/enzymejs/enzyme/issues/1876

    // expect(impactTextIcon.parent().find(Typography).render().text()).toEqual(
    //   'Open 121 tabs'
    // )
  })

  it('displays the success icon when the status is "success"', () => {
    expect.assertions(2)
    const Achievement = require('src/components/Achievement').default
    const mockProps = { ...getMockProps(), status: 'success' }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper
        .find('[data-test-id="impact-text-container"]')
        .find(CheckCircle)
        .exists()
    ).toBe(true)
    expect(
      wrapper
        .find('[data-test-id="impact-text-container"]')
        .find(Cancel)
        .exists()
    ).toBe(false)
  })

  it('displays the failure icon when the status is "failure"', () => {
    expect.assertions(2)
    const Achievement = require('src/components/Achievement').default
    const mockProps = { ...getMockProps(), status: 'failure' }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper
        .find('[data-test-id="impact-text-container"]')
        .find(CheckCircle)
        .exists()
    ).toBe(false)
    expect(
      wrapper
        .find('[data-test-id="impact-text-container"]')
        .find(Cancel)
        .exists()
    ).toBe(true)
  })

  it('displays neither the the success or failure icons when the status is "inProgress"', () => {
    expect.assertions(2)
    const Achievement = require('src/components/Achievement').default
    const mockProps = { ...getMockProps(), status: 'inProgress' }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper
        .find('[data-test-id="impact-text-container"]')
        .find(CheckCircle)
        .exists()
    ).toBe(false)
    expect(
      wrapper
        .find('[data-test-id="impact-text-container"]')
        .find(Cancel)
        .exists()
    ).toBe(false)
  })
})
