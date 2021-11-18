import React from 'react'
import { shallow } from 'enzyme'
import Markdown from 'src/components/Markdown'
import Button from '@material-ui/core/Button'
import { media } from 'src/utils/urls'

jest.mock('src/utils/constants', () => ({
  MEDIA_ENDPOINT: 'https://dev-tab2017-media.gladly.io',
}))
const getMockProps = () => ({
  showMissionSlide: false,
  onboarding: {
    steps: [
      {
        imgName: 'cats/cattabs.svg',
        title: 'Your tabs are doing great things',
        subtitle: 'Now, every tab you open supports cats in need.',
      },
      {
        imgName: 'cats/squadcat.svg',
        title: 'Help more cats with squads',
        subtitle: 'Cats can get adopted up to 3x faster when you join a squad!',
      },
      {
        imgName: 'cats/adcat.svg',
        title: "It doesn't cost you a thing",
        subtitle:
          'We display a couple of small ads at the bottom of your screen and redistribute that money to charity. No fees or hidden costs!',
      },
    ],
  },
})

describe('OnboardingFlow component', () => {
  it('renders without error', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    expect(() => {
      shallow(<OnboardingFlow {...getMockProps()} />)
    }).not.toThrow()
  })

  it('starting flow displays first onboarding card', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const props = getMockProps()
    const wrapper = shallow(<OnboardingFlow {...props} />)

    expect(wrapper.find('img').first().prop('src')).toEqual(
      media(props.onboarding.steps[0].imgName)
    )
    expect(wrapper.find(Markdown).first().prop('children')).toContain(
      'Your tabs are doing great things'
    )
    expect(wrapper.find(Markdown).last().prop('children')).toContain(
      'Now, every tab you open supports cats in need.'
    )
  })

  it('component shows mission slide if show Missions slide is enabled', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const mockProps = {
      ...getMockProps(),
      showMissionSlide: true,
    }
    const wrapper = shallow(<OnboardingFlow {...mockProps} />)
    wrapper.find(Button).first().simulate('click')
    expect(wrapper.find('img').first().prop('src')).toEqual(
      media(mockProps.onboarding.steps[1].imgName)
    )
    expect(wrapper.find(Markdown).first().prop('children')).toEqual(
      'Help more cats with squads'
    )
  })

  it('component does not show mission slide if show Missions slide is disabled', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const props = getMockProps()
    const wrapper = shallow(<OnboardingFlow {...props} />)
    wrapper.find(Button).first().simulate('click')
    expect(wrapper.find('img').first().prop('src')).toEqual(
      media(props.onboarding.steps[2].imgName)
    )
    expect(wrapper.find(Markdown).first().prop('children')).toEqual(
      "It doesn't cost you a thing"
    )
  })

  it('component calls onComplete on after iterating through all steps', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const onCompleteFn = jest.fn()
    const mockProps = {
      ...getMockProps(),
      onComplete: onCompleteFn,
      showMissionSlide: true,
    }
    const wrapper = shallow(<OnboardingFlow {...mockProps} />)
    expect(wrapper.find('img').first().prop('src')).toEqual(
      media(mockProps.onboarding.steps[0].imgName)
    )

    for (let i = 1; i < 3; i += 1) {
      wrapper.find(Button).first().simulate('click')
      wrapper.update()
      expect(onCompleteFn).not.toHaveBeenCalled()
    }

    wrapper.find(Button).first().simulate('click')
    expect(onCompleteFn).toHaveBeenCalled()
  })
})
