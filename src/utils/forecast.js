const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=232971324ddf7212eb766d768e71c778&query='+ latitude +',' + longitude
    
    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to weather service', undefined)
        } else if (body.error) {
            callback('Unable to find location')
        } else {
            callback(undefined, {
                temperature: body.current.temperature,
                feelsLike: body.current.feelslike,
                forecast: body.current.weather_descriptions[0]
            })
            
        }
    })
}

module.exports = forecast
