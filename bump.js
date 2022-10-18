const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const semver = require('semver');
const { hideBin } = require('yargs/helpers');

const [pkg, ...bump] = hideBin(process.argv);
const pkgFilePath = path.join(path.join(__dirname, 'packages', pkg), 'package.json');
const packageJSON = JSON.parse(fs.readFileSync(pkgFilePath).toString());

function getNewVersion() {
  if (bump.length === 1 && semver.valid(bump[0], {})) {
    return bump[0];
  }
  return semver.inc(packageJSON.version, ...bump);
}

const newVersion = getNewVersion();

if (!newVersion) {
  console.log('no version, re-run');
  process.exit(1);
}

console.log(newVersion);

packageJSON.version = newVersion;

fs.writeFileSync(pkgFilePath, JSON.stringify(packageJSON, undefined, 2));

execSync('git add .', { encoding: 'utf8' });
execSync(`git commit -m "release: bump \`${packageJSON.name}\` to ${newVersion}"`, { encoding: 'utf8' });
execSync(`git tag -a -m "${packageJSON.name}/v${newVersion}" "${packageJSON.name}/v${newVersion}"`, {
  encoding: 'utf8',
});
