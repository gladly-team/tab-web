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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 0,
  },
  button: {
    display: 'inline',
    padding: theme.spacing(2),
  },
}))

const SocialShare = (props) => {
  const {
    EmailShareButtonProps,
    FacebookShareButtonProps,
    TwitterShareButtonProps,
    url,
    iconSize,
    user,
  } = props
  const classes = useStyles()
  const { cause } = user
  const { sharing } = cause || { sharing: {} }
  return (
    <div className={classes.root}>
      {sharing.facebookButtonTitle ? (
        <div className={classes.button}>
          <FacebookShareButton
            quote={sharing.facebookButtonTitle}
            hashtag={FacebookShareButtonProps.hashtag}
            url={url}
          >
            <FacebookIcon size={iconSize} round />
          </FacebookShareButton>
        </div>
      ) : null}
      {sharing.twitterButtonTitle ? (
        <div className={classes.button}>
          <TwitterShareButton
            title={sharing.twitterButtonTitle}
            via={TwitterShareButtonProps.via}
            hashtags={TwitterShareButtonProps.hashtags}
            related={TwitterShareButtonProps.related}
            url={url}
          >
            <TwitterIcon size={iconSize} round />
          </TwitterShareButton>
        </div>
      ) : null}
      {sharing.redditButtonTitle ? (
        <div className={classes.button}>
          <RedditShareButton title={sharing.redditButtonTitle} url={url}>
            <RedditIcon size={iconSize} round />
          </RedditShareButton>
        </div>
      ) : null}
      {sharing.tumblrTitle ? (
        <div className={classes.button}>
          <TumblrShareButton
            title={sharing.tumblrTitle}
            caption={sharing.tumblrCaption}
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
  TwitterShareButtonProps: PropTypes.shape({
    via: PropTypes.string,
    hashtags: PropTypes.arrayOf(PropTypes.string),
    related: PropTypes.arrayOf(PropTypes.string),
  }),
  url: PropTypes.string.isRequired,
  iconSize: PropTypes.number,
  user: PropTypes.shape({
    cause: PropTypes.shape({
      sharing: PropTypes.shape({
        facebookButtonTitle: PropTypes.string,
        redditButtonTitle: PropTypes.string,
        twitterButtonTitle: PropTypes.string,
        tumblrTitle: PropTypes.string,
        tumblrCaption: PropTypes.string,
      }),
    }),
  }),
}

SocialShare.defaultProps = {
  EmailShareButtonProps: {},
  TwitterShareButtonProps: {
    title: '',
  },
  FacebookShareButtonProps: {
    quote: '',
  },
  user: {
    cause: {
      sharing: {},
    },
  },
  iconSize: 32,
}

export default SocialShare
