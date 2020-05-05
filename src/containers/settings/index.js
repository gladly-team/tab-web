import { redirect } from 'src/utils/navigation'
import { accountURL } from 'src/utils/urls'

const SettingsIndex = () => null

SettingsIndex.getInitialProps = async ctx => {
  // Redirect the base settings URL to the account page.
  redirect({
    location: accountURL,
    ctx,
  })
}

SettingsIndex.displayName = 'SettingsIndex'
SettingsIndex.propTypes = {}
SettingsIndex.defaultProps = {}

export default SettingsIndex
