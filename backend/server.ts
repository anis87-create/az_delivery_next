import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './src/routes/auth';
import restaurantRouter from './src/routes/restaurant';
import itemRouter from './src/routes/items';
import categoryRouter from './src/routes/category';
import cartItemRouter from './src/routes/cartItems';
import orderRouter  from './src/routes/orders';
import connectDB from './src/config/db';
import * as path from 'path';
import passport from 'passport';
import passportConfig from './src/config/passport';
import session from 'express-session';

const app = express();
const PORT = process.env.DEFAULT_PORT || 5000;

// Connect to database
connectDB();
passportConfig(passport);
// Middleware
app.use(express.json());
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

const allowedPatterns = process.env.CORS_PATTERN
  ? process.env.CORS_PATTERN.split(',').map(p => new RegExp(p.trim()))
  : [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (allowedPatterns.some(pattern => pattern.test(origin))) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use('/images', express.static(path.join(process.cwd(), 'images')));
//sessions
app.use(session({
  secret: process.env.SESSION_SECRET ?? 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))
//passwort middlewares
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use('/api/auth', authRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/items', itemRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cartItems', cartItemRouter);
app.use('/api/orders', orderRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});