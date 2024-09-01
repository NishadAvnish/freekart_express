const asncHandler = (fn) => async (req, res, next) => {
    try {

        await fn(req, res, next);
    } catch (er) {
        next(er);
    }
}