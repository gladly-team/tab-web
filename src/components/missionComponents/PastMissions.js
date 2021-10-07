import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import NoCompletedMissions from 'src/assets/images/noCompletedMissions.svg'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MissionComplete from 'src/components/missionComponents/MissionComplete'
import moment from 'moment'

const Accordion = withStyles({
  root: {
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, .12)',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    borderBottom: '1px solid rgba(0, 0, 0, .12)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
}))(MuiAccordionDetails)
const useStyles = makeStyles((theme) => ({
  topContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    minHeight: '466px',
    marginBottom: theme.spacing(4),
  },
  purpleColor: {
    color: theme.palette.primary.main,
  },
  noMissionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  missionContainer: {
    paddingTop: theme.spacing(4),
  },
  subtitleFont: {
    color: theme.palette.colors.subtitleGrey,
  },
  hr: {
    marginLeft: 0,
    marginRight: 0,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    width: '100%',
  },
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))
const PastMissionsComponent = ({
  user: {
    pastMissions: { edges },
    currentMission,
    username,
    id,
  },
}) => {
  const cx = useStyles()
  const [expanded, setExpanded] = useState('')

  const handleChange = (panel) => {
    setExpanded(expanded === panel ? false : panel)
  }

  // const getIcons = (userId, endOfMissionAwards) => {
  //   console.log(rest, endOfMissionAwards, 'what')
  //   const awardsForUser = endOfMissionAwards
  //     .filter((award) => award.user === userId)
  //     .map(({ awardType }) => {
  //       let awardImage
  //       switch (awardType) {
  //         case 'Hot Paws':
  //           awardImage = hotPaws
  //           break
  //         case 'Consistent Kitty':
  //           awardImage = consistentKitty
  //           break
  //         case 'All-Star Fur Ball':
  //           awardImage = allStar
  //           break
  //         default:
  //           break
  //       }
  //       return <img src={awardImage} alt={awardType} width="16px" />
  //     })
  //   return <>{awardsForUser}</>
  // }
  return (
    <Paper elevation={1} className={cx.topContainer}>
      <Typography variant="h5">Past Missions</Typography>
      <Typography variant="subtitle1" className={cx.subtitleFont}>
        {`${edges.length} Missions Completed. ${
          currentMission ? 1 : 0
        } Ongoing.`}
      </Typography>
      <Typography variant="subtitle1" className={cx.subtitleFont}>
        Find your past missions and squads here after you complete them.
      </Typography>
      <hr className={cx.hr} />
      {edges.length === 0 && (
        <div className={cx.noMissionsContainer}>
          <img
            src={NoCompletedMissions}
            alt="no missions complete"
            width="250px"
            height="180px"
          />
          <Typography
            variant="subtitle1"
            className={cx.subtitleFont}
            style={{ maxWidth: '464px', textAlign: 'center' }}
          >
            You don’t have any past missions yet! Your mission info will appear
            here once you create a squad, and complete your first mission.
          </Typography>
        </div>
      )}
      {edges.length > 0 && (
        <div>
          {[...edges]
            .sort((a, b) =>
              moment(a.node.completed).isBefore(b.node.completed) ? 1 : -1
            )
            .map(({ node }, index) => (
              <Accordion
                key={node.missionId}
                square
                expanded={expanded === `panel${index}`}
                onChange={() => handleChange(`panel${index}`)}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography className={cx.subtitleFont} variant="caption">
                    {`${moment().diff(
                      moment(node.completed),
                      'days'
                    )} days ago`}
                  </Typography>
                  <Typography variant="h6">{node.squadName}</Typography>
                  <Typography variant="h6" className={cx.purpleColor}>
                    1 training session for a shelter cat
                  </Typography>
                  {/* {node.squadMembers.map((user) => (
                    <>
                      <Typography> {user.username}</Typography>
                      {getIcons(id, node.endOfMissionAwards)}
                      <Typography>,</Typography>
                    </>
                  ))} */}
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {node.squadMembers
                      .filter((user) => !!user.username)
                      .map((user, idx) => (
                        <Typography
                          style={{ marginRight: '8px' }}
                          key={user.username + user.invitedEmail}
                        >
                          {user.username}
                          {idx <
                            node.squadMembers.filter((usr) => !!usr.username)
                              .length -
                              1 && ','}
                        </Typography>
                      ))}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <MissionComplete
                    className={cx.missionContainer}
                    mission={node}
                    user={{ username, id }}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
        </div>
      )}
    </Paper>
  )
}

PastMissionsComponent.displayName = 'PastMissionsComponent'
PastMissionsComponent.propTypes = {
  /**
    the user object
  */
  user: PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.string,
    pastMissions: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          squadName: PropTypes.string,
          started: PropTypes.string,
          completed: PropTypes.string,
          missionId: PropTypes.string,
          status: PropTypes.string,
          tabGoal: PropTypes.number,
          tabCount: PropTypes.number,
          squadMembers: PropTypes.arrayOf(
            PropTypes.shape({
              username: PropTypes.string,
              invitedEmail: PropTypes.string,
              status: PropTypes.string,
              tabs: PropTypes.number,
            })
          ),
          endOfMissionAwards: PropTypes.arrayOf(
            PropTypes.shape({
              user: PropTypes.string,
              awardType: PropTypes.string,
              unit: PropTypes.number,
            })
          ),
        })
      ),
    }),
    currentMission: PropTypes.shape({
      squadName: PropTypes.string,
      started: PropTypes.string,
      completed: PropTypes.string,
      missionId: PropTypes.string,
      status: PropTypes.string,
      tabGoal: PropTypes.number,
      tabCount: PropTypes.number,
      squadMembers: PropTypes.arrayOf(
        PropTypes.shape({
          username: PropTypes.string,
          invitedEmail: PropTypes.string,
          status: PropTypes.string,
          tabs: PropTypes.number,
        })
      ),
      endOfMissionAwards: PropTypes.arrayOf(
        PropTypes.shape({
          user: PropTypes.string,
          awardType: PropTypes.string,
          unit: PropTypes.number,
        })
      ),
    }),
  }).isRequired,
}

export default PastMissionsComponent
