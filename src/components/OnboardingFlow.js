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

const getImageAssetFromName = (causeId, imgName) => {
  return onboarding1
}

const OnboardingFlow = ({ causeId, onboardingFields, onComplete, showMissionSlide }) => {
  const { steps } = onboardingFields
  const classes = useStyles()
  const [onboardingStep, setOnboardingStep] = useState(0)

  const onboardingStepContents = steps.map(
    (step) => ({
      imageSrc: getImageAssetFromName(causeId, step),
      title: step.title,
      children: (
        <Typography
            variant="body2"
            align="center"
            className={classes.childrenTypography}
          >
            {step.subtitle}
          </Typography>
      )
    })
  )
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
          alt="onboarding image"
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
