import React from 'react'
import { shallow } from 'enzyme'
import { onboardingStepContents } from 'src/components/OnboardingFlow'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

describe('OnboardingFlow component', () => {
  it('renders without error', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    expect(() => {
      shallow(<OnboardingFlow />)
    }).not.toThrow()
  })

  it('starting flow displays first onboarding card', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const wrapper = shallow(<OnboardingFlow />)
    const onboardingStep = onboardingStepContents({})[0]
    const shallowItem = shallow(onboardingStep.children)

    expect(wrapper.find('img').first().prop('src')).toEqual(
      onboardingStep.imageSrc
    )
    expect(wrapper.find(Typography).find({ variant: 'h5' }).text()).toEqual(
      onboardingStep.title
    )
    const { length } = wrapper.find(Typography).find({ variant: 'body2' })
    for (let i = 0; i < length; i += 1) {
      expect(
        wrapper.find(Typography).find({ variant: 'body2' }).get(i).props
          .children
      ).toEqual(
        shallowItem.find(Typography).find({ variant: 'body2' }).get(i).props
          .children
      )
    }
  })

  it('component iterates through all onboarding cards', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const wrapper = shallow(<OnboardingFlow />)
    const onboardingSteps = onboardingStepContents({})

    for (let i = 1; i < onboardingSteps.length; i += 1) {
      wrapper.find(Button).first().simulate('click')
      expect(wrapper.find('img').first().prop('src')).toEqual(
        onboardingSteps[i].imageSrc
      )
      expect(wrapper.find(Typography).find({ variant: 'h5' }).text()).toEqual(
        onboardingSteps[i].title
      )
    }
  })

  it('component calls onComplete on after iterating through all steps', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const onCompleteFn = jest.fn()
    const wrapper = shallow(<OnboardingFlow onComplete={onCompleteFn} />)
    const onboardingSteps = onboardingStepContents({})

    for (let i = 1; i < onboardingSteps.length; i += 1) {
      wrapper.find(Button).first().simulate('click')
      expect(onCompleteFn).not.toHaveBeenCalled()
    }

    wrapper.find(Button).first().simulate('click')
    expect(onCompleteFn).toHaveBeenCalled()
  })
})
