import * as React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@material-ui/core/Typography'
import Markdown from '../Markdown'

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
  },
  coltitle: {
    color: theme.palette.primary.main,
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 700,
  },
}))
const ImpactMetricList = ({ charityName, impactMetrics }) => {
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <Typography className={classes.title}>Impact</Typography>
      <Typography className={classes.subtitle} variant="body2">
        The money you raise turns into real, meaningful outcomes through the
        hard work of our nonprofit partners.
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ paddingLeft: 0 }}>
                <Typography className={classes.coltitle}>Outcome</Typography>
              </TableCell>
              <TableCell>
                <Typography className={classes.coltitle}>Metric</Typography>
              </TableCell>
              <TableCell>
                <Typography className={classes.coltitle}>Nonprofit</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {impactMetrics.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ paddingLeft: 0 }} component="th" scope="row">
                  <Typography className={classes.rowBold}>
                    {row.impactTitle}
                  </Typography>
                  <br />
                  <Markdown className={classes.description}>
                    {row.description}
                  </Markdown>
                </TableCell>
                <TableCell>
                  <span className={classes.rowBold}>{row.metricTitle}</span>
                </TableCell>
                <TableCell>
                  <span className={classes.rowBold}>{charityName}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

ImpactMetricList.propTypes = {
  charityName: PropTypes.string.isRequired,
  impactMetrics: PropTypes.arrayOf(
    PropTypes.shape({
      impactTitle: PropTypes.string,
      description: PropTypes.string,
      metricTitle: PropTypes.string,
    })
  ).isRequired,
}

export default ImpactMetricList
