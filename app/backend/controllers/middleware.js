module.exports.validateBody = (spec) => {
    // creates a middleware dynamicly
    return (req, res, next) => {
        // helper function used in mapping keys in given spec
        function notContainsKey(key) {
            // if given key isn't present in the request body, return a dict with error message
            if(!req.body[key]) {
                const error = {}
                error[key] = `Couldn't found the ${key} key in the request body.`
                return error
            }
            // otherwise, return false, as there's no error about that key
            return false
        }
        // map every key in the spec and filter out false values
        const errorMessages = spec.map(notContainsKey).filter(error => error)
        // if there are any errors, return them
        if(errorMessages.length > 0) {
            return res.status(400).send({
                errmsg: errorMessages
            })
        }
        // else, continue with the execution
        next()
    }
}
