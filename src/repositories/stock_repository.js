import database from '../database';
import {fieldsToString, mapNestedToJson} from '../helpers';
import TradeRepository from './trade_repository';

class StockRepository {
  constructor() {
    this.tradesTable = 'trades';
    this.tradeRepository = new TradeRepository();
    this.fieldsMap = {
      'id': 't.id',
      'type': 't.type',
      'symbol': 't.symbol',
      'price': 't.price',
      'timestamp': 't.timestamp',
    }
  }

  async checkSymbolExists(symbol) {
    const result = await database.get(
      `SELECT COUNT(${this.fieldsMap['symbol']}) as symbol_count
      FROM ${this.tradesTable} as t
      WHERE ${this.fieldsMap['symbol']} = ?`,
      [symbol]
    );

    return result['symbol_count'] > 0;
  }

  async filterMaxMinPrice(params) {
    const {
      stockSymbol,
      startDate,
      endDate,
    } = params;

    const conditionals = {
      [`${this.fieldsMap['symbol']} =`]: stockSymbol,
      [`DATETIME(${this.fieldsMap['timestamp']}) >=`]: startDate,
      [`DATETIME(${this.fieldsMap['timestamp']}) <=`]: endDate,
    }

    const condition = fieldsToString(conditionals);

    if(!await this.checkSymbolExists(stockSymbol)) {
      throw 'Stock symbol doesn\'t exists';
    }

    return await database.get(
      `SELECT
      ${this.fieldsMap['symbol']},
      MAX(${this.fieldsMap['price']}) as highest,
      MIN(${this.fieldsMap['price']}) as lowest
      FROM
        ${this.tradesTable} as t
      WHERE
        ${condition}`
    );
  }

  async filterSymbolType(params) {
    const {
      stockSymbol,
      tradeType,
      startDate,
      endDate,
    } = params;

    const conditionals = {
      [`${this.fieldsMap['symbol']} =`]: stockSymbol,
      [`${this.fieldsMap['type']} =`]: tradeType,
      [`DATETIME(${this.fieldsMap['timestamp']}) >=`]: startDate,
      [`DATETIME(${this.fieldsMap['timestamp']}) <=`]: endDate,
    }

    const condition = fieldsToString(conditionals);

    if(!await this.checkSymbolExists(stockSymbol)) {
      throw 'Stock symbol doesn\'t exists';
    }

    const records = await database.all(
      `${this.tradeRepository.visibleFieldsQuery()} WHERE ${condition}`
    );

    return mapNestedToJson(records);
  }
}

export default StockRepository;
