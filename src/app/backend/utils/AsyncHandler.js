export const asyncHandler = (fn) => (req, res, next) => {
    try {
        return fn(req, res, next);
    } catch (error) {
        next(error);
    }
}