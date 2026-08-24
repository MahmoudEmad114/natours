const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    // handled exception error 
    // cl(x) => but x is not defined yet!
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// const LDB = process.env.DATABASE_LOCAL;
// console.log(DB);

mongoose
    .connect(DB)
    .then(() => {
        console.log('DB connection successful!');
        // console.log('Current DB Name:', mongoose.connection.name);
        // console.log('Connection readyState:', mongoose.connection.readyState);
    })
// .catch(err => console.log('ERROR'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    // handled server error 
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});





