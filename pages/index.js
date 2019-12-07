import React from 'react'
import { graphql } from 'react-relay'
import withData from '../lib/withData'
import BlogPosts from '../components/BlogPosts'

const Index = props => (
  <div>
    <p>Hello Next.js</p>
    <div>
      <BlogPosts viewer={props.viewer} />
    </div>
  </div>
)

export default withData(Index, {
  query: graphql`
    query pagesIndexQuery {
      viewer {
        ...BlogPosts_viewer
      }
    }
  `,
})
