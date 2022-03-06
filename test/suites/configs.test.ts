import path from 'node:path';
import fs from 'node:fs';
import { execaCommand, execa } from 'execa';
import { join } from 'desm';
import { beforeAll, afterAll, test } from 'vitest';

const myProjectPath = join(import.meta.url, '../fixtures/my-project');
const tempFolder = join(import.meta.url, '../temp');

beforeAll(() => {
	fs.rmSync(tempFolder, { force: true, recursive: true });
});

afterAll(() => {
	// fs.rmSync(tempFolder, { force: true, recursive: true });
});

async function cloneTempProject(testName: string) {
	const tempProjectDir = path.join(tempFolder, testName);
	console.log(tempProjectDir);
	await fs.promises.mkdir(tempProjectDir, { recursive: true });
	await fs.promises.cp(myProjectPath, tempProjectDir, { recursive: true });
	await execaCommand('pnpm install', { cwd: tempProjectDir });
	return tempProjectDir;
}

{
	const testName = 'eslint works';
	test.concurrent(testName, async () => {
		const tempProjectDir = await cloneTempProject(testName);
		await execaCommand('pnpm exec eslint --fix .', {
			cwd: tempProjectDir,
			stdio: 'inherit',
		});
	});
}

{
	const testName = 'prettier works';
	test.concurrent(testName, async () => {
		const tempProjectDir = await cloneTempProject(testName);
		await execaCommand('pnpm exec prettier --write src', {
			cwd: tempProjectDir,
			stdio: 'inherit',
		});
	});
}

{
	const testName = 'commitlint works';
	test.concurrent(testName, async () => {
		const tempProjectDir = await cloneTempProject(testName);
		const messageTxtPath = path.join(tempProjectDir, 'message.txt');
		await fs.promises.writeFile(messageTxtPath, 'fix: fix');
		await execa('pnpm', ['exec', 'commitlint', '--edit', messageTxtPath], {
			cwd: tempProjectDir,
			stdio: 'inherit',
		});
	});
}

{
	const testName = 'markdownlint works';
	test.concurrent(testName, async () => {
		const tempProjectDir = await cloneTempProject(testName);
		const readmePath = path.join(tempProjectDir, 'readme.md');
		await execa('pnpm', ['exec', 'markdownlint', readmePath], {
			cwd: tempProjectDir,
			stdio: 'inherit',
		});
	});
}

{
	const testName = 'typescript works';
	test.concurrent(testName, async () => {
		const tempProjectDir = await cloneTempProject(testName);
		await execaCommand('pnpm exec tsc --noEmit', {
			cwd: tempProjectDir,
			stdio: 'inherit',
		});
	});
}