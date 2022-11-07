/*


bump single version
```shell
node ./bump.js ${package_name} patch/minor/major
```

bump all version
```shell
node ./bump.js patch/minor/major
```

 */

const fs = require('node:fs/promises');
const path = require('path');

const { exec } = require('@actions/exec');
const semver = require('semver');
const { hideBin } = require('yargs/helpers');

/**
 *
 * @param {string} pkg
 * @param {string} bump
 * @return {Promise<{ name: string; version: string; }>}
 */
async function bumpPackage(pkg, bump) {
  const pkgFilePath = path.join(path.join(__dirname, 'packages', pkg), 'package.json');
  const packageJSON = JSON.parse((await fs.readFile(pkgFilePath)).toString());

  function getNewVersion() {
    if (semver.valid(bump, {})) {
      return bump;
    }
    return semver.inc(packageJSON.version, bump);
  }

  const newVersion = getNewVersion();

  if (!newVersion) {
    console.log('no version, re-run');
    process.exit(1);
  }

  console.log(newVersion);

  packageJSON.version = newVersion;

  await fs.writeFile(pkgFilePath, JSON.stringify(packageJSON, undefined, 2));

  return { name: packageJSON.name, version: newVersion };
}

async function main() {
  const argv = hideBin(process.argv);
  const bump = argv.pop();
  if (!['patch', 'minor', 'major'].includes(bump)) {
    throw new Error(`${bump} is not valid bump type`);
  }

  const packages = [];
  if (argv.length) {
    packages.push(argv[0]);
  } else {
    // bump all packages
    packages.push(...(await fs.readdir(path.resolve(__dirname, 'packages'))));
  }

  const results = await Promise.all(packages.map((x) => bumpPackage(x, bump)));

  await exec('git add .');

  let message = 'release: ' + results.map(({ name, version }) => `${name}/v${version}`).join(' ');

  await exec('git', ['commit', '-m', message]);

  for (const { name, version } of results) {
    await exec('git', ['tag', '-a', '-m', `${name}/v${version}`, `${name}/v${version}`]);
  }
}

main().catch((e) => {
  throw e;
});
