import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import grey from '@material-ui/core/colors/grey'
import catTabs from 'src/assets/onboarding/cattabs.svg'
import squadCat from 'src/assets/onboarding/squadcat.svg'
import adCat from 'src/assets/onboarding/adcat.svg'
import seas1 from 'src/assets/onboarding/seas1.svg'
import seas2 from 'src/assets/onboarding/seas2.svg'
import seas3 from 'src/assets/onboarding/seas3.svg'
import PropTypes from 'prop-types'
import Markdown from 'src/components/Markdown'

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
  center: {
    textAlign: 'center',
  },
}))

const getImageAssetFromName = (imgName) => {
  switch (imgName) {
    case 'cattabs':
      return catTabs
    case 'squadcat':
      return squadCat
    case 'adcat':
      return adCat
    case 'seas1':
      return seas1
    case 'seas2':
      return seas2
    case 'seas3':
      return seas3
    default:
      return catTabs
  }
}

const OnboardingFlow = ({ onboarding, onComplete, showMissionSlide }) => {
  const { steps } = onboarding
  const classes = useStyles()
  const [onboardingStep, setOnboardingStep] = useState(0)

  const onboardingStepContents = steps.map((step) => ({
    imageSrc: getImageAssetFromName(step.imgName),
    title: step.title,
    subtitle: step.subtitle,
  }))
  const onboardingStepInfo = onboardingStepContents[onboardingStep]

  // TODO: Break out Squads Slide into it's own item on the OnboardingFlow model.
  // For now we should hardcode it as #2.
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
          alt="onboarding"
          className={classes.onboardingImage}
          src={onboardingStepInfo.imageSrc}
        />
        <div className={classes.cardTitle}>
          <Markdown>{onboardingStepInfo.title}</Markdown>
        </div>
        <div className={classes.center}>
          <Markdown>{onboardingStepInfo.subtitle}</Markdown>
        </div>
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
  onboarding: PropTypes.shape({
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        imgName: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
}
OnboardingFlow.defaultProps = {
  onComplete: () => {},
}
