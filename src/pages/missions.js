import React, { useEffect, useState, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { withSentry, withSentrySSR } from 'src/utils/pageWrappers/withSentry'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import SquadIcon from 'src/assets/icons/SquadIcon'
import { flowRight } from 'lodash/util'
import Link from 'src/components/Link'
import {
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import debounce from 'lodash/debounce'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import withRelay from 'src/utils/pageWrappers/withRelay'
import useData from 'src/utils/hooks/useData'
import FullPageLoader from 'src/components/FullPageLoader'
import logUncaughtErrors from 'src/utils/pageWrappers/logUncaughtErrors'
import { dashboardURL } from 'src/utils/urls'
import withDataSSR from 'src/utils/pageWrappers/withDataSSR'
import CurrentMissionContainer from 'src/components/missionComponents/CurrentMissionContainer'
import PastMissionsContainer from 'src/components/missionComponents/PastMissionsContainer'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    width: '100vw',
    background: theme.palette.colors.backgroundGrey,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowX: 'hidden',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '88%',
    maxWidth: '1280px',
    marginTop: '162px',
    alignItems: 'center',
  },
  headerSection: {
    width: '91%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '1280px',
    paddingTop: theme.spacing(4),
    position: 'fixed',
    background: theme.palette.colors.backgroundGrey,
    paddingBottom: theme.spacing(2),
    zIndex: 10,
  },
  titleSection: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  titleFont: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hr: {
    marginLeft: 0,
    marginRight: 0,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    width: '100%',
  },
  sectionsContainer: {
    overFlowY: 'scroll',
  },
  tabs: {
    alignSelf: 'flex-start',
  },
}))

const getRelayQuery = ({ AuthUser }) => ({
  query: graphql`
    query missionsQuery($userId: String!) {
      user(userId: $userId) {
        ...CurrentMissionContainer_user
        ...PastMissionsContainer_user
        id
      }
    }
  `,
  variables: {
    userId: AuthUser.id,
  },
})

const Missions = ({ data: initialData }) => {
  const { data } = useData({ getRelayQuery, initialData })
  const { user } = data || {}
  const [scrollIndex, setScrollIndex] = useState(0)
  const currentMissionSection = useRef(null)
  const pastMissionsSection = useRef(null)
  const classes = useStyles()

  const debouncedHandleOnSchroll = useMemo(
    () =>
      debounce(() => {
        if (
          // eslint-disable-next-line no-undef
          window.pageYOffset > pastMissionsSection.current.offsetTop - 180 &&
          scrollIndex === 0
        ) {
          setScrollIndex(1)
        } else if (
          // eslint-disable-next-line no-undef
          window.pageYOffset < pastMissionsSection.current.offsetTop - 180 &&
          scrollIndex === 1
        ) {
          setScrollIndex(0)
        }
      }, 200),
    [scrollIndex]
  )
  useEffect(() => {
    // eslint-disable-next-line no-undef
    window.addEventListener('scroll', debouncedHandleOnSchroll, {
      passive: true,
    })
    return () => {
      // eslint-disable-next-line no-undef
      window.removeEventListener('scroll', debouncedHandleOnSchroll)
    }
  }, [scrollIndex, debouncedHandleOnSchroll])

  const setChange = (event, newValue) => {
    // eslint-disable-next-line no-undef
    window.scrollTo({
      left: 0,
      top:
        (newValue === 1
          ? pastMissionsSection.current.offsetTop
          : currentMissionSection.current.offsetTop) - 160,
      behavior: 'smooth',
    })
    setScrollIndex(newValue)
  }
  if (!data) {
    return <FullPageLoader />
  }
  return (
    <div className={classes.pageContainer} data-test-id="missions-page">
      <div className={classes.headerSection}>
        <div className={classes.titleSection}>
          <div className={classes.title}>
            <SquadIcon
              style={{ marginTop: '2px', marginRight: '8px', color: '#9d4ba3' }}
            />
            <Typography classes={{ root: classes.titleFont }}>
              Squads
            </Typography>
          </div>
          <Link to={dashboardURL} className={classes.menuItem}>
            <IconButton>
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
          </Link>
        </div>
        <hr className={classes.hr} />
        <Tabs
          value={scrollIndex}
          onChange={setChange}
          indicatorColor="primary"
          className={classes.tabs}
        >
          <Tab label="Your Squad" />
          <Tab label="Past Missions" />
        </Tabs>
      </div>

      <div className={classes.contentContainer}>
        <div
          ref={currentMissionSection}
          style={{ display: 'flex', width: '100%' }}
        >
          <CurrentMissionContainer user={user} />
        </div>
        <div
          ref={pastMissionsSection}
          style={{ width: '100%', marginTop: '16px' }}
        >
          <PastMissionsContainer user={user} />
        </div>
      </div>
    </div>
  )
}

Missions.displayName = 'Missions'
Missions.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.shape({
      email: PropTypes.string,
      id: PropTypes.string,
      username: PropTypes.string,
    }),
  }),
}
Missions.defaultProps = {
  data: null,
}

export const getServerSideProps = flowRight([
  logUncaughtErrors,
  withAuthUserTokenSSR({
    whenUnauthed: AuthAction.SHOW_LOADER,
    LoaderComponent: FullPageLoader,
  }),
  withSentrySSR,
  withDataSSR(getRelayQuery),
])()
export default flowRight([
  withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
  }),
  withSentry,
  withRelay,
])(Missions)
