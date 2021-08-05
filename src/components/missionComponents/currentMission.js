import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Accordion from '@material-ui/core/Accordion'
import LinearProgress from '@material-ui/core/LinearProgress'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import squadsStep1 from 'src/assets/images/squadsStep1.png'
import squadsStep2 from 'src/assets/images/squadsStep2.png'
import squadsStep3 from 'src/assets/images/squadsStep3.png'

const useStyles = makeStyles((theme) => ({
  topContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
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
  alertIcon: { flexDirection: 'column', justifyContent: 'center' },
  alertRoot: {
    margin: '0px 40px',
    position: 'absolute',
    top: '80px',
    left: 0,
    right: 0,
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      top: '10px',
      margin: '0px 10px',
    },
  },
  explanationCardContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    marginTop: theme.spacing(2),
  },
  explanationCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '250px',
    alignItems: 'center',
  },
  captionFont: {
    fontSize: '12px',
    color: theme.palette.colors.subtitleGrey,
  },
}))
const customAlertUseStyles = makeStyles((theme) => ({
  wrapper: {
    borderRadius: '4px',
    minHeight: '32px',
    border: `1px solid`,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.background,
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    fontSize: '14px',
    marginLeft: theme.spacing(2),
  },
}))
const CustomAlert = ({ text }) => {
  const cx = customAlertUseStyles()
  return (
    <div className={cx.wrapper}>
      <StarBorderIcon color="primary" />
      <Typography classes={{ root: cx.text }}>{text}</Typography>
    </div>
  )
}
const CurrentMissionComponent = ({ user }) => {
  const cx = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }
  const { currentMission = {}, username, id } = user || {}
  const { tabCount = 0, tabGoal = 1000 } = currentMission
  console.log(currentMission, 'current missions')
  //   const renderMissionBasedOnStatus(status) {
  //     switch(status) {
  //       case 'started':
  //         return (<div>started</div>);
  //       default:
  //         return 'foo';
  //     }
  //   }
  return (
    <Paper elevation={1} className={cx.topContainer}>
      <div>
        <Typography classes={{ root: cx.titleFont }}>Your Squad</Typography>
        <Accordion
          elevation={0}
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={cx.subtitleFont}>
              A mission lets you work together with friends to help get a
              shelter cat adopted! When you work together with your squad you
              can make a larger impact, sooner. read more
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className={cx.subtitleFont}>
              Every tab you open supports cats in need. Squads enables you to
              team up with friends and earn more treats together. Cats can get
              adopted up to 3x faster with Squads! You can create your first
              squad today, just start with a couple invites below!
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <hr className={cx.hr} />
      <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
        New Mission
      </Typography>
      <div style={{ display: 'flex' }}>
        <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Status:{' '}
        </Typography>
        <Typography style={{ fontSize: '16px', marginLeft: '8px' }}>
          {currentMission.status}
        </Typography>
      </div>
      <div style={{ marginTop: '16px' }}>
        <CustomAlert text="Team up with your friends and help give a shelter cat a new home and family!" />
      </div>
      <div className={cx.explanationCardContainer}>
        <div className={cx.explanationCard}>
          <img
            src={squadsStep1}
            alt="squad step 1"
            height="180px"
            width="250px"
          />
          <Typography align="center" className={cx.captionFont}>
            1. Open new tabs with your squad
          </Typography>
        </div>
        <div className={cx.explanationCard}>
          <img
            src={squadsStep2}
            height="180px"
            width="250px"
            alt="squad step 1"
          />
          <Typography align="center" className={cx.captionFont}>
            2. Raise enough money to get a shelter cat house trained
          </Typography>
        </div>
        <div className={cx.explanationCard}>
          <img
            src={squadsStep3}
            alt="squad step 1"
            height="180px"
            width="250px"
          />
          <Typography align="center" className={cx.captionFont}>
            3. Trained house cats are much more likely to get adopted
          </Typography>
        </div>
      </div>
      <hr className={cx.hr} />

      {currentMission.status === 'started' && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography>
            {`%${Math.floor((tabCount / tabGoal) * 100)}`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(tabCount / tabGoal) * 100}
          />
        </div>
      )}
    </Paper>
  )
}
CurrentMissionComponent.displayName = 'CurrentMissionComponent'
CurrentMissionComponent.propTypes = {
  /**
    the status of the current mission
  */
}
CurrentMissionComponent.defaultProps = {
  status: '',
}
export default CurrentMissionComponent
