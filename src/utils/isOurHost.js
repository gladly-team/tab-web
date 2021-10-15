const HOSTS = [
  'test-tab2017.gladly.io',
  'dev-tab2017.gladly.io',
  'tab.gladly.io',
]

// A quick workaround to know if the app is running within
// our app's full cloud environment.
const isOurHost = (host) => HOSTS.indexOf(host) > -1

export default isOurHost
