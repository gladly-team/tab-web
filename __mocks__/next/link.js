import PropTypes from 'prop-types'

const MockNextLink = ({ children }) => children
MockNextLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default MockNextLink
