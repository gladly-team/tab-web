import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import grey from '@material-ui/core/colors/grey'
import Typography from '@material-ui/core/Typography'
import onboarding1 from 'src/assets/onboarding/cattabs.svg'
import onboarding2 from 'src/assets/onboarding/squadcat.svg'
import onboarding3 from 'src/assets/onboarding/adcat.svg'
import PropTypes from 'prop-types'
import Link from 'src/components/Link'

export const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    maxWidth: '500px',
    overflow: 'auto',
    boxShadow: 'none',
    backgroundColor: grey,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'auto',
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
    width: '96%',
    margin: '6px',
  },
  cardButton: {
    marginLeft: 'auto',
    justifyContent: 'flex-end',
    display: 'flex',
  },
  link: {
    display: 'inline',
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}))

const OnboardingFlow = ({ onComplete, showMissionSlide }) => {
  const classes = useStyles()
  const [onboardingStep, setOnboardingStep] = useState(0)

  const onboardingStepContents = [
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
            Tabbers like you are supporting critical nonprofit work all around
            the world. Your tabs support initiatives that help shelter cats get
            adopted, including initiatives that{' '}
            <Link
              target="_blank"
              to="https://greatergood.org/jackson-galaxy"
              className={classes.link}
            >
              use treats in positive reinforcement training.
            </Link>{' '}
            Thank you!
          </Typography>
        </div>
      ),
    },
    {
      imageSrc: onboarding2,
      title: 'Help more cats with squads',
      children: (
        <div>
          <Typography
            variant="body2"
            align="center"
            className={classes.childrenTypography}
          >
            Cats can get adopted up to 3x faster when you join a squad!
          </Typography>
          <Typography
            variant="body2"
            align="center"
            className={classes.childrenTypography}
          >
            Team up with your friends to help pay for a shelter cat's house
            training. Training a cat is the best way to help it find a permanent
            home, and it enriches the cat's day to day life while in the
            shelter.
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
          We display a couple of small ads at the bottom of your screen and
          redistribute that money to charity. No fees or hidden costs!
        </Typography>
      ),
    },
  ]
  const onboardingStepInfo = onboardingStepContents[onboardingStep]

  const onNext = () => {
    if (onboardingStep === 0 && !showMissionSlide) {
      setOnboardingStep(2)
    } else if (onboardingStep < onboardingStepContents.length - 1) {
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
  showMissionSlide: PropTypes.bool.isRequired,
}
OnboardingFlow.defaultProps = {
  onComplete: () => {},
}
