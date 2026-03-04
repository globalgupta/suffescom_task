const express = require('express');
const app = express();
require('dotenv').config();
require('./config/db-connection');

app.use(express.json());

const userRoutes = require('./routes/user-route');
const paymentRoutes = require('./routes/payment-route');
app.use('/api/user/v1', userRoutes);
app.use('/api/payment/v1', paymentRoutes);


const port = process.env.PORT || 3000;
app.listen(port, async () => console.log(`App is listening at port: ${port}`));

