import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import withData from '../lib/withData'
import { useAuth } from '../utils/auth/hooks'
import BlogPosts from '../components/BlogPosts'

const Index = props => {
  const { viewer } = props
  const { user } = useAuth()

  return (
    <div>
      <p>Hi there!</p>
      {!user ? (
        <p>You are not signed in.</p>
      ) : (
        <p>You're signed in. Email: {user.email}</p>
      )}
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
