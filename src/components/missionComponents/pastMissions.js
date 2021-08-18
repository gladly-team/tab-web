import React, { useEffect, useState, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import NoCompletedMissions from 'src/assets/images/noCompletedMissions.svg'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MissionComplete from 'src/components/MissionComponents/MissionComplete'
import allStar from 'src/assets/images/allStar.svg'
import consistentKitty from 'src/assets/images/consistentKitty.svg'
import hotPaws from 'src/assets/images/hotPaws.svg'
import clsx from 'clsx'
import moment from 'moment'

const Accordion = withStyles({
  root: {
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, .12)',
    boxShadow: 'none',
    // '&:not(:last-child)': {
    //   borderBottom: 0,
    // },
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
  titleFont: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  subtitleFont: {
    fontSize: '16px',
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
  accordianFont: { fontWeight: 'bold', fontSize: '14px' },
}))
const PastMissionsComponent = ({
  user: {
    pastMissions: { edges },
    currentMission,
    username,
    id,
  },
  ...rest
}) => {
  const cx = useStyles()
  const [expanded, setExpanded] = React.useState('')

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }
  const getIcons = (userId, endOfMissionAwards) => {
    console.log(rest, endOfMissionAwards, 'what')
    const awardsForUser = endOfMissionAwards
      .filter((award) => award.user === userId)
      .map(({ awardType }) => {
        let awardImage
        switch (awardType) {
          case 'Hot Paws':
            awardImage = hotPaws
            break
          case 'Consistent Kitty':
            awardImage = consistentKitty
            break
          case 'All-Star Fur Ball':
            awardImage = allStar
            break
          default:
            break
        }
        return <img src={awardImage} alt={awardType} width="16px" />
      })
    return <>{awardsForUser}</>
  }
  console.log(edges, currentMission, 'what i got in past missions')
  return (
    <Paper elevation={1} className={cx.topContainer}>
      <Typography classes={{ root: cx.titleFont }}>Past Missions</Typography>
      <Typography className={cx.subtitleFont}>
        {`${edges.length} Missions Completed. ${
          currentMission ? 1 : 0
        } Ongoing.`}
      </Typography>
      <Typography className={cx.subtitleFont}>
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
            className={cx.subtitleFont}
            style={{ maxWidth: '464px', textAlign: 'center' }}
          >
            You don’t have any past missions yet! Your mission info will appear
            here once you create a squad, and complete your first mission.
          </Typography>
        </div>
      )}
      {edges.length > 0 && (
        <div className={cx.noMissionsContainer}>
          {edges
            // .sort((a, b) => a.node.completed - b.node.completed)
            .map(({ node }) => (
              <Accordion
                square
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography
                    className={cx.subtitleFont}
                    style={{ fontSize: '12px' }}
                  >
                    {`${moment().diff(
                      moment(node.completed),
                      'days'
                    )} days ago`}
                  </Typography>
                  <Typography className={cx.accordianFont}>
                    {node.squadName}
                  </Typography>
                  <Typography
                    className={clsx(cx.accordianFont, cx.purpleColor)}
                  >
                    1 training session for a shelter cat
                  </Typography>
                  {/* {node.squadMembers.map((user) => (
                    <>
                      <Typography> {user.username}</Typography>
                      {getIcons(id, node.endOfMissionAwards)}
                      <Typography>,</Typography>
                    </>
                  ))} */}
                  {node.squadMembers.map((user) => (
                    <Typography>{user.username}</Typography>
                  ))}
                </AccordionSummary>
                <AccordionDetails>
                  <MissionComplete mission={node} user={{ username, id }} />
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
    the status of the current mission
  */
  user: PropTypes.shape({
    pastMissions: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.any),
    }),
  }).isRequired,
}
PastMissionsComponent.defaultProps = {
  status: '',
}
export default PastMissionsComponent
