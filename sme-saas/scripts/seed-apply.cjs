#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

(async () => {
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error('SUPABASE_DB_URL not set');
    process.exit(1);
  }
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  const seedsDir = path.join(__dirname, '..', 'supabase', 'seeds');
  const files = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8');
    console.log('Applying seed', file);
    await client.query(sql);
  }
  await client.end();
  console.log('Seeds applied');
})();
