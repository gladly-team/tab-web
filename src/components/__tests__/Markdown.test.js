import fs from 'fs'
import path from 'path'
import React from 'react'
import { mount } from 'enzyme'

jest.mock('src/components/Link')

const getMockProps = () => ({
  children: '# Hi there!',
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Markdown component', () => {
  it('renders without error', () => {
    const Markdown = require('src/components/Markdown').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<Markdown {...mockProps} />)
    }).not.toThrow()
  })

  it('renders markdown as expected', async () => {
    expect.assertions(1)
    const Markdown = require('src/components/Markdown').default

    const inputFilePath = path.join(
      __dirname,
      '../../',
      'utils/testHelpers/testMarkdown-A.md'
    )
    const testMarkdown = await fs.promises.readFile(inputFilePath)
    const mockProps = {
      ...getMockProps(),
      children: testMarkdown,
    }
    const wrapper = mount(<Markdown {...mockProps} />)
    const expectedHTMLFilePath = path.join(
      __dirname,
      '../../',
      'utils/testHelpers/testHTML-A.html'
    )
    const expectedOutput = await fs.promises.readFile(
      expectedHTMLFilePath,
      'utf-8'
    )
    expect(wrapper.html()).toEqual(expectedOutput)
  })

  it('renders plain text as a paragraph', () => {
    const Markdown = require('src/components/Markdown').default
    const mockProps = {
      ...getMockProps(),
      children: 'hello!',
    }
    const wrapper = mount(<Markdown {...mockProps} />)
    const expectedHTML =
      '<div><p class="MuiTypography-root MuiTypography-body2 MuiTypography-paragraph">hello!</p></div>'
    expect(wrapper.html()).toEqual(expectedHTML)
  })

  it('renders a link to expected html', () => {
    const Markdown = require('src/components/Markdown').default
    const mockProps = {
      ...getMockProps(),
      children: '[i am a link](https://example.com)',
    }
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(<Markdown {...mockProps} />)

    // Uses mock Link component
    const expectedHTML =
      '<div><p class="MuiTypography-root MuiTypography-body2 MuiTypography-paragraph"><a data-test-id="mock-link" target="_blank" href="https://example.com">i am a link</a></p></div>'
    expect(wrapper.html()).toEqual(expectedHTML)
  })

  it('does not render script tags', () => {
    const Markdown = require('src/components/Markdown').default
    const mockProps = {
      ...getMockProps(),
      children: 'well well <script>alert("uh oh")</script>',
    }
    const wrapper = mount(<Markdown {...mockProps} />)
    const expectedHTML =
      '<div><p class="MuiTypography-root MuiTypography-body2 MuiTypography-paragraph">well well alert("uh oh")</p></div>'
    expect(wrapper.html()).toEqual(expectedHTML)
  })
})
