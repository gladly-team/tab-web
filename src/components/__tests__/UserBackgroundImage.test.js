import React from 'react'
import { mount } from 'enzyme'
import SetBackgroundDailyImageMutation from 'src/utils/mutations/SetBackgroundDailyImageMutation'
import dayjs from 'dayjs'
import MockDate from 'mockdate'

jest.mock('src/utils/mutations/SetBackgroundDailyImageMutation')
jest.mock('src/utils/caching')
const getMockProps = () => ({
  user: {
    backgroundImage: {
      imageUrl: 'randomstringurl',
      timestamp: 'randomtimestamp',
    },
    id: 'randomID',
  },
})
const mockNow = '2021-01-30T18:37:04.604Z'

beforeEach(() => {
  MockDate.set(dayjs(mockNow))
})
afterEach(() => {
  jest.clearAllMocks()
  MockDate.reset()
})

describe('UserBackgroundImage component', () => {
  it('renders without error', () => {
    const UserBackgroundImage = require('src/components/UserBackgroundImage')
      .default
    const mockProps = getMockProps()
    expect(() => {
      mount(<UserBackgroundImage {...mockProps} />)
    }).not.toThrow()
  })

  it('renders without error without background image info', () => {
    const UserBackgroundImage = require('src/components/UserBackgroundImage')
      .default
    const mockProps = {
      ...getMockProps(),
      user: {
        ...getMockProps().user,
        backgroundImage: {},
      },
    }
    expect(() => {
      mount(<UserBackgroundImage {...mockProps} />)
    }).not.toThrow()
  })

  it('loads a new background image when the date is not today', () => {
    const UserBackgroundImage = require('src/components/UserBackgroundImage')
      .default
    const mockProps = {
      ...getMockProps(),
      user: {
        ...getMockProps().user,
        backgroundImage: {
          ...getMockProps().user.backgroundImage,
          timestamp: '2021-01-29T18:37:04.604Z',
        },
      },
    }
    mount(<UserBackgroundImage {...mockProps} />)
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalled()
  })

  it('passes the userID into the setBackgroundDailyImageMutation', () => {
    const UserBackgroundImage = require('src/components/UserBackgroundImage')
      .default
    const mockProps = {
      ...getMockProps(),
      user: {
        ...getMockProps().user,
        backgroundImage: {
          ...getMockProps().user.backgroundImage,
          timestamp: null,
        },
      },
    }
    mount(<UserBackgroundImage {...mockProps} />)
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalledWith('randomID')
  })

  it.skip('does not load a new background image when the date is today', () => {
    const UserBackgroundImage = require('src/components/UserBackgroundImage')
      .default
    const mockProps = {
      ...getMockProps(),
      user: {
        ...getMockProps().user,
        backgroundImage: {
          ...getMockProps().user.backgroundImage,
          timestamp: dayjs().format(),
        },
      },
    }
    mount(<UserBackgroundImage {...mockProps} />)
    expect(SetBackgroundDailyImageMutation).not.toHaveBeenCalled()
  })

  it('loads a new background image if background Image props are missing', () => {
    const UserBackgroundImage = require('src/components/UserBackgroundImage')
      .default
    const mockProps = {
      ...getMockProps(),
      user: {
        ...getMockProps().user,
        backgroundImage: {},
      },
    }
    mount(<UserBackgroundImage {...mockProps} />)
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalled()
  })

  it('loads a new background image if background Image timestamp is nil', () => {
    const UserBackgroundImage = require('src/components/UserBackgroundImage')
      .default
    const mockProps = {
      ...getMockProps(),
      user: {
        ...getMockProps().user,
        backgroundImage: {
          ...getMockProps().user.backgroundImage,
          timestamp: null,
        },
      },
    }
    mount(<UserBackgroundImage {...mockProps} />)
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalled()
  })
})
