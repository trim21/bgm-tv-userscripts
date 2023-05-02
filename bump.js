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
  execSync(cmd, { stdio: 'inherit' });
}

/**
 *
 * @param {string} pkg
 * @param {semver.ReleaseType} bump
 * @return {Promise<{ name: string; version: string; } | false>}
 */
async function bumpPackage(pkg, bump) {
  const pkgFilePath = path.join(__dirname, 'packages', pkg, 'package.json');
  const packageJSON = JSON.parse((await fs.readFile(pkgFilePath)).toString());

  if (!packageJSON.name.startsWith('@script/')) {
    return false;
  }

  packageJSON.version = new semver.SemVer(packageJSON.version).inc(bump).version;

  await fs.writeFile(pkgFilePath, JSON.stringify(packageJSON, undefined, 2));

  return { name: packageJSON.name, version: packageJSON.version };
}

async function main() {
  const argv = hideBin(process.argv);
  const bump = argv.pop();
  if (!['patch', 'minor', 'major'].includes(bump)) {
    throw new Error(`${bump} is not valid bump type`);
  }

  const currentPackages = await fs.readdir(path.resolve(__dirname, 'packages'));

  const packages = [];
  if (argv.length) {
    packages.push(
      ...argv.filter((x) => {
        if (x.startsWith('.') || x.startsWith('packages')) {
          return path.basename(x);
        }
        return x;
      }),
    );
  } else {
    // bump all packages
    packages.push(...currentPackages);
  }

  const results = (await Promise.all(packages.map((x) => bumpPackage(x, bump)))).filter((x) => x);

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
