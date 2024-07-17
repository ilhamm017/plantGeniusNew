require('dotenv').config();
const axios = require('axios')
const CircuitBreaker = require('opossum')

const CircuitBreakerOption = {
    time: 30000,
    errorThresholdPercentage: 50,
    resetTimeout: 100000,
    halfOpen: false,
    timeout: 100000
}

const axiosCircuitBreaker = new CircuitBreaker(axios, CircuitBreakerOption) 
// ============================== Implementasi event ==============================
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
    console.error('Request failed:', error);
  });
  
module.exports = {
    uploadToExternalAPI : async ( url, method, base64Image=null ) => {
        try {
            const response = await axiosCircuitBreaker.fire({
                method: method.toLowerCase(),
                url: `http://${process.env.DETECTION_SERVICE_URL}${url}`,
                data : {
                    image : base64Image
                }
            })
            if (response.status !== 200) {
                throw new Error({
                    message : response.data.message,
                    status : response.status,
                })
            }
            return response.data
        } catch (error) {
            console.error("Error:", error.message);
            throw new Error("Gagal mengupload gambar")
            throw error
        }
    },
    createHistory : async (url,method,disease,userId,token) => {
      try {
          const response = await axiosCircuitBreaker.fire({
              method: method.toLowerCase(),
              url: `http://${process.env.HISTORY_SERVICE_URL}${url}`,
              data : {
                  userId,
                  disease
              },
              headers: {
                'Authorization': token
              }
          })
          if (response.status !== 201) {
              throw new Error({
                  message : response.data.message,
                  status : response.status,
              })
          }
          return response
      } catch (error) {
          console.error("Error", error.message)
          throw error
      }
  }
}