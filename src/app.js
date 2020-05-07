import 'babel-polyfill';
import path from 'path';
import express from 'express';

import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import routes from './routes';
import db from './database';

const DIST_DIR = path.join(__dirname, 'public');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

async function initApp() {
  const app = express();

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(routes);
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(HTML_FILE);
  });

  /**
   * Insert any async code here if required, e.g,
   *
   * await initDatabaseConnection(...)
   */

  return app
}



export default initApp;
