import React, { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: '90000',
    pointerEvents: 'none',
  },
}))
const Celebration = () => {
  const confettiCanvasRef = useRef(null)
  const confettiFunc = () => {
    const myConfetti = confetti.create(confettiCanvasRef.current, {
      resize: true,
    })
    const count = 200
    const defaults = {
      origin: { y: 0, x: 0 },
      angle: 315,
    }

    const fire = (particleRatio, opts) =>
      myConfetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })
    fire(0.2, {
      spread: 60,
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }
  const classes = useStyles()
  useEffect(() => {
    confettiFunc()
  })
  return (
    <canvas
      id="confettiCanvas"
      width="400"
      height="300"
      className={classes.canvas}
      ref={confettiCanvasRef}
    />
  )
}

Celebration.displayName = 'Celebration'

export default Celebration
