import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeReact from 'rehype-react'

const schema = defaultSchema

// https://github.com/remarkjs/remark
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)

  // https://github.com/rehypejs/rehype-sanitize#use
  .use(rehypeSanitize, schema)
  .use(rehypeReact, { createElement: React.createElement })

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
