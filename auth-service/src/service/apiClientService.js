const axios = require('axios');
const CircuitBreaker = require('opossum')

const CircuitBreakerOption = {
    time: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000
}

module.exports = {
    callExternalApi : async (url,method,data=null) => {
        try {
            const axiosMethod = axios[method.toLowerCase()]
            const axiosCircuitBreaker = new CircuitBreaker(axiosMethod, CircuitBreakerOption)
            const response = await axiosCircuitBreaker.fire(url, data);
            return response
        } catch (error) {
            console.error("Error:", error);
            throw new Error("Failed to call external API")
        }
    }
}
