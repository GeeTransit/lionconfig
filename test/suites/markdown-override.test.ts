import { execaCommand } from 'execa';
import lionFixture from 'lion-fixture';
import fs from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, test } from 'vitest';

const { fixture, fixturesDir } = lionFixture(import.meta.url);

describe('markdown override works', async () => {
	let originalFixturePath: string;
	let tempFixturePath: string;

	beforeAll(async () => {
		tempFixturePath = await fixture('markdown-override');
		originalFixturePath = path.join(fixturesDir, 'markdown-override');
	});

	test('does not format markdown code blocks with tabs', async () => {
		await execaCommand('pnpm exec prettier --write .', {
			cwd: tempFixturePath,
			stdio: 'inherit',
		});

		expect(
			fs.readFileSync(path.join(originalFixturePath, 'no-format.md'), 'utf8')
		).toEqual(
			fs.readFileSync(path.join(tempFixturePath, 'no-format.md'), 'utf8')
		);
	});
});
