import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Logo from 'src/components/Logo'
import Link from 'src/components/Link'
import {
  EXTERNAL_CONTACT_US_URL,
  EXTERNAL_CLEAR_COOKIES_HELP_PAGE,
  reload,
  externalNavigation,
} from 'src/utils/urls'

const ErrorPage = () => (
  <div
    style={{
      margin: 0,
      padding: 0,
      height: '100vh',
    }}
  >
    <div
      style={{
        padding: '20px 40px',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <Logo style={{ height: 40 }} includeText />
    </div>
    <div
      style={{
        height: '100vh',
        display: 'flex',
        padding: '0px 0px 80px 0px',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 400,
        }}
      >
        <Typography variant="h6" style={{ margin: 10 }}>
          Oops! There was an error.
        </Typography>
        <Typography variant="body1" style={{ margin: 10 }}>
          Please try{' '}
          <Link
            to={EXTERNAL_CLEAR_COOKIES_HELP_PAGE}
            target="_blank"
            style={{ textDecoration: 'underline' }}
          >
            clearing your cookies
          </Link>{' '}
          or reloading, then contact us if the problem continues.
        </Typography>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 20,
          }}
        >
          <Button
            color="default"
            style={{ margin: 10 }}
            onClick={() => {
              externalNavigation(EXTERNAL_CONTACT_US_URL)
            }}
          >
            Contact us
          </Button>
          <Button
            color="primary"
            variant="contained"
            style={{ margin: 10 }}
            onClick={() => {
              reload()
            }}
          >
            Reload
          </Button>
        </div>
      </div>
    </div>
  </div>
)
export default ErrorPage
