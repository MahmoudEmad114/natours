const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit') // npm i express-rate-limit (package)
// const helmet = require('helmet'); // npm i helmet (package)
const mongoSanitize = require('express-mongo-sanitize'); // npm i express-mongo-sanitize (package)
const xss = require('xss-clean') // npm i xss-clean (package)
const hpp = require('hpp'); // npm i hpp (package)
const cookieParser = require('cookie-parser')
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
// app.set('query parser', 'extended');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

// ! 1.) GLOBAL MIDDLEWARES
// serving static file 
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// app.use(helmet())

// Development logging
if (process.env.NODE_ENV === 'development') {
    // console.log(process.env.NODE_ENV);
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests for this IP, please try again in an hour!',
})
app.use('/api', limiter);

console.log(process.env.NODE_ENV);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// middleware modify incoming response data called middleware bec it is between res and req 

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

// serving static file 
// app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//     console.log('Hello from the middleware');
//     next();
// });

app.use(compression());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString(); // Time and date
    // console.log(req.cookies);
    next();
});

// ! 2.) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
    // must be the last part of our routes
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

// error handling middleware
app.use(globalErrorHandler)

module.exports = app;
