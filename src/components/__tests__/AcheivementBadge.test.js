import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from 'src/utils/theme'
import Typography from '@material-ui/core/Typography'

const mockProps = {
  stat: 20,
  awardType: 'Hot Paws',
  user: '123',
}

describe('AcheivementBadge component', () => {
  it('renders without error', () => {
    const AcheivementBadge = require('src/components/AcheivementBadge').default
    expect(() => {
      mount(
        <ThemeProvider theme={theme}>
          <AcheivementBadge {...mockProps} />
        </ThemeProvider>
      )
    }).not.toThrow()
  })

  it('renders the correct text when award type is Hot Paws', () => {
    const AcheivementBadge = require('src/components/AcheivementBadge').default
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <AcheivementBadge {...mockProps} />
      </ThemeProvider>
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere((elem) => elem.text() === 'Most Tabs in a Day')
        .exists()
    ).toBe(true)
  })

  it('renders the correct text when award type is Consistent Kitty', () => {
    const AcheivementBadge = require('src/components/AcheivementBadge').default
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <AcheivementBadge
          {...{ ...mockProps, awardType: 'Consistent Kitty' }}
        />
      </ThemeProvider>
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere((elem) => elem.text() === 'Longest Tab Streak')
        .exists()
    ).toBe(true)
  })

  it('renders the correct text when award type is All-Star Fur Ball', () => {
    const AcheivementBadge = require('src/components/AcheivementBadge').default
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <AcheivementBadge
          {...{ ...mockProps, awardType: 'All-Star Fur Ball' }}
        />
      </ThemeProvider>
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere((elem) => elem.text() === 'Most Tabs Total')
        .exists()
    ).toBe(true)
  })
})
