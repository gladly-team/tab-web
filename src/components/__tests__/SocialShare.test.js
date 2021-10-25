/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'

const getMockProps = () => ({
  url: 'https://example.com/share-me/',
  EmailShareButtonProps: {
    subject: 'Hi there',
    body: 'This is where we say stuff!',
  },
  TwitterShareButtonProps: {
    related: ['@TabForACause'],
  },
  user: {
    cause: {
      sharing: {
        facebookButtonTitle: 'This is where we say stuff!',
        redditButtonTitle: 'This is the title of the Reddit post.',
        twitterButtonTitle: 'This is my Twitter post title',
        tumblrTitle: 'My Tumblr post title',
        tumblrCaption: 'This is where we say stuff!',
      },
    },
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SocialShare component', () => {
  it('renders without error', () => {
    const SocialShare = require('src/components/SocialShare').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SocialShare {...mockProps} />)
    }).not.toThrow()
  })

  it('renders an EmailShareButton and EmailIcon when EmailShareButtonProps is provided', () => {
    const SocialShare = require('src/components/SocialShare').default
    const mockProps = {
      ...getMockProps(),
      EmailShareButtonProps: {
        subject: 'Hi there',
        body: 'This is where we say stuff!',
      },
    }
    const wrapper = shallow(<SocialShare {...mockProps} />)
    expect(wrapper.find(EmailIcon).exists()).toBe(true)
    expect(wrapper.find(EmailShareButton).exists()).toBe(true)
    expect(wrapper.find(EmailShareButton).props()).toEqual({
      ...mockProps.EmailShareButtonProps,
      children: expect.any(Object),
      url: mockProps.url,
    })
  })

  it('does not render an EmailShareButton or EmailIcon when EmailShareButtonProps is overwritten with an empty object', () => {
    const SocialShare = require('src/components/SocialShare').default
    const mockProps = {
      ...getMockProps(),
      EmailShareButtonProps: {},
    }
    const wrapper = shallow(<SocialShare {...mockProps} />)
    expect(wrapper.find(EmailIcon).exists()).toBe(false)
    expect(wrapper.find(EmailShareButton).exists()).toBe(false)
  })

  it('renders a FacebookShareButton and FacebookIcon when facebookButtonTitle provded', () => {
    const SocialShare = require('src/components/SocialShare').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SocialShare {...mockProps} />)
    expect(wrapper.find(FacebookIcon).exists()).toBe(true)
    expect(wrapper.find(FacebookShareButton).exists()).toBe(true)
    expect(wrapper.find(FacebookShareButton).props()).toEqual({
      hashtag: undefined,
      quote: mockProps.user.cause.sharing.facebookButtonTitle,
      children: expect.any(Object),
      url: mockProps.url,
    })
  })

  it('does not render a FacebookShareButton or FacebookIcon when facebookButtonTitle not provided', () => {
    const SocialShare = require('src/components/SocialShare').default
    const basicMockProps = getMockProps()
    basicMockProps.user.cause.sharing.facebookButtonTitle = ''
    const wrapper = shallow(<SocialShare {...basicMockProps} />)
    expect(wrapper.find(FacebookIcon).exists()).toBe(false)
    expect(wrapper.find(FacebookShareButton).exists()).toBe(false)
  })

  it('renders a RedditShareButton and RedditIcon when no title is provided', () => {
    const SocialShare = require('src/components/SocialShare').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SocialShare {...mockProps} />)
    expect(wrapper.find(RedditIcon).exists()).toBe(true)
    expect(wrapper.find(RedditShareButton).exists()).toBe(true)
    expect(wrapper.find(RedditShareButton).props()).toEqual({
      title: mockProps.user.cause.sharing.redditButtonTitle,
      children: expect.any(Object),
      url: mockProps.url,
    })
  })

  it('does not render a RedditShareButton or RedditIcon when no redditButtonTitle', () => {
    const SocialShare = require('src/components/SocialShare').default
    const mockProps = getMockProps()
    mockProps.user.cause.sharing.redditButtonTitle = ''
    const wrapper = shallow(<SocialShare {...mockProps} />)
    expect(wrapper.find(RedditIcon).exists()).toBe(false)
    expect(wrapper.find(RedditShareButton).exists()).toBe(false)
  })

  it('renders a TumblrShareButton and TumblrIcon when tumblr title and caption are provided', () => {
    const SocialShare = require('src/components/SocialShare').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SocialShare {...mockProps} />)
    expect(wrapper.find(TumblrIcon).exists()).toBe(true)
    expect(wrapper.find(TumblrShareButton).exists()).toBe(true)
    expect(wrapper.find(TumblrShareButton).props()).toEqual({
      caption: mockProps.user.cause.sharing.tumblrCaption,
      title: mockProps.user.cause.sharing.tumblrTitle,
      children: expect.any(Object),
      url: mockProps.url,
    })
  })

  it('does not render a TumblrShareButton or TumblrIcon when no tumblrTitle', () => {
    const SocialShare = require('src/components/SocialShare').default
    const mockProps = getMockProps()
    mockProps.user.cause.sharing.tumblrTitle = ''
    mockProps.user.cause.sharing.tumblrCaption = ''
    const wrapper = shallow(<SocialShare {...mockProps} />)
    expect(wrapper.find(TumblrIcon).exists()).toBe(false)
    expect(wrapper.find(TumblrShareButton).exists()).toBe(false)
  })

  it('renders a TwitterShareButton and TwitterIcon when TwitterShareButtonProps is provided', () => {
    const SocialShare = require('src/components/SocialShare').default
    const mockProps = {
      ...getMockProps(),
      TwitterShareButtonProps: {
        related: ['@TabForACause'],
      },
    }
    const wrapper = shallow(<SocialShare {...mockProps} />)
    expect(wrapper.find(TwitterIcon).exists()).toBe(true)
    expect(wrapper.find(TwitterShareButton).exists()).toBe(true)
    expect(wrapper.find(TwitterShareButton).props()).toEqual({
      ...mockProps.TwitterShareButtonProps,
      title: mockProps.user.cause.sharing.twitterButtonTitle,
      via: undefined,
      children: expect.any(Object),
      url: mockProps.url,
    })
  })

  it('does not render a TwitterShareButton or TwitterIcon when no twitterButtonTitle provided', () => {
    const SocialShare = require('src/components/SocialShare').default
    const mockProps = getMockProps()
    mockProps.user.cause.sharing.twitterButtonTitle = ''
    const wrapper = shallow(<SocialShare {...mockProps} />)
    expect(wrapper.find(TwitterIcon).exists()).toBe(false)
    expect(wrapper.find(TwitterShareButton).exists()).toBe(false)
  })
})
