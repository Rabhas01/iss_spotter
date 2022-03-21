/*
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
      
    if (error) {
      callback(error, null);
    }
  
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
  
    const data = JSON.parse(body);
    callback(null, data['ip']);
  });

};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ip-api.com/json/${ip}`, (error, response, body) => {
      
    if (error) {
      callback(error, null, null);
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null, null);
      return;
    }
    
    const data = JSON.parse(body);
    callback(null, data['lat'], data['lon']);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords[0]}&lon=${coords[1]}`, (error, response, body) => {
      
    if (error) {
      callback(error, null);
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const data = JSON.parse(body);
    callback(null, data['response']);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      
      callback(error, null);
    }
  
    fetchCoordsByIP(ip, (error, lat, long) => {
      if (error) {
        
        callback(error, null);
      }
        
      fetchISSFlyOverTimes([lat, long], (error, issSpottedArry) => {
        if (error) {
          
          callback(error, null);
        }
  
        callback(null, issSpottedArry);
      });
  
    });
  });
};

module.exports = { nextISSTimesForMyLocation };