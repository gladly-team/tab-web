import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import withData from '../lib/withData'
import BlogPosts from '../components/BlogPosts'

const Index = props => {
  const { viewer } = props
  return (
    <div>
      <p>Hello Next.js</p>
      <div>
        <BlogPosts viewer={viewer} />
      </div>
    </div>
  )
}

Index.propTypes = {
  viewer: PropTypes.shape({}).isRequired,
}

export default withData(Index, {
  query: graphql`
    query pagesIndexQuery {
      viewer {
        ...BlogPosts_viewer
      }
    }
  `,
})
