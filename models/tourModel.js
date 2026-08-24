const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'], // built-in validation
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters'],
        minlength: [10, 'A tour name must have more or equal than 10 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contain characters'] // library validation
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: { // custom validation
            validator: function (val) {
                // this only points to current doc on NEW document creation
                return val < this.price; // true when price > discount and false otherwise
            },
            message: 'Discount price ({VALUE}) should be below the regular price'
        }
    },
    summary: {
        type: String,
        trim: true, // works with strings only
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    // reviews: [
    //     {
    //         type: mongoose.Schema.ObjectId,
    //         ref: 'Review'
    //     }
    // ]
},
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' })

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create() only
/* !Important note: don't use next with this latest version of mongoose it is automatically supported */
tourSchema.pre('save', function () {
    this.slug = slugify(this.name, { lower: true });
})

// tourSchema.pre('save', async function () {
//     const guidesPromises = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises)
// })

// tourSchema.pre('save', function () {
//     console.log(this);
//     console.log('will save document...');
// })

// tourSchema.post('save', function (doc) {
//     console.log(doc);
// })

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function () {
    // tourSchema.pre('find', function () {
    this.find({ secretTour: { $ne: true } })

    this.start = Date.now();
});

tourSchema.pre(/^find/, function () {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt' // '-__v -passwordChangedAt -passwordResetToken -passwordResetExpires'
    });
})

tourSchema.post(/^find/, function (docs) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    // console.log(docs);
})


// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function () {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     console.log(this.pipeline());
// })

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
