import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { addRating, deleteOwnedRecipe, updateOwnedRecipe } from '../lib/store.mjs';

// Execute the same parameterized statements as Neon, against an isolated PostgreSQL database.
test('ownership and one-vote rules are enforced at write time', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE TABLE recipes (id text PRIMARY KEY, body jsonb NOT NULL);
      CREATE TABLE recipe_photos (id text PRIMARY KEY REFERENCES recipes(id), jpeg text);
      CREATE TABLE recipe_votes (recipe_id text REFERENCES recipes(id) ON DELETE CASCADE,
        subject text, stars integer, PRIMARY KEY (recipe_id, subject));
      INSERT INTO recipes VALUES ('sample', '{"owner":"author","title":"Original"}');
      INSERT INTO recipe_photos VALUES ('sample', 'test-image');`);
    function sql(parts, ...values) {
      const query = parts.reduce((text, part, i) => text + (i ? '$' + i : '') + part, '');
      const run = async connection => (await connection.query(query, values)).rows;
      return { run, then(resolve, reject) { return run(db).then(resolve, reject); } };
    }
    sql.transaction = statements => db.transaction(async tx => {
      const results = [];
      for (const statement of statements) results.push(await statement.run(tx));
      return results;
    });
    const connect = async () => sql;
    await assert.rejects(updateOwnedRecipe('sample', 'guest', { title: 'Wrong' }, null, connect), /author/);
    await assert.rejects(deleteOwnedRecipe('sample', 'guest', connect), /author/);
    assert.equal((await db.query('SELECT jpeg FROM recipe_photos')).rows[0].jpeg, 'test-image');
    await updateOwnedRecipe('sample', 'author', { title: 'Edited' }, null, connect);
    assert.equal((await db.query('SELECT body FROM recipes')).rows[0].body.title, 'Edited');
    await assert.rejects(addRating('sample', null, 5, connect), /Sign in/);
    await assert.rejects(addRating('sample', 'author', 5, connect), /unavailable/);
    await addRating('sample', 'reader', 2, connect);
    await addRating('sample', 'reader', 4, connect);
    assert.deepEqual((await db.query('SELECT stars FROM recipe_votes')).rows, [{stars: 4}]);
    await deleteOwnedRecipe('sample', 'author', connect);
    for (const table of ['recipes', 'recipe_photos', 'recipe_votes']) {
      assert.equal((await db.query('SELECT * FROM ' + table)).rows.length, 0);
    }
  } finally { await db.close(); }
});
