module.exports = fn => {
    // we create this to use it instead of duplicated try, catch code
    return (req, res, next) => { // anonymous fun to pass req, res, next
        fn(req, res, next).catch(err => next(err))
    }
}