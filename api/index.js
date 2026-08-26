require('dotenv').config();

const mongoose = require('mongoose');
const app = require('../app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

let connection;

const connectDB = async () => {
    if (connection) return;

    connection = await mongoose.connect(DB);
};

module.exports = async (req, res) => {
    await connectDB();
    app(req, res);
};