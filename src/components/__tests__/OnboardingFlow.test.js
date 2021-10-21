import React from 'react'
import { shallow } from 'enzyme'
import Markdown from 'src/components/Markdown'
import Button from '@material-ui/core/Button'
import catTabs from 'src/assets/onboarding/cattabs.svg'
import squadCat from 'src/assets/onboarding/squadcat.svg'
import adCat from 'src/assets/onboarding/adcat.svg'
import seas1 from 'src/assets/onboarding/seas1.svg'
import seas2 from 'src/assets/onboarding/seas2.svg'
import seas3 from 'src/assets/onboarding/seas3.svg'

const getMockProps = () => ({
  showMissionSlide: false,
  onboarding: {
    steps: [
      {
        imgName: 'cattabs',
        title: 'Your tabs are doing great things',
        subtitle: 'Now, every tab you open supports cats in need.',
      },
      {
        imgName: 'squadcat',
        title: 'Help more cats with squads',
        subtitle: 'Cats can get adopted up to 3x faster when you join a squad!',
      },
      {
        imgName: 'adcat',
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
    const wrapper = shallow(<OnboardingFlow {...getMockProps()} />)

    expect(wrapper.find('img').first().prop('src')).toEqual(catTabs)
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
    expect(wrapper.find('img').first().prop('src')).toEqual(squadCat)
    expect(wrapper.find(Markdown).first().prop('children')).toEqual(
      'Help more cats with squads'
    )
  })

  it('component does not show mission slide if show Missions slide is disabled', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const wrapper = shallow(<OnboardingFlow {...getMockProps()} />)
    wrapper.find(Button).first().simulate('click')
    expect(wrapper.find('img').first().prop('src')).toEqual(adCat)
    expect(wrapper.find(Markdown).first().prop('children')).toEqual(
      "It doesn't cost you a thing"
    )
  })

  it('component shows correct images based on image name', () => {
    const OnboardingFlow = require('src/components/OnboardingFlow').default
    const stringToAssetMap = {
      cattabs: catTabs,
      squadcat: squadCat,
      adcat: adCat,
      seas1,
      seas2,
      seas3,
      blahblah: catTabs,
    }

    Object.keys(stringToAssetMap).forEach((key) => {
      const mockProps = {
        ...getMockProps(),
        onboarding: {
          steps: [
            {
              imgName: key,
              title: 'Your tabs are doing great things',
              subtitle: 'Now, every tab you open supports cats in need.',
            },
          ],
        },
      }
      const wrapper = shallow(<OnboardingFlow {...mockProps} />)
      expect(wrapper.find('img').first().prop('src')).toEqual(
        stringToAssetMap[key]
      )
    })
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
    expect(wrapper.find('img').first().prop('src')).toEqual(catTabs)

    for (let i = 1; i < 3; i += 1) {
      wrapper.find(Button).first().simulate('click')
      wrapper.update()
      expect(onCompleteFn).not.toHaveBeenCalled()
    }

    wrapper.find(Button).first().simulate('click')
    expect(onCompleteFn).toHaveBeenCalled()
  })
})
