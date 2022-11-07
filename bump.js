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
const { execSync } = require('node:child_process');
const path = require('path');

const semver = require('semver');
const { hideBin } = require('yargs/helpers');

/**
 * @param {string} cmd
 */
function exec(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'pipe' });
}

/**
 *
 * @param {string} pkg
 * @param {string} bump
 * @return {Promise<{ name: string; version: string; }>}
 */
async function bumpPackage(pkg, bump) {
  const pkgFilePath = path.join(path.join(__dirname, 'packages', pkg), 'package.json');
  const packageJSON = JSON.parse((await fs.readFile(pkgFilePath)).toString());

  const newVersion = semver.inc(packageJSON.version, bump);

  if (!newVersion) {
    console.log('no version, re-run');
    process.exit(1);
  }

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
    packages.push(...argv);
  } else {
    // bump all packages
    packages.push(...(await fs.readdir(path.resolve(__dirname, 'packages'))));
  }

  const results = await Promise.all(packages.map((x) => bumpPackage(x, bump)));

  exec('git add .');

  let message = 'release: ' + results.map(({ name, version }) => `${name}/v${version}`).join(' ');

  exec(`git commit -m ${JSON.stringify(message)}`);

  for (const { name, version } of results) {
    const tag = `${name}/v${version}`;
    exec(`git tag -a -m ${JSON.stringify(tag)} ${JSON.stringify(tag)}`);
  }
}

main().catch((e) => {
  throw e;
});
