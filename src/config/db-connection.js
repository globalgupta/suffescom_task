const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION_LOCAL_URI)
    .then(() => console.log('Database is connected...'))
    .catch((err) => console.log('Database is not connected', err.message));
