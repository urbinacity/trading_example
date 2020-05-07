import database from '../database';

class UserRepository {
  constructor() {
    this.usersTable = 'users';
  }

  async createUser(values) {
    const {
      user: {
        id: userId,
        name: userName,
      },
    } = values;

    return await database.run(
      `INSERT INTO ${this.usersTable}
      (id, name)
      SELECT ${userId}, "${userName}"
      EXCEPT
      SELECT id, name FROM ${this.usersTable}
      WHERE id = ${userId} AND name = "${userName}"`,
    );
  }
};

export default UserRepository;
