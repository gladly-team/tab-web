import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import MockDate from 'mockdate'
import Typography from '@material-ui/core/Typography'
import ArrowRight from '@material-ui/icons/ArrowRight'
import Cancel from '@material-ui/icons/Cancel'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Group from '@material-ui/icons/Group'
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked'
import Schedule from '@material-ui/icons/Schedule'
import LinearProgress from '@material-ui/core/LinearProgress'

const mockNow = '2020-04-02T18:00:00.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  MockDate.reset()

  // Some tests suppress console warnings. Unmock console.warn.
  // eslint-disable-next-line no-console
  if (console.warn.mockRestore) {
    // eslint-disable-next-line no-console
    console.warn.mockRestore()
  }
})

const getMockProps = () => ({
  impactText: 'Plant 1 tree',
  status: 'inProgress',
  taskText: 'Open 10 tabs',
  completionTime: moment(mockNow).subtract(2, 'minutes').toISOString(),
  deadlineTime: moment(mockNow).add(8, 'hours').toISOString(),
  isCommunityGoal: undefined, // defaults to false
  progress: {
    currentNumber: 11,
    targetNumber: 50,
    visualizationType: 'progressBar',
  },
})

const getTimeDisplayString = (wrapper) => {
  return wrapper
    .find('[data-test-id="time-container"]')
    .find(Typography)
    .first()
    .render()
    .text()
}

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

  it('displays the expected time string when the achievement is in progress and the deadline is in the near future', () => {
    expect.assertions(6)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'inProgress',
      completionTime: undefined,
      deadlineTime: moment(mockNow).add(1, 'second').toISOString(),
    }
    const wrapper = shallow(<Achievement {...mockProps} />)

    expect(getTimeDisplayString(wrapper)).toEqual('a few seconds remaining')

    wrapper.setProps({
      deadlineTime: moment(mockNow).add(24, 'seconds').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('a few seconds remaining')

    wrapper.setProps({
      deadlineTime: moment(mockNow).add(46, 'seconds').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('a minute remaining')

    wrapper.setProps({
      deadlineTime: moment(mockNow).add(192, 'seconds').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('3 minutes remaining')

    wrapper.setProps({
      deadlineTime: moment(mockNow).add(54, 'minutes').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('an hour remaining')

    wrapper.setProps({
      deadlineTime: moment(mockNow).add(14, 'hours').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('14 hours remaining')
  })

  it('displays the expected time string when the achievement was successfully completed in the recent past and the deadline is in the future', () => {
    expect.assertions(6)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'success',
      completionTime: moment(mockNow).subtract(1, 'second').toISOString(),
      deadlineTime: moment(mockNow).add(14, 'hours').toISOString(),
    }
    const wrapper = shallow(<Achievement {...mockProps} />)

    expect(getTimeDisplayString(wrapper)).toEqual('a few seconds ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(24, 'seconds').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('a few seconds ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(46, 'seconds').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('a minute ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(192, 'seconds').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('3 minutes ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(54, 'minutes').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('an hour ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(14, 'hours').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('14 hours ago')
  })

  it('displays the expected time string when the achievement was failed and the deadline/completion time is in recent past', () => {
    expect.assertions(6)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'failure',
      completionTime: moment(mockNow).subtract(1, 'second').toISOString(),
      deadlineTime: moment(mockNow).subtract(1, 'second').toISOString(),
    }
    const wrapper = shallow(<Achievement {...mockProps} />)

    expect(getTimeDisplayString(wrapper)).toEqual('a few seconds ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(24, 'seconds').toISOString(),
      deadlineTime: moment(mockNow).subtract(24, 'seconds').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('a few seconds ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(46, 'seconds').toISOString(),
      deadlineTime: moment(mockNow).subtract(46, 'seconds').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('a minute ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(192, 'seconds').toISOString(),
      deadlineTime: moment(mockNow).subtract(192, 'seconds').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('3 minutes ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(54, 'minutes').toISOString(),
      deadlineTime: moment(mockNow).subtract(54, 'minutes').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('an hour ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(14, 'hours').toISOString(),
      deadlineTime: moment(mockNow).subtract(14, 'hours').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('14 hours ago')
  })

  it('displays the expected time string when the achievement was completed in the distant past', () => {
    expect.assertions(5)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'success',
      completionTime: moment(mockNow).subtract(3, 'days').toISOString(),
      deadlineTime: moment(mockNow).add(14, 'hours').toISOString(),
    }
    const wrapper = shallow(<Achievement {...mockProps} />)

    expect(getTimeDisplayString(wrapper)).toEqual('3 days ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(16, 'days').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('16 days ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(70, 'days').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('2 months ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(400, 'days').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('a year ago')

    wrapper.setProps({
      completionTime: moment(mockNow).subtract(3, 'years').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('3 years ago')
  })

  it('displays the expected time string when the achievement deadline is in the distant future', () => {
    expect.assertions(5)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'inProgress',
      completionTime: undefined,
      deadlineTime: moment(mockNow).add(3, 'days').toISOString(),
    }
    const wrapper = shallow(<Achievement {...mockProps} />)

    expect(getTimeDisplayString(wrapper)).toEqual('3 days remaining')

    wrapper.setProps({
      deadlineTime: moment(mockNow).add(16, 'days').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('16 days remaining')

    wrapper.setProps({
      deadlineTime: moment(mockNow).add(70, 'days').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('2 months remaining')

    wrapper.setProps({
      deadlineTime: moment(mockNow).add(400, 'days').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('a year remaining')

    wrapper.setProps({
      deadlineTime: moment(mockNow).add(3, 'years').toISOString(),
    })
    expect(getTimeDisplayString(wrapper)).toEqual('3 years remaining')
  })

  it('displays the clock icon next to the display time when the achievement is in progress', () => {
    expect.assertions(1)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'inProgress',
      completionTime: undefined,
      deadlineTime: moment(mockNow).add(4, 'hours').toISOString(),
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="time-container"]').find(Schedule).exists()
    ).toBe(true)
  })

  it('does not display the clock icon when the achievement was completed (success)', () => {
    expect.assertions(1)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'success',
      completionTime: moment(mockNow).subtract(4, 'hours').toISOString(),
      deadlineTime: moment(mockNow).subtract(4, 'hours').toISOString(),
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="time-container"]').find(Schedule).exists()
    ).toBe(false)
  })

  it('does not display the clock icon when the achievement was completed (failure)', () => {
    expect.assertions(1)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'failure',
      completionTime: moment(mockNow).subtract(4, 'hours').toISOString(),
      deadlineTime: moment(mockNow).subtract(4, 'hours').toISOString(),
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="time-container"]').find(Schedule).exists()
    ).toBe(false)
  })

  it('calls console.warn and does not display a time if the achievement status is "inProgress" and the deadline time is invalid', () => {
    expect.assertions(2)

    // Suppress expected console warning.
    const mockConsoleWarn = jest.fn()
    jest.spyOn(console, 'warn').mockImplementation(mockConsoleWarn)

    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'inProgress',
      completionTime: undefined,
      deadlineTime: 'xyz123', // invalid
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="time-container"]').find(Typography).exists()
    ).toBe(false)
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Invalid "deadlineTime" timestamp provided to Achievement.'
    )
  })

  it('calls console.warn and does not display a time if the achievement status is "success" and no completion time is provided', () => {
    expect.assertions(2)

    // Suppress expected console warning.
    const mockConsoleWarn = jest.fn()
    jest.spyOn(console, 'warn').mockImplementation(mockConsoleWarn)

    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'success',
      completionTime: undefined,
      deadlineTime: moment(mockNow).subtract(4, 'hours').toISOString(),
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="time-container"]').find(Typography).exists()
    ).toBe(false)
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Invalid "completionTime" timestamp provided to Achievement.'
    )
  })

  it('calls console.warn and does not display a time if the achievement status is "failure" and no completion time is provided', () => {
    expect.assertions(2)

    // Suppress expected console warning.
    const mockConsoleWarn = jest.fn()
    jest.spyOn(console, 'warn').mockImplementation(mockConsoleWarn)

    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'failure',
      completionTime: undefined,
      deadlineTime: moment(mockNow).subtract(4, 'hours').toISOString(),
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="time-container"]').find(Typography).exists()
    ).toBe(false)
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Invalid "completionTime" timestamp provided to Achievement.'
    )
  })

  it('does not display a time and does not call console.warn if the achievement status is "inProgress" and the deadline time is not set', () => {
    expect.assertions(2)

    // Suppress expected console warning.
    const mockConsoleWarn = jest.fn()
    jest.spyOn(console, 'warn').mockImplementation(mockConsoleWarn)

    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'inProgress',
      completionTime: undefined,
      deadlineTime: undefined,
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="time-container"]').find(Typography).exists()
    ).toBe(false)
    expect(mockConsoleWarn).not.toHaveBeenCalled()
  })

  it('displays the community goal icon and text if "isCommunityGoal" is true', () => {
    expect.assertions(2)

    // Suppress expected console warning.
    const mockConsoleWarn = jest.fn()
    jest.spyOn(console, 'warn').mockImplementation(mockConsoleWarn)

    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      isCommunityGoal: true,
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper
        .find(Typography)
        .filterWhere((elem) => elem.render().text() === 'Community goal')
        .exists()
    ).toBe(true)
    expect(wrapper.find(Group).exists()).toBe(true)
  })

  it('does not display the community goal icon or text if "isCommunityGoal" is false', () => {
    expect.assertions(2)

    // Suppress expected console warning.
    const mockConsoleWarn = jest.fn()
    jest.spyOn(console, 'warn').mockImplementation(mockConsoleWarn)

    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      isCommunityGoal: false,
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper
        .find(Typography)
        .filterWhere((elem) => elem.render().text() === 'Community goal')
        .exists()
    ).toBe(false)
    expect(wrapper.find(Group).exists()).toBe(false)
  })

  it('does not display any progress when "progress" is undefined', () => {
    expect.assertions(1)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'inProgress',
      progress: undefined,
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(wrapper.find('[data-test-id="progress-container"]').exists()).toBe(
      false
    )
  })

  it('displays a progress bar with the expected value when "progress.visualizationType" is "progressBar"', () => {
    expect.assertions(2)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'inProgress',
      progress: {
        currentNumber: 11,
        targetNumber: 50,
        visualizationType: 'progressBar',
      },
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    const progressBarElem = wrapper
      .find('[data-test-id="progress-container"]')
      .find(LinearProgress)
    expect(progressBarElem.exists()).toBe(true)
    expect(progressBarElem.prop('value')).toEqual((11 / 50) * 100)
  })

  it('displays checkmarks with none checked when "progress.visualizationType" is "checkmarks" and the "currentNumber" is zero', () => {
    expect.assertions(2)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'inProgress',
      progress: {
        currentNumber: 0,
        targetNumber: 5,
        visualizationType: 'checkmarks',
      },
    }
    const wrapper = shallow(<Achievement {...mockProps} />)

    // None checked.
    expect(
      wrapper.find('[data-test-id="progress-container"]').find(CheckCircle)
        .length
    ).toEqual(0)

    // All unchecked.
    expect(
      wrapper
        .find('[data-test-id="progress-container"]')
        .find(RadioButtonUnchecked).length
    ).toEqual(5)
  })

  it('displays checkmarks with some checked when "progress.visualizationType" is "checkmarks" and the "currentNumber" is non-zero', () => {
    expect.assertions(2)
    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'inProgress',
      progress: {
        currentNumber: 3,
        targetNumber: 7,
        visualizationType: 'checkmarks',
      },
    }
    const wrapper = shallow(<Achievement {...mockProps} />)

    // Some checked.
    expect(
      wrapper.find('[data-test-id="progress-container"]').find(CheckCircle)
        .length
    ).toEqual(3)

    // Some unchecked.
    expect(
      wrapper
        .find('[data-test-id="progress-container"]')
        .find(RadioButtonUnchecked).length
    ).toEqual(4)
  })

  it('warns if the number of progress checkmarks exceeds 20 and only renders 20 checkmarks', () => {
    expect.assertions(2)

    // Suppress expected console warning.
    const mockConsoleWarn = jest.fn()
    jest.spyOn(console, 'warn').mockImplementation(mockConsoleWarn)

    const Achievement = require('src/components/Achievement').default
    const mockProps = {
      ...getMockProps(),
      status: 'inProgress',
      progress: {
        currentNumber: 0,
        targetNumber: 50,
        visualizationType: 'checkmarks',
      },
    }
    const wrapper = shallow(<Achievement {...mockProps} />)
    expect(
      wrapper
        .find('[data-test-id="progress-container"]')
        .find(RadioButtonUnchecked).length
    ).toEqual(20) // limits the number that render

    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Large number of checkmarks attempted to render in Achievement. Limiting to 20 checkmarks.'
    )
  })
})
