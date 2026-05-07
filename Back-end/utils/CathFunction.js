export const cathFunction = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}
