const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const srcPkgPath = path.join(rootDir, 'src', 'package.json');
const rootPkgPath = path.join(rootDir, 'package.json');

// 1. Read package.json
if (!fs.existsSync(srcPkgPath)) {
    console.error(`[Error] ${srcPkgPath} not found!`);
    process.exit(1);
}

const srcPkg = JSON.parse(fs.readFileSync(srcPkgPath, 'utf8'));
const currentVersion = srcPkg.version || '1.0.0';

/**
 * Increment version automatically:
 * - 2.0.2-rc.0 -> 2.0.2-rc.1
 * - 2.0.2-beta.1 -> 2.0.2-beta.2
 * - 2.0.2 -> 2.0.3
 */
function bumpVersion(version) {
    // Release candidate format (e.g. 2.0.2-rc.0)
    const rcMatch = version.match(/^(.*-rc\.)(\d+)$/i);
    if (rcMatch) {
        return `${rcMatch[1]}${parseInt(rcMatch[2], 10) + 1}`;
    }

    // Generic prerelease format (e.g. 1.0.0-beta.1)
    const preMatch = version.match(/^(.*[-.])(\d+)$/);
    if (preMatch) {
        return `${preMatch[1]}${parseInt(preMatch[2], 10) + 1}`;
    }

    // Standard semver patch bump (e.g. 2.0.2 -> 2.0.3)
    const semverMatch = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (semverMatch) {
        const major = semverMatch[1];
        const minor = semverMatch[2];
        const patch = parseInt(semverMatch[3], 10) + 1;
        return `${major}.${minor}.${patch}`;
    }

    // Fallback: append -rc.1
    return `${version}-rc.1`;
}

const newVersion = bumpVersion(currentVersion);
console.log(`\n========================================`);
console.log(`🚀 Bumping version: ${currentVersion} -> ${newVersion}`);
console.log(`========================================\n`);

// 2. Update src/package.json
srcPkg.version = newVersion;
fs.writeFileSync(srcPkgPath, JSON.stringify(srcPkg, null, 2) + '\n', 'utf8');

// Also sync root package.json version if present
if (fs.existsSync(rootPkgPath)) {
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
    rootPkg.version = newVersion;
    fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n', 'utf8');
}

// 3. Run Build (Cross-platform)
console.log(`📦 Compiling TypeScript & building distribution...`);
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}

try {
    execSync('npx tsc -p tsconfig.json', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
    console.error(`[Error] TypeScript compilation failed!`);
    process.exit(1);
}

// Copy assets to dist
const distLog = path.join(distDir, 'log');
const srcLog = path.join(rootDir, 'src', 'log');
if (fs.existsSync(srcLog)) {
    fs.cpSync(srcLog, distLog, { recursive: true });
}

fs.copyFileSync(srcPkgPath, path.join(distDir, 'package.json'));

const srcReadme = path.join(rootDir, 'src', 'README.md');
if (fs.existsSync(srcReadme)) {
    fs.copyFileSync(srcReadme, path.join(distDir, 'README.md'));
}

console.log(`✅ Build completed successfully in dist/`);

// 4. Git Branch & Tag Creation
const branchName = `release/v${newVersion}`;
const tagName = `v${newVersion}`;

console.log(`\n🌿 Git operations:`);
try {
    // Stage modified files
    execSync('git add -A', { cwd: rootDir, stdio: 'inherit' });

    // Commit
    try {
        execSync(`git commit -m "chore(release): bump version to v${newVersion}"`, { cwd: rootDir, stdio: 'inherit' });
    } catch (e) {
        console.log(`ℹ️ Nothing to commit or commit already done.`);
    }

    // Create branch (or checkout new branch)
    try {
        execSync(`git branch -f ${branchName}`, { cwd: rootDir, stdio: 'inherit' });
        console.log(`✅ Git branch created: ${branchName}`);
    } catch (err) {
        console.warn(`⚠️ Could not create branch ${branchName}: ${err.message}`);
    }

    // Create Tag
    try {
        execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { cwd: rootDir, stdio: 'inherit' });
        console.log(`🏷️ Git tag created: ${tagName}`);
    } catch (err) {
        console.warn(`⚠️ Tag ${tagName} could not be created or already exists.`);
    }

    console.log(`\n🎉 Success! Version bumped to ${newVersion}`);
    console.log(`To push branch and tags to remote:`);
    console.log(`  git push origin ${branchName}`);
    console.log(`  git push origin ${tagName}\n`);
} catch (gitErr) {
    console.warn(`⚠️ Git operations warning: ${gitErr.message}`);
}
