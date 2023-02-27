import * as React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@mui/material/Paper'
import Typography from '@material-ui/core/Typography'
import Launch from '@mui/icons-material/Launch'
import Link from 'src/components/Link'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(6),
  },
  rowBold: {
    fontWeight: 700,
    paddingTop: theme.spacing(1),
  },
  title: {
    paddingBottom: theme.spacing(1),
    color: theme.palette.primary.main,
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: 900,
  },
  subtitle: {
    paddingBottom: theme.spacing(1),
    color: theme.palette.primary.main,
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 700,
  },
  contentLeft: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 180,
  },
  contentRight: {
    paddingLeft: theme.spacing(3),
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: theme.spacing(2),
  },
  name: {
    paddingBottom: theme.spacing(2),
    fontWeight: 600,
    fontFamily: 'Poppins',
  },
  link: {
    fontSize: 16,
    fontWeight: 700,
    color: '#15AAA6',
  },
  description: {
    paddingBottom: theme.spacing(2),
  },
  launch: {
    position: 'relative',
    top: 2,
    marginLeft: 3,
    width: 16,
    height: 16,
  },
}))
const AboutTheNonprofit = ({ charity }) => {
  const { name, image, description, website } = charity
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <Typography className={classes.title}>About the Nonprofits</Typography>
      <Typography className={classes.subtitle}>Organization</Typography>
      <hr />
      <div className={classes.content}>
        <div className={classes.contentLeft}>
          <Typography className={classes.name}>{name}</Typography>
          <img src={image} alt="charity" />
        </div>
        <div className={classes.contentRight}>
          <Typography className={classes.description}>{description}</Typography>
          <Link className={classes.link} to={website}>
            Link
            <Launch className={classes.launch} />
          </Link>
        </div>
      </div>
    </Paper>
  )
}

AboutTheNonprofit.propTypes = {
  charity: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    website: PropTypes.string,
  }).isRequired,
}

export default AboutTheNonprofit
