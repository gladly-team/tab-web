import React, { useState } from 'react'
// import PropTypes from 'prop-types'
import tickle from 'src/assets/gifs/tickle.gif'
import turntable from 'src/assets/gifs/turntable.gif'
import highfive from 'src/assets/gifs/highfive.gif'
import spoon from 'src/assets/gifs/spoon.webp'
import glassesbox from 'src/assets/gifs/glassesbox.webp'
import jumping from 'src/assets/gifs/jumping.webp'
import kittencuddle from 'src/assets/gifs/kittencuddle.webp'
import licking from 'src/assets/gifs/licking.webp'
import massage from 'src/assets/gifs/massage.gif'

const gifArray = [
  tickle,
  turntable,
  highfive,
  spoon,
  glassesbox,
  jumping,
  kittencuddle,
  licking,
  massage,
]
const GifContainer = () => {
  const [randomGif] = useState(
    gifArray[Math.floor(Math.random() * gifArray.length)]
  )
  return (
    <img height="250" src={randomGif} alt="cat turntable!" loading="lazy" />
  )
}

export default GifContainer
