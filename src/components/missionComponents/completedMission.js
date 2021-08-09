import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
const missionComplete = () => (
  <div>
    <div>
      <Typography style={{ fontSize: '20px', fontWeight: 'bold' }}>
        Mission Complete
      </Typography>
      <div style={{ marginTop: '16px' }}>
        <CustomAlert
          done
          text="Team up with your friends and help give a shelter cat a new home and family!"
        />
      </div>
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
  </div>
)
