import  { Level } from 'level';
import fighter from '../packs/src/fighter.json' assert { type: "json" };

// Create a database
const db = new Level('packs/classes', { valueEncoding: 'json' });
const source = '../packs/src'

const classes = ['fighter'];
// Add an entry with a clas as the key and its json as the value
await db.put(classes[0], fighter);

// Add multiple entries
// await db.batch([{ type: 'put', key: 'b', value: 2 }])

// Get value of key 'a': 1
const value = await db.get('fighter');
console.log(value);