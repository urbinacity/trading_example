import StockRepository from '../repositories/stock_repository';
const stockRepository = new StockRepository();

// Get Stock Symbol by Trade Type and Date Range
const getStocksByType = async (req, res) => {
  let results;

  const params = {
    stockSymbol: req.params['stockSymbol'],
    tradeType: req.query['type'],
    startDate: req.query['startDate'],
    endDate: req.query['endDate']
  }

  try {
    results = await stockRepository.filterSymbolType(params);
  } catch (error) {
    res.status(404).send({message: 'There are no trades with the symbol requested.'});
  }

  res.status(200).send(results);
};


// Get Stock Symbol by Date Range with Highest and Lowest Price
const getStocksWithPrices = async (req, res) => {
  let results;

  const params = {
    stockSymbol: req.params['stockSymbol'],
    startDate: req.query['startDate'],
    endDate: req.query['endDate']
  }

  try {
    results = await stockRepository.filterMaxMinPrice(params);
  } catch (error) {
    res.status(404).send({message: 'There are no trades with the symbol requested.'});
  }

  if(results && results['symbol']) {
    res.status(200).send(results);
  } else {
    res.status(200).send({message: 'There are no trades in the given date range.'});
  }
};

export {
  getStocksByType,
  getStocksWithPrices
};
