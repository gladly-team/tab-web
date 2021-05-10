const { Octokit } = require('@octokit/action')
const run = async () => {
  const octokit = new Octokit()
  const ref = await octokit.request(
    'PATCH /repos/{owner}/{repo}/git/refs/{ref}',
    {
      owner: 'gladly-team',
      repo: 'tab-web',
      ref: 'refs/heads/qa',
      sha: 'refs/heads/dev',
    }
  )
}
run()
