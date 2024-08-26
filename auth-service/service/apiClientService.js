require('dotenv').config();
const axios = require('axios');
const CircuitBreaker = require('opossum');
const { httpError } = require('../helpers/httpError');

const CircuitBreakerOption = {
    time: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
    halfOpen: true
};

const axiosCircuitBreaker = new CircuitBreaker(axios, CircuitBreakerOption);

// ============================ IMPLEMENTASI EVENT ===============================

axiosCircuitBreaker.on('open', () => {
  console.warn('Circuit breaker is now open. Requests will be rejected.');
});

axiosCircuitBreaker.on('close', () => {
  console.log('Circuit breaker is now closed. Requests will be forwarded.');
});

axiosCircuitBreaker.on('halfOpen', () => {
  console.log('Circuit breaker is now in half-open mode. Trying one request.');
});

axiosCircuitBreaker.on('success', (response) => {
  console.log('Request successful:', response.data);
});

axiosCircuitBreaker.on('failure', (error) => {
  console.error('Request failed:', error.message);
});

module.exports = {
    callExternalApi : async (url,method,data=null) => {
        try {
            const response = await axiosCircuitBreaker.fire({
                method: method.toLowerCase(),
                url: `http://${process.env.USER_SERVICE_URL}${url}`,
                data
            })
            return response
            
        } catch (error) {
          if (error.code === 'ECONNREFUSED') {
            console.error("Error", error.message)
            throw new httpError(503, 'Layanan pengguna sedang tidak tersedia. Coba lagi nanti!', 'Service Error', error.message)
          }
          throw error.response.data
        }
    }
};