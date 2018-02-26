const SentryCli = require('@sentry/cli');
const helper = require('@sentry/cli/js/helper');

const release = `v${require('../../package.json').version}`;

if (!release) {
  return;
}

const options = {
  rewrite: true,
  include: ['./app/dist'],
  urlPrefix: '/',
  release,
};

(async function() {
  const cli = new SentryCli();

  console.log(`Creating release ${release}`);
  console.log(await cli.releases.new(release));

  console.log('Uploading source maps');
  console.log(await cli.releases.uploadSourceMaps(release, options));

  console.log('Setting commits');
  console.log(await helper.execute(['releases', 'set-commits', '--auto', release]));

  console.log('Finalizing release');
  console.log(await cli.releases.finalize(release));

  console.log('Release finalized');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
