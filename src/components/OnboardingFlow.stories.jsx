import React from 'react'

import OnboardingFlow from './OnboardingFlow'

export default {
  title: 'Components/OnboardingFlow',
  component: OnboardingFlow,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <OnboardingFlow {...args} />

export const reproductiveHealth = Template.bind({})
reproductiveHealth.args = {
  showMissionSlide: false,
  onboarding: {
    steps: [
      {
        title: '### Your tabs are doing great things',
        subtitle:
          'Now, every tab you open supports protecting and providing reproductive health access.\n\nTabbers like you are supporting critical nonprofit work in places where reproductive health care is under attack. Thank you!\n\n',
        imgName: 'reproductiveHealth/onboarding1.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'Support reproductive health care with a squad!\n\nYou and your friends can team up to do more good.\n\n',
        imgName: 'reproductiveHealth/onboarding2.svg',
      },
      {
        title: "### It doesn't cost you a thing",
        subtitle:
          "Ads on the new tab page raise money that we give to nonprofits. Most ads aren't good—but these ones are :)\n\n",
        imgName: 'reproductiveHealth/onboarding3.svg',
      },
    ],
  },
}
reproductiveHealth.parameters = {
  chromatic: {
    delay: 1500,
  },
}

export const trees = Template.bind({})
trees.args = {
  showMissionSlide: false,
  onboarding: {
    steps: [
      {
        title: '### Your tabs have a tree-mendous impact!',
        subtitle:
          'Now, every tab you open works to fight climate change by replanting forests around the world.\n\nTabbers like you are supporting critical nonprofit work to ensure our planet is happy and healthy for years to come. Thank you!\n\n',
        imgName: 'trees/onboarding1.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'Plant trees even faster with a squad!\n\nYou and your friends can team up to plant a forest in no time.',
        imgName: 'trees/onboarding2.svg',
      },
      {
        title: "### It doesn't cost you a thing",
        subtitle:
          "Ads on the new tab page raise money that we give to nonprofits. Most ads aren't good—but these ones are :)\n\n",
        imgName: 'trees/onboarding3.svg',
      },
    ],
  },
}
trees.parameters = {
  chromatic: {
    delay: 1500,
  },
}

export const cats = Template.bind({})
cats.args = {
  showMissionSlide: false,
  onboarding: {
    steps: [
      {
        title: '### Your tabs are doing great things',
        subtitle:
          'Now, every tab you open supports cats in need.\n\nTabbers like you are supporting critical nonprofit work all around the world. Your tabs support initiatives that help shelter cats get adopted, including initiatives that [use treats in positive reinforcement training](https://greatergood.org/jackson-galaxy).\n\nThank you!',
        imgName: 'cats/cattabs.svg',
      },
      {
        title: '### Help more cats with squads\n\n',
        subtitle:
          "Cats can get adopted up to 3x faster when you join a squad!\n\nTeam up with your friends to help pay for a shelter cat's house training. Training a cat is the best way to help it find a permanent home, and it enriches the cat's day to day life while in the shelter.\n\n",
        imgName: 'cats/squadcat.svg',
      },
      {
        title: "### It doesn't cost you a thing",
        subtitle:
          "Ads on the new tab page raise money that we give to nonprofits. Most ads aren't good—but these ones are :)\n\n",
        imgName: 'cats/adcat.svg',
      },
    ],
  },
}
cats.parameters = {
  chromatic: {
    delay: 1500,
  },
}
