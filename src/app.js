import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import env from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
