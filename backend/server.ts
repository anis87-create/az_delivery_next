import 'dotenv/config';
import * as express from 'express';
import * as cors from 'cors';
import authRouter from './src/routes/auth';
import restaurantRouter from './src/routes/restaurant';
import itemRouter from './src/routes/items';
import categoryRouter from './src/routes/category';
import connectDB from './src/config/db';

const app = express();
const PORT = process.env.DEFAULT_PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/owner/restaurant', restaurantRouter);
app.use('/api/items', itemRouter);
app.use('/api/categories', categoryRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});