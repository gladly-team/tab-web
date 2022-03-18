import React from 'react'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import TwitterIcon from '@material-ui/icons/Twitter'
import Typography from '@material-ui/core/Typography'
import SvgIcon from '@material-ui/core/SvgIcon'
import { styled, useTheme } from '@material-ui/core/styles'
import logo from 'src/assets/logos/logo-with-text-black.svg'
import GoogleChrome from 'mdi-material-ui/GoogleChrome'
import MicrosoftEdge from 'mdi-material-ui/MicrosoftEdge'
import AppleSafari from 'mdi-material-ui/AppleSafari'
import FooterBlobLeft from 'src/components/FooterBlobLeft'
import FooterBlobRight from 'src/components/FooterBlobRight'
import grey from '@material-ui/core/colors/grey'
import {
  adblockerWhitelistingURL,
  chromeExtensionURL,
  contactUsURL,
  edgeExtensionURL,
  externalHelpURL,
  facebookPageURL,
  FINANCIALS_URL,
  instagramPageURL,
  jobsURL,
  privacyPolicyURL,
  safariExtensionURL,
  teamURL,
  termsURL,
  twitterPageURL,
  tiktokPageURL,
} from 'src/utils/urls'

import Link from 'src/components/Link'

const DivBackgroundContainer = styled('div')(() => ({
  background: grey['100'],
  paddingBottom: 20,
  display: 'flex',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
}))

const LinkTiktok = styled(Link)(({ theme }) => ({
  marginRight: theme.spacing(1),
}))

const TypographySocial = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
}))

const DivContentRow = styled('div')(() => ({
  display: 'flex',
  width: '80%',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  zIndex: '1',
}))

const DivColumnOne = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(6.5),
  display: 'flex',
  flexDirection: 'column',
  color: '#fff',
  minWidth: theme.spacing(36),
  flex: 1,
}))

const DivColumnTwo = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(6.5),
  width: theme.spacing(38),
  display: 'flex',
  flexWrap: 'nowrap',
  flexDirection: 'row',
  color: '#fff',
  flex: 2,
  justifyContent: 'flex-start',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'flex-start',
  },
}))

const DivSubColumn = styled('div')(() => ({
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  color: '#fff',
  width: 200,
}))

const DivSubColumnTwo = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  color: '#fff',
  width: 300,
}))

const DivIconRowOne = styled('div')(({ theme }) => ({
  display: 'flex',
  color: '#fff',
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(-1.5),
}))

const DivIconRowTwo = styled('div')(() => ({
  display: 'flex',
  color: '#fff',
}))

