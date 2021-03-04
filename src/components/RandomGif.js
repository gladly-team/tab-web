import React from 'react'
// import PropTypes from 'prop-types'
import tickle from 'src/assets/gifs/tickle.gif'
import turntable from 'src/assets/gifs/turntable.gif'
import highfive from 'src/assets/gifs/highfive.gif'

const gifArray = [tickle, turntable, highfive]
const GifContainer = () => {
  const randomGif = gifArray[Math.floor(Math.random() * gifArray.length)]
  return (
    <img height="250" src={randomGif} alt="cat turntable!" loading="lazy" />
  )
}

export default GifContainer
