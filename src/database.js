import sqlite3 from 'sqlite3';

const databaseFile = process.env.DATABASE_FILE || 'db.sqlite'

class AppDatabase {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log('Could not connect to database', err);
      } else {
        console.log('Connected to database');
        this.migrateTables();
      }
    });
  }

  migrateTables() {
    this.db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text
      );

      CREATE TABLE IF NOT EXISTS trades (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "type" VARCHAR(4) NOT NULL,
        symbol VARCHAR(5) NOT NULL,
        shares INTEGER NOT NULL,
        price REAL NOT NULL,
        "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        user_id INTEGER NOT NULL,
        CONSTRAINT trades_FK FOREIGN KEY (id)
        REFERENCES "users"(id) ON UPDATE CASCADE ON DELETE CASCADE
      );`,
      (err) => {
          if (err) {
            // Table already created
          } else {
            // Table just created
          }
      }
    );
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) {
          console.log('Error running sql ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
}

export default new AppDatabase(databaseFile);