import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
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

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
  },
  button: {
    padding: 4,
  },
}))

const SocialShare = (props) => {
  const {
    EmailShareButtonProps,
    FacebookShareButtonProps,
    RedditShareButtonProps,
    TumblrShareButtonProps,
    TwitterShareButtonProps,
    url,
    iconSize,
  } = props

  const classes = useStyles()
  // Note: hashtags for Facebook and Twitter are hardcoded.
  // We may want to move them server-side if we use them often.
  return (
    <div className={classes.root}>
      {FacebookShareButtonProps.quote ? (
        <div className={classes.button}>
          <FacebookShareButton
            quote={FacebookShareButtonProps.quote}
            hashtag={FacebookShareButtonProps.hashtag}
            url={url}
          >
            <FacebookIcon size={iconSize} round />
          </FacebookShareButton>
        </div>
      ) : null}
      {TwitterShareButtonProps.title ? (
        <div className={classes.button}>
          <TwitterShareButton
            title={TwitterShareButtonProps.title}
            via={TwitterShareButtonProps.via}
            hashtags={TwitterShareButtonProps.hashtags}
            related={TwitterShareButtonProps.related}
            url={url}
          >
            <TwitterIcon size={iconSize} round />
          </TwitterShareButton>
        </div>
      ) : null}
      {RedditShareButtonProps.title ? (
        <div className={classes.button}>
          <RedditShareButton title={RedditShareButtonProps.title} url={url}>
            <RedditIcon size={iconSize} round />
          </RedditShareButton>
        </div>
      ) : null}
      {TumblrShareButtonProps.title ? (
        <div className={classes.button}>
          <TumblrShareButton
            title={TumblrShareButtonProps.title}
            caption={TumblrShareButtonProps.caption}
            url={url}
          >
            <TumblrIcon size={iconSize} round />
          </TumblrShareButton>
        </div>
      ) : null}
      {EmailShareButtonProps.subject ? (
        <div className={classes.button}>
          <EmailShareButton
            subject={EmailShareButtonProps.subject}
            body={EmailShareButtonProps.body}
            separator={EmailShareButtonProps.separator}
            url={url}
          >
            <EmailIcon size={iconSize} round />
          </EmailShareButton>
        </div>
      ) : null}
    </div>
  )
}

SocialShare.propTypes = {
  // https://github.com/nygardk/react-share#api
  EmailShareButtonProps: PropTypes.shape({
    subject: PropTypes.string,
    body: PropTypes.string,
    separator: PropTypes.string,
  }),
  FacebookShareButtonProps: PropTypes.shape({
    quote: PropTypes.string,
    hashtag: PropTypes.string,
  }),
  RedditShareButtonProps: PropTypes.shape({
    title: PropTypes.string,
  }),
  TumblrShareButtonProps: PropTypes.shape({
    title: PropTypes.string,
    caption: PropTypes.string,
  }),
  TwitterShareButtonProps: PropTypes.shape({
    title: PropTypes.string,
    via: PropTypes.string,
    hashtags: PropTypes.arrayOf(PropTypes.string),
    related: PropTypes.arrayOf(PropTypes.string),
  }),
  url: PropTypes.string.isRequired,
  iconSize: PropTypes.number,
}

SocialShare.defaultProps = {
  EmailShareButtonProps: undefined,
  TumblrShareButtonProps: {
    title:
      'Want to make a paw-sitive impact? Help give shelter cats a new chance for a forever home!',
    caption:
      'Every time I open a new tab I am able to give a treat to a cat for positive reinforcement training with Tab for a Cause’s latest project, Tab for a Cats! Download it for free with my link and give 10 treats right away!',
  },
  TwitterShareButtonProps: {
    title:
      'I just found the purr-fect new way to help shelter cats get adopted! All I had to do was open a new browser tab ( with super cute cat pictures!) on Tab for Cats! Check it out:',
  },
  RedditShareButtonProps: {
    title:
      ' Looking for the purr-fect way to help shelter cats get adopted? Check out Tab for Cats!',
  },
  FacebookShareButtonProps: {
    quote:
      'I just found, purr-haps, the most claw-ver browser extension ever! With Tab for a Cause’s latest project, Tab for Cats, I can give a cat a treat to a shelter cat for positive reinforcement training everytime I open a new tab. Check it out:',
  },
  iconSize: 32,
}

export default SocialShare
