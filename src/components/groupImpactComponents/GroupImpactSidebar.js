import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import theme from 'src/utils/theme'
import VerticalLinearProgress from '../VerticalLinearProgress'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import StarsOutlined from '@material-ui/icons/StarsOutlined'
import HealthAndSafetyOutlined from '@mui/icons-material/HealthAndSafetyOutlined'

const useStyles = makeStyles(() => ({
  wrapper: {
    height: 600,
    width: 400,
    display: 'flex',
    flexDirection: 'row'
  },
  sidebarText: {
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarButtons: {
    display: "flex",
    flexDirection: "row"
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  buttonContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  sidebarButton: {
    flex: '1 1 0',
    textTransform: "none",
  },
  sidebarButtonText: {
    fontSize: '14px'
  }
}))

const GroupImpactSidebar = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <VerticalLinearProgress
      progress={25}
      width={64}
      borderRadius={32}
      showMarkers={true}
      />
      <div className={classes.sidebarText}>
        <Typography variant="h5">GOAL</Typography>
        <Typography variant="body2">Provide 1 home visit from a community health worker</Typography>
        <Typography variant="h3">5%</Typography>
        <Typography variant="body2">completed</Typography>
        <Typography variant="h6">103982</Typography>
        <Typography variant="body2">participants</Typography>
        <Divider className={classes.divider}/>
        <Typography variant="h6">Why it Matters</Typography>
        <Typography>Community health workers provide quality health care to those who might not otherwise have access.</Typography>
        <Divider className={classes.divider}/>
        <div className={classes.sidebarButtons}>
          <Button className={classes.sidebarButton}><div className={classes.buttonContent}><InfoIcon/> <Typography variant="body2">About the Cause</Typography></div></Button>
          <Button className={classes.sidebarButton}><div className={classes.buttonContent}><StarsOutlined/><Typography variant="body2">Impact</Typography></div></Button>
          <Button className={classes.sidebarButton}><div className={classes.buttonContent}><HealthAndSafetyOutlined/><Typography variant="body2">Nonprofits</Typography></div></Button>
        </div>
        <Divider className={classes.divider}/>
      </div>
    </div>
  )
}

GroupImpactSidebar.displayName = 'VerticalLinearProgress'
GroupImpactSidebar.propTypes = {
}

GroupImpactSidebar.defaultProps = {
  showMarkers: false,
}

export default GroupImpactSidebar
