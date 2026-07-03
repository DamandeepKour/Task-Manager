import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import helmetConfig from './config/helmet.js';
import corsConfig from './config/cors.js';
import rateLimiter from './config/rateLimit.js';
import routes from './routes/index.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet(helmetConfig));
app.use(cors(corsConfig));
app.use(rateLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(requestLogger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
