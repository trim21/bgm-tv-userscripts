const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const semver = require('semver');
const { hideBin } = require('yargs/helpers');

const argv = hideBin(process.argv);

const [pkg, ...bump] = argv;

const pkgRoot = path.join(__dirname, 'packages', pkg);

const pkgFilePath = path.join(pkgRoot, 'package.json');

const packageJSON = JSON.parse(fs.readFileSync(pkgFilePath).toString());

let newVersion;

if (bump.length === 1 && semver.valid(bump[0], {})) {
  newVersion = bump[0];
} else {
  newVersion = semver.inc(packageJSON.version, ...bump);
}

console.log(newVersion);

packageJSON.version = newVersion;

fs.writeFileSync(pkgFilePath, JSON.stringify(packageJSON, undefined, 2));

execSync('git add .', { encoding: 'utf8' });

execSync(`git commit -m "release: bump ${packageJSON.name} to ${newVersion}"`, { encoding: 'utf8' });

execSync(`git tag -a -m "${packageJSON.name}/v${newVersion}" "${packageJSON.name}/v${newVersion}"`, {
  encoding: 'utf8',
});