const Footer = () => {
  const theme = useTheme()
  const iconButtonStyles = {
    borderRadius: '10%',
  }
  const iconStyles = {
    color: theme.palette.text.primary,
    backgroundColor: '#fff',
    padding: theme.spacing(0.25),
    height: theme.spacing(4),
    width: theme.spacing(4),
    borderRadius: theme.spacing(0.5),
  }
  return (
    <DivBackgroundContainer>
      <Box
        sx={{
          position: 'absolute',
          width: 660,
          height: 560,
          left: {
            xs: -440,
            md: -100,
          },
          top: {
            xs: 0,
            md: 80,
          },
        }}
      >
        <FooterBlobLeft color="#F1F1F1" />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          width: 320,
          height: 570,
          right: {
            xs: 0,
            md: 200,
          },
          bottom: {
            xs: -440,
            md: -480,
          },
        }}
      >
        <FooterBlobRight color="#F1F1F1" />
      </Box>
      <DivContentRow>
        <DivColumnOne>
          <Box sx={{ mb: 1 }}>
            <Link to="/">
              <img src={logo} style={{ height: 43 }} alt="logo" />
            </Link>
          </Box>
          <TypographySocial variant="subtitle2" color="textPrimary">
            Social
          </TypographySocial>
          <DivIconRowOne>
            <LinkTiktok
              to={tiktokPageURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton style={iconButtonStyles} size="medium">
                <SvgIcon
                  viewBox="0 0 35 35"
                  style={{
                    fill: '#fff',
                    width: '32px',
                    height: 'auto',
                  }}
                >
                  <rect
                    y="0.599609"
                    width="35"
                    height="35"
                    rx="4"
                    fill="white"
                  />
                  <path
                    opacity="0.7"
                    d="M22.2611 14.997C23.7021 16.0264 25.4672 16.6322 27.3737 16.6322V12.9654C27.0129 12.9655 26.6531 12.9279 26.3001 12.8531V15.7394C24.3937 15.7394 22.6287 15.1337 21.1874 14.1042V21.5871C21.1874 25.3304 18.1514 28.3647 14.4064 28.3647C13.009 28.3647 11.7102 27.9425 10.6313 27.2184C11.8627 28.4768 13.58 29.2574 15.4798 29.2574C19.225 29.2574 22.2613 26.2231 22.2613 22.4797V14.997H22.2611ZM23.5856 11.2976C22.8492 10.4935 22.3657 9.45437 22.2611 8.30555V7.83392H21.2437C21.4998 9.29407 22.3733 10.5415 23.5856 11.2976ZM13.0001 24.3459C12.5886 23.8067 12.3663 23.1471 12.3673 22.4689C12.3673 20.7569 13.756 19.3687 15.4692 19.3687C15.7885 19.3687 16.1059 19.4175 16.4102 19.514V15.7653C16.0546 15.7166 15.6957 15.6959 15.337 15.7035V18.6213C15.0325 18.5248 14.7149 18.4758 14.3956 18.4761C12.6823 18.4761 11.2937 19.8641 11.2937 21.5764C11.2937 22.7871 11.9878 23.8353 13.0001 24.3459Z"
                    fill="#2E282A"
                  />
                  <path
                    d="M21.1875 14.1042C22.6288 15.1336 24.3938 15.7393 26.3001 15.7393V12.853C25.236 12.6265 24.294 12.0707 23.5857 11.2976C22.3733 10.5415 21.4998 9.29399 21.2437 7.83392H18.5711V22.4795C18.5651 24.1869 17.1788 25.5694 15.4692 25.5694C14.4617 25.5694 13.5667 25.0894 12.9999 24.3459C11.9877 23.8353 11.2936 22.787 11.2936 21.5765C11.2936 19.8643 12.6822 18.4762 14.3955 18.4762C14.7237 18.4762 15.0401 18.5273 15.3369 18.6214V15.7035C11.6577 15.7795 8.69873 18.7842 8.69873 22.4796C8.69873 24.3243 9.43558 25.9966 10.6315 27.2184C11.7104 27.9425 13.0092 28.3648 14.4065 28.3648C18.1516 28.3648 21.1876 25.3303 21.1876 21.5871V14.1042H21.1875Z"
                    fill="#2E282A"
                  />
                  <path
                    opacity="0.4"
                    d="M26.3 12.8531V12.0727C25.3404 12.0741 24.3997 11.8055 23.5856 11.2976C24.3063 12.0862 25.2553 12.63 26.3 12.8531ZM21.2436 7.83398C21.2192 7.69443 21.2004 7.55397 21.1874 7.41297V6.94135H17.4972V21.5871C17.4913 23.2942 16.1051 24.6767 14.3954 24.6767C13.8934 24.6767 13.4195 24.5576 12.9998 24.346C13.5666 25.0894 14.4616 25.5693 15.469 25.5693C17.1785 25.5693 18.565 24.187 18.571 22.4796V7.83398H21.2436ZM15.3369 15.7036V14.8728C15.0286 14.8307 14.7177 14.8095 14.4065 14.8097C10.6611 14.8096 7.625 17.8441 7.625 21.5871C7.625 23.9337 8.81824 26.0018 10.6315 27.2183C9.43554 25.9965 8.69868 24.3242 8.69868 22.4796C8.69868 18.7843 11.6576 15.7796 15.3369 15.7036Z"
                    fill="#2E282A"
                  />
                </SvgIcon>
              </IconButton>
            </LinkTiktok>
            <Link
              to={facebookPageURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton edge="start" style={iconButtonStyles} size="medium">
                <FacebookIcon style={iconStyles} />
              </IconButton>
            </Link>

            <Link
              to={instagramPageURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton style={iconButtonStyles} size="medium">
                <InstagramIcon style={iconStyles} />
              </IconButton>
            </Link>

            <Link to={twitterPageURL} target="_blank" rel="noopener noreferrer">
              <IconButton style={iconButtonStyles} size="medium">
                <TwitterIcon style={iconStyles} />
              </IconButton>
            </Link>
          </DivIconRowOne>
          <Typography variant="subtitle2" color="textPrimary">
            Browser Compatibility
          </Typography>
          <DivIconRowTwo>
            <Link
              to={chromeExtensionURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton edge="start" style={iconButtonStyles} size="medium">
                <GoogleChrome style={iconStyles} />
              </IconButton>
            </Link>
            <Link
              to={edgeExtensionURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton style={iconButtonStyles} size="medium">
                <MicrosoftEdge style={iconStyles} />
              </IconButton>
            </Link>
            <Link
              to={safariExtensionURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton style={iconButtonStyles} size="medium">
                <AppleSafari style={iconStyles} />
              </IconButton>
            </Link>
          </DivIconRowTwo>
        </DivColumnOne>
        <DivColumnTwo>
          <DivSubColumn>
            <Link to={externalHelpURL}>
              <Typography variant="subtitle2" gutterBottom color="textPrimary">
                Help Center
              </Typography>
            </Link>
            <Link to={FINANCIALS_URL}>
              <Typography variant="subtitle2" gutterBottom color="textPrimary">
                Financials
              </Typography>
            </Link>
            <Link to={privacyPolicyURL}>
              <Typography variant="subtitle2" gutterBottom color="textPrimary">
                Privacy
              </Typography>
            </Link>
            <Link to={termsURL}>
              <Typography variant="subtitle2" gutterBottom color="textPrimary">
                Terms
              </Typography>
            </Link>
            <Link to={adblockerWhitelistingURL}>
              <Typography variant="subtitle2" gutterBottom color="textPrimary">
                Ad Blockers
              </Typography>
            </Link>
          </DivSubColumn>
          <DivSubColumnTwo>
            <Link to={teamURL}>
              <Typography variant="subtitle2" gutterBottom color="textPrimary">
                Team
              </Typography>
            </Link>
            <Link to={contactUsURL}>
              <Typography variant="subtitle2" gutterBottom color="textPrimary">
                Contact
              </Typography>
            </Link>
            <Link to={jobsURL}>
              <Typography variant="subtitle2" gutterBottom color="textPrimary">
                Jobs
              </Typography>
            </Link>
          </DivSubColumnTwo>
        </DivColumnTwo>
      </DivContentRow>
    </DivBackgroundContainer>
  )
}

Footer.propTypes = {}

export default Footer
