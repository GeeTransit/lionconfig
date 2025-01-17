#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import process from 'node:process';

import { runScript } from '../utils/script.js';

runScript('release', ['lionp', ...process.argv.slice(2)], (dir) => {
	const pkgJson = JSON.parse(
		fs.readFileSync(path.join(dir, 'package.json'), 'utf8')
	);
	return pkgJson.publishConfig !== undefined;
});
