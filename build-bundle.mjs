import {rollup} from 'rollup';
import * as fs from 'fs';
import * as path from 'path';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import {rimrafSync} from 'rimraf'


const baseDirectory = './';
const distDirectory = './dist';
const distDirectoryPrefixRegex = new RegExp(`^${distDirectory}/`, 'g');
const defaultBuildTarget = 'esnext';


/**
 * Get build targets from existing tsconfig.s*.json files
 * @returns {{tsConfig: string, target: string, outDir: string}[]}
 */
function getBuildTargets() {
    try {
        const tsConfigFiles = fs.readdirSync(baseDirectory);
        const matchedFiles = tsConfigFiles.filter(file => file.match(/^tsconfig\.es.*\.json$/));

        return matchedFiles.map(file => {
            const filePath = path.join(baseDirectory, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const json = JSON.parse(content);
            if (!json || !json.compilerOptions || !json.compilerOptions.outDir) {
                throw new Error(`Missing compilerOptions.outDir for file '${filePath}'`);
            }
            if (!json.compilerOptions.target) {
                throw new Error(`Missing compilerOptions.target for file '${filePath}'`);
            }
            return {
                tsconfig: filePath,
                target: json.compilerOptions.target.toString().toLowerCase(),
                outDir: json.compilerOptions.outDir,
            };
        });
    } catch (error) {
        console.error('Error reading ts config files:', error);
    }
}

/**
 * Get the processed json file for being used at dist folder
 * @param buildTargets {{tsConfig: string, target: string, outDir: string}[]}
 * @return {{rawPackageJson: string, entries: string[]}}
 */
function getDistPackageJson(buildTargets) {
    const packageRaw = fs.readFileSync('package.json', 'utf-8');
    const packageJson = JSON.parse(packageRaw);
    delete packageJson['scripts'];
    delete packageJson['devDependencies'];
    delete packageJson['files'];
    delete packageJson['publishConfig'];
    const entries = [];
    for (const key in packageJson.exports) {
        if (packageJson.exports.hasOwnProperty(key)) {
            entries.push(key.replace(/^\.\//, ''));
        }
    }
    delete packageJson['exports'];
    packageJson.exports = {};
    buildTargets.forEach(buildTarget => {
        const exportKeyPrefix = (buildTarget.target === defaultBuildTarget) ? '.' : `./${buildTarget.target}`;
        const exportValuePrefix = buildTarget.outDir.replace(distDirectoryPrefixRegex, '');
        entries.forEach(entry => {
            packageJson.exports[`${exportKeyPrefix}/${entry}`] = `./${exportValuePrefix}/${entry}/index.js`;
        })
    });
    return {
        rawPackageJson: JSON.stringify(packageJson, null, 2),
        entries: entries,
    };
}

/**
 *
 * @param buildTargets {{tsConfig: string, target: string, outDir: string}[]}
 * @param entries {string[]}
 * @return {Promise<void>}
 */
async function build(buildTargets, entries) {
    const inputs = entries.reduce((acc, entry) => {
        acc[`${entry}/index`] = `src/${entry}/index.ts`;
        return acc;
    }, {});
    for (const buildTarget of buildTargets) {
        try {
            console.info(`\x1b[32m Building sources for ${buildTarget.target}\x1b[0m`);
            const bundle = await rollup({
                input: inputs,
                logLevel: 'debug',
                plugins: [
                    nodeResolve(),
                    typescript({
                        tsconfig: buildTarget.tsConfig,
                    }),
                ],
            });
            console.info(`\x1b[35m |-- Writting esm files\x1b[0m`);
            await bundle.write({
                dir: buildTarget.outDir,
                format: 'esm',
                entryFileNames: '[name].js',
                preserveModules: true,
                preserveModulesRoot: 'src',
                sourcemap: true,
            });

            console.info(`\x1b[35m |-- Writting cjs files\x1b[0m`);
            await bundle.write({
                dir: buildTarget.outDir,
                format: 'cjs',
                entryFileNames: '[name].cjs.js',
                preserveModules: true,
                preserveModulesRoot: 'src',
                sourcemap: true,
            });

        } catch (error) {
            console.error('Error running rollup: ', error);
            return;
        }
    }
    console.info(`\x1b[32m (done)\x1b[0m`);
}

const buildTargets = getBuildTargets();
const distPackageJson = getDistPackageJson(buildTargets);

console.info(`\x1b[41m *** CLEANING TARGER DIR *** \x1b[0m`);
rimrafSync(distDirectory);
console.info(`\x1b[32m (done)\x1b[0m`);


console.info(`\x1b[41m *** BUILDING SOURCES *** \x1b[0m`);
await build(buildTargets, distPackageJson.entries);

console.info(`\x1b[41m *** POST BUILDING TASKS *** \x1b[0m`);
console.info(`\x1b[32m Creating distribution package.json file \x1b[0m`);
fs.writeFileSync(path.join(distDirectory, 'package.json'), distPackageJson.rawPackageJson);
console.info(`\x1b[35m  (done)\x1b[0m`);
console.info(`\x1b[32m Adding MD files \x1b[0m`);
fs.copyFileSync('README.md', path.join(distDirectory, 'readme.md'));
console.info(`\x1b[35m  (done)\x1b[0m`);
