import database from '../database';
import {mapNestedToJson} from '../helpers';
import UserRepository from './user_repository';

class TradeRepository {
  constructor() {
    this.userRepository = new UserRepository();
    this.tradesTable = 'trades';
    this.usersTable = 'users';
    this.fieldsMap = {
      'id': 't.id',
      'type': 't.type',
      'user_id': 't.user_id',
      'user_name': 'u.name',
      'user': `json_object(
        'id', u.id,
        'name', u.name
      ) as user`,
      'symbol': 't.symbol',
      'shares': 't.shares',
      'price': 't.price',
      'timestamp': 't.timestamp',
    }
  }

  visibleFieldsQuery() {
    const fields = [
      this.fieldsMap['id'],
      this.fieldsMap['type'],
      this.fieldsMap['user'],
      this.fieldsMap['symbol'],
      this.fieldsMap['shares'],
      this.fieldsMap['price'],
      this.fieldsMap['timestamp'],
    ];

    return `SELECT ${fields.join(',')}
    FROM ${this.tradesTable} as t
    LEFT JOIN ${this.usersTable} as u on u.id = t.user_id
    `;
  }

  async createTrade(values) {
    const {
      id,
      type,
      user: {
        id: userId,
      },
      symbol,
      shares,
      price,
      timestamp,
    } = values;

    return await database.run(
      `INSERT INTO ${this.tradesTable}
      (id, type, user_id, symbol, shares, price, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, type, userId, symbol, shares, price, timestamp]
    );
  }

  async create(values) {
    try {
      await this.userRepository.createUser(values);
    } catch (error) {
      throw 'Couldn\'t save user';
    }

    try {
      return await this.createTrade(values);
    } catch (error) {
      throw 'Couldn\'t save trade';
    }
  }

  async erase() {
    return await database.run(
      `DELETE FROM ${this.tradesTable}`
    );
  }

  async filterByUser(userId) {
    const records = await database.all(
      `${this.visibleFieldsQuery()} WHERE ${this.fieldsMap['user_id']} = ?`,
      [userId]
    );

    return mapNestedToJson(records);
  }

  async get(){
    const records = await database.all(
      this.visibleFieldsQuery()
    );

    return mapNestedToJson(records);
  }
};

export default TradeRepository;
