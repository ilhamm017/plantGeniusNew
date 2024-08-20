class httpError extends Error {
    constructor(statusCode, message, name='', error='') {
        super(message),
        this.statusCode = statusCode,
        this.name = name,
        this.error = error
    }
}

module.exports = {
    httpError
}