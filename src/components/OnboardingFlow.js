import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import grey from '@material-ui/core/colors/grey'
import Typography from '@material-ui/core/Typography'
import onboarding1 from 'src/assets/onboarding/onboarding1.png'
import onboarding2 from 'src/assets/onboarding/onboarding2.png'
import onboarding3 from 'src/assets/onboarding/onboarding3.png'
import PropTypes from 'prop-types'
import Link from 'src/components/Link'

export const useStyles = makeStyles(() => ({
  card: {
    display: 'flex',
    width: '400px',
    height: '460px',
    boxShadow: 'none',
    backgroundColor: grey,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    padding: '12px',
  },
  onboardingImage: {
    height: '180px',
    marginTop: '24px',
    marginBottom: '6px',
  },
  childrenTypography: {
    display: 'inline-block',
    width: '100%',
    margin: '6px',
  },
  cardButton: {
    marginLeft: 'auto',
    justifyContent: 'flex-end',
    display: 'flex',
  },
}))

export const onboardingStepContents = (classes) => [
  {
    imageSrc: onboarding1,
    title: 'Your tabs are doing great things',
    children: (
      <div>
        <Typography
          variant="body2"
          align="center"
          className={classes.childrenTypography}
        >
          Now, every tab you open supports cats in need.
        </Typography>
        <Typography
          variant="body2"
          align="center"
          className={classes.childrenTypography}
        >
          Tabbers like you are supporting critical nonprofit all around the
          world. Thank you!
        </Typography>
      </div>
    ),
  },
  {
    imageSrc: onboarding2,
    title: 'Make a difference right meow',
    children: (
      <div>
        <Typography
          variant="body2"
          align="center"
          className={classes.childrenTypography}
        >
          Your tabs will help shelter cats get adopted by
          <Link to="https://thejacksongalaxyproject.greatergood.org/about/cat-pawsitive/">
            providing treats used in positive reinforcement training.
          </Link>
        </Typography>
        <Typography
          variant="body2"
          align="center"
          className={classes.childrenTypography}
        >
          In the first week, most people will raise enough to give a treat to 8
          shelter cats!
        </Typography>
      </div>
    ),
  },
  {
    imageSrc: onboarding3,
    title: "It doesn't cost you a thing",
    children: (
      <Typography
        variant="body2"
        align="center"
        className={classes.childrenTypography}
      >
        Ads on the new tab page raise money that we give to nonprofits. Most ads
        aren't good - but these ones are :)
      </Typography>
    ),
  },
]

const OnboardingFlow = (props) => {
  const classes = useStyles()
  const [onboardingStep, setOnboardingStep] = useState(0)
  const onboardingStepContentsWithStyle = onboardingStepContents(classes)
  const onboardingStepInfo = onboardingStepContentsWithStyle[onboardingStep]
  const { onComplete } = props

  const onNext = () => {
    if (onboardingStep < onboardingStepContentsWithStyle.length - 1) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      onComplete()
    }
  }
  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <img
          alt="cute cat"
          className={classes.onboardingImage}
          src={onboardingStepInfo.imageSrc}
        />
        <Typography variant="h5" className={classes.cardTitle}>
          {onboardingStepInfo.title}
        </Typography>
        {onboardingStepInfo.children}
        <Button
          className={classes.cardButton}
          color="primary"
          variant="contained"
          onClick={onNext}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  )
}

export default OnboardingFlow

OnboardingFlow.displayName = 'OnboardingFlow'
OnboardingFlow.propTypes = {
  onComplete: PropTypes.func,
}
OnboardingFlow.defaultProps = {
  onComplete: () => {},
}
