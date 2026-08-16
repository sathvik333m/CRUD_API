const Database = require("better-sqlite3");

const db = new Database("tasks.db");


db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT 0
    )
`).run();


const count = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

if (count.count === 0) {
    const insert = db.prepare(`
        INSERT INTO tasks (title, done)
        VALUES (?, ?)
    `);

    const seedTasks = [
        ["Learn Express", 0],
        ["Build CRUD API", 0],
        ["Push to GitHub", 1]
    ];

    const seed = db.transaction(() => {
        for (const task of seedTasks) {
            insert.run(task[0], task[1]);
        }
    });

    seed();
    console.log("Database seeded with 3 tasks.");
}

module.exports = db;