import { accountURL } from 'src/utils/urls'

const SettingsIndex = () => null

export const getServerSideProps = () => ({
  redirect: { destination: accountURL, permanent: false },
})

SettingsIndex.displayName = 'SettingsIndex'
SettingsIndex.propTypes = {}
SettingsIndex.defaultProps = {}

export default SettingsIndex
