import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import onboarding1 from 'src/assets/onboarding/cattabs.svg'
import onboarding2 from 'src/assets/onboarding/squadcat.svg'
import onboarding3 from 'src/assets/onboarding/adcat.svg'

const getMockProps = () => ({
  onboardingFields: {
    steps: [
      imageSrc:
      title:
      children:
    ]
  }
})

describe('OnboardingFlow component', () => {
  it('renders without error', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    expect(() => {
      shallow(<OnboardingFlow showMissionSlide={false} />)
    }).not.toThrow()
  })

  it('starting flow displays first onboarding card', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const wrapper = shallow(<OnboardingFlow showMissionSlide={false} />)

    expect(wrapper.find('img').first().prop('src')).toEqual(onboarding1)
    expect(wrapper.find(Typography).find({ variant: 'h5' }).text()).toEqual(
      'Your tabs are doing great things'
    )
    expect(
      wrapper.find(Typography).find({ variant: 'body2' }).get(0).props.children
    ).toEqual('Now, every tab you open supports cats in need.')
  })

  it('component shows mission slide if show Missions slide is enabled', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const wrapper = shallow(<OnboardingFlow showMissionSlide />)
    wrapper.find(Button).first().simulate('click')
    expect(wrapper.find('img').first().prop('src')).toEqual(onboarding2)
    expect(
      wrapper.find(Typography).find({ variant: 'h5' }).at(0).text()
    ).toEqual('Help more cats with squads')
  })

  it('component does not show mission slide if show Missions slide is disabled', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const wrapper = shallow(<OnboardingFlow showMissionSlide={false} />)
    wrapper.find(Button).first().simulate('click')
    expect(wrapper.find('img').first().prop('src')).toEqual(onboarding3)
    expect(
      wrapper.find(Typography).find({ variant: 'h5' }).at(0).text()
    ).toEqual("It doesn't cost you a thing")
  })

  it('component calls onComplete on after iterating through all steps', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const onCompleteFn = jest.fn()
    const wrapper = shallow(
      <OnboardingFlow onComplete={onCompleteFn} showMissionSlide />
    )

    for (let i = 1; i < 3; i += 1) {
      wrapper.find(Button).first().simulate('click')
      expect(onCompleteFn).not.toHaveBeenCalled()
    }

    wrapper.find(Button).first().simulate('click')
    expect(onCompleteFn).toHaveBeenCalled()
  })
})
