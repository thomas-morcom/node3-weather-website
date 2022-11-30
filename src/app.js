const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup Handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Tom Morcom'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Tom Morcom'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Tom Morcom',
        helpText: 'This is where you get help'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address must be provided'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({ error })
        } 
    
        forecast(latitude, longitude, (error, {temperature, feelsLike, forecast} = {}) => {
            if (error) {
                return res.send({ error })
            }
        
            res.send({
                location,
                forecast,
                temperature,
                feelsLike,
                address: req.query.address
            })
        })
    })
})

// app.get('/products', (req, res) => {
//     if (!req.query.search) {
//         return res.send({
//             error: 'You  must provide a search query'
//         })
//     }

//     console.log(req.query.search)
//     res.send({
//         products: []
//     })
// })

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Page not found',
        name: 'Tom Morcom',
        errorMessage: 'Help article not found. Try navigating back to the Help page'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Page not found',
        name: 'Tom Morcom',
        errorMessage: 'Page not found'
    })

})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})