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
app.use(cors());
app.use('/images', express.static(path.join(process.cwd(), 'images')));
//sessions
app.use(session({
  secret: 'keyboard cat',
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