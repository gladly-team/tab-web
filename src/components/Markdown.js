// Pass props through to lots of wrapper components.
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeReact from 'rehype-react'
import Typography from '@material-ui/core/Typography'

const schema = defaultSchema

// https://github.com/remarkjs/remark
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)

  // https://github.com/rehypejs/rehype-sanitize#use
  .use(rehypeSanitize, schema)
  .use(rehypeReact, {
    createElement: React.createElement,
    components: {
      h1: (props) => <Typography {...props} variant="h1" />,
      h2: (props) => <Typography {...props} variant="h2" />,
      h3: (props) => <Typography {...props} variant="h3" />,
      h4: (props) => <Typography {...props} variant="h4" />,
      h5: (props) => <Typography {...props} variant="h5" />,
      h6: (props) => <Typography {...props} variant="h6" />,
      p: (props) => <Typography {...props} variant="body2" paragraph />,

      // Anchor will have content when rendered.
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      a: (props) => <a target="_top" {...props} />,
    },
  })

// TODO: map to MUI components

const Markdown = ({ children }) => {
  const elems = useMemo(
    () => processor.processSync(children).result,
    [children]
  )
  return <>{elems}</>
}

Markdown.displayName = 'Markdown'

Markdown.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

Markdown.defaultProps = {}

export default Markdown
