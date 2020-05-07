import TradeRepository from '../repositories/trade_repository';
const tradeRepository = new TradeRepository();
// Add new trade
const addTrade = async (req, res) => {
  let newTrade;
  try {
    newTrade = await tradeRepository.create(req.body);
  } catch (error) {
    res.status(400).send({message: 'Error creating new trade'});
  }
  res.status(201).send(newTrade);
};

// Get trades list
const getTrades = async (req, res) => {
  res.status(200).send(await tradeRepository.get());
};

// Get Trade by User ID
const getTradesByUserId = async (req, res) => {
  const { userId } = req.params
  const results = await tradeRepository.filterByUser(parseInt(userId))

  if(results.length > 0) {
    res.status(200).send(results);
  } else {
    res.status(404).send({message: 'User was not found'});
  }
};

export {
  addTrade,
  getTrades,
  getTradesByUserId
};
