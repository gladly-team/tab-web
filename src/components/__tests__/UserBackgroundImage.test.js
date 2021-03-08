import React from 'react'
import { mount, shallow } from 'enzyme'
import SetBackgroundDailyImageMutation from 'src/utils/mutations/SetBackgroundDailyImageMutation'
import dayjs from 'dayjs'
import MockDate from 'mockdate'
import { act } from 'react-dom/test-utils'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'

jest.mock('src/utils/mutations/SetBackgroundDailyImageMutation')
jest.mock('src/utils/caching')
const mockNow = '2021-01-30T18:37:04.604Z'
SetBackgroundDailyImageMutation.mockReturnValue({
  setUserBkgDailyImage: {
    user: { backgroundImage: { imageURL: 'somenewURL', timestamp: mockNow } },
  },
})
const getMockProps = () => ({
  user: {
    backgroundImage: {
      imageURL: 'randomstringurl',
      timestamp: mockNow,
    },
    id: 'randomID',
  },
})

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
    expect(() => shallow(<UserBackgroundImage {...mockProps} />)).not.toThrow()
  })

  it('loads a new background image when the date is not today', async () => {
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
    await act(async () => {
      await flushAllPromises()
    })
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalled()
  })

  it('passes the userID into the setBackgroundDailyImageMutation', async () => {
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
    await act(async () => {
      await flushAllPromises()
    })
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalledWith('randomID')
  })

  it('does not load a new background image when the date is today', async () => {
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
    await act(async () => {
      await flushAllPromises()
    })
    expect(SetBackgroundDailyImageMutation).not.toHaveBeenCalled()
  })

  it('loads a new background image if background Image props are missing', async () => {
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
    await act(async () => {
      await flushAllPromises()
    })
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalled()
  })

  it('loads a new background image if background Image timestamp is nil', async () => {
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
    await act(async () => {
      await flushAllPromises()
    })
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalled()
  })

  it('updates the background image when the new image onLoad completes', async () => {
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload() // simulate success
        }, 100)
      }
    }
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
    const wrapper = mount(<UserBackgroundImage {...mockProps} />)
    await act(async () => {
      await flushAllPromises()
    })
    expect(wrapper.find('CSSTransition').length).toEqual(1)
    await act(async () => {
      await wrapper.find('img').props().onLoad()
    })
    await act(async () => {
      wrapper.update()
    })
    expect(wrapper.find('CSSTransition').length).toEqual(2)
  })
})
