import { Application, Request, Response } from 'express';
import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';

import registerRoutes from './routes';

let app:Application = express();

app.use( morgan('dev') );

app.use(cors());
app.options('*', cors());

registerRoutes(app);

app.listen(3000, () => {
  console.log('the magic is on port 3000');
});
