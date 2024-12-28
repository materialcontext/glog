import { Level } from 'level';
import { readdir, readFile } from 'node:fs';
import { resolve } from 'path';

const dir = resolve('./');

async function buildDB(dirName) {
	// Create a database
	const db = new Level(`packs/${dirName}`, { valueEncoding: 'json' });

	// add a db entry for each file in the directory, with the filename as the key and the json content as the value
	readdir(dir + `/packs/src/${dirName}`, (err, files) => {
		if (err) throw (err);
		files.forEach(file => {
			const filepath = dir + `/packs/src/${dirName}/` + file;
			readFile(filepath, (err, data) => {
				if (err) throw (err);
				db.put(file.replace('.json', ''), JSON.parse(data));
			});
		});
	});
};

await buildDB('classes');

// Add multiple entries
// await db.batch([{ type: 'put', key: 'b', value: 2 }])
