import express from 'express';

import { erase } from './erase';
import { addTrade, getTrades, getTradesByUserId } from './trades';
import { getStocksByType, getStocksWithPrices } from './stocks';

const router = express.Router();

router.delete('/erase', erase);
router.get('/trades', getTrades);
router.post('/trades', addTrade);
router.get('/trades/users/:userId', getTradesByUserId);
router.get('/stocks/:stockSymbol/trades', getStocksByType);
router.get('/stocks/:stockSymbol/price', getStocksWithPrices);

export default router;
