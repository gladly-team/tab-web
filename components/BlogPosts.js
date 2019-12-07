import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'

const BlogPosts = props => {
  if (!props) {
    return null
  }
  return (
    <div>
      <h1>Blog posts</h1>
      {props.viewer.allBlogPosts.edges.map(({ node: post }) => {
        return <div key={post.id}>{post.title}</div>
      })}
    </div>
  )
}

export default createFragmentContainer(BlogPosts, {
  viewer: graphql`
    fragment BlogPosts_viewer on Viewer {
      allBlogPosts(first: 10, orderBy: createdAt_DESC) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `,
})
