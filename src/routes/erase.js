import TradeRepository from '../repositories/trade_repository';
const tradeRepository = new TradeRepository();

// Delete all trades
const erase = async (req, res) => {
  res.status(200).send(await tradeRepository.erase());
};

export { erase };
