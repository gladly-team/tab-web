import React from 'react'
import PropTypes from 'prop-types'
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

const useStyles = () => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
  },
  button: {
    padding: 4,
  },
})

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
      {FacebookShareButtonProps ? (
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
      {TwitterShareButtonProps ? (
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
      {RedditShareButtonProps ? (
        <div className={classes.button}>
          <RedditShareButton title={RedditShareButtonProps.title} url={url}>
            <RedditIcon size={iconSize} round />
          </RedditShareButton>
        </div>
      ) : null}
      {TumblrShareButtonProps ? (
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
      {EmailShareButtonProps ? (
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
  FacebookShareButtonProps: undefined,
  RedditShareButtonProps: undefined,
  TumblrShareButtonProps: undefined,
  TwitterShareButtonProps: undefined,
  iconSize: 32,
}

export default SocialShare
