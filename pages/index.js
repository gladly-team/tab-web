import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import withData from '../lib/withData'
import BlogPosts from '../components/BlogPosts'
import Link from '../components/Link'

const Index = props => {
  const { authUser, viewer } = props

  return (
    <div>
      <p>Hi there!</p>
      {!authUser ? (
        <p>
          You are not signed in.{' '}
          <Link to="/auth">
            <a>Sign in</a>
          </Link>
        </p>
      ) : (
        <p>You're signed in. Email: {authUser.email}</p>
      )}
      <div>
        <BlogPosts viewer={viewer} />
      </div>
    </div>
  )
}

Index.propTypes = {
  authUser: PropTypes.shape({
    email: PropTypes.string,
  }),
  viewer: PropTypes.shape({}).isRequired,
}

Index.defaultProps = {
  authUser: null,
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
