import Airtable from 'airtable'
import express from 'express'
import bodyParser from 'body-parser'
import 'isomorphic-fetch'

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/manifest.json', (request, response) => {
  response.sendFile(`${__dirname}/public_files/manifest.json`)
})

app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`)
})

app.get("/shoppinglist", function(request, response, next) {
  response.sendFile(`${__dirname}/views/index.html`)
})

app.get("/chalkboard", function(request, response, next) {
  response.sendFile(`${__dirname}/views/index.html`)
})

// Cache the records in case we get a lot of traffic.
// Otherwise, we'll hit Airtable's rate limit.
var cacheTimeoutMs = 5 * 1000; // Cache for 5 seconds.
var cachedAirtableResponse = null;
var cachedAirtableResponseDate = null;
var cachedWeatherResponse = null;
var cachedWeatherResponseDate = null;

var airtableBase = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

app.get("/api/shoppinglist", function(_, response) {
  if (cachedAirtableResponse && new Date() - cachedAirtableResponseDate < cacheTimeoutMs) {
    response.send(cachedAirtableResponse);
  } else {
    airtableBase('shoppinglist').select({
      maxRecords: 100,
      view: 'Grid view',
    }).firstPage(function(error, records) {
      if (error) {
        response.send({error: JSON.stringify(error)});
      } else {
        
//         airtableBase('shoppinglist').select({
//           maxRecords: 100,
//           view: 'Grid view',
//         }).firstPage(function(error, records) {
//           if (error) {
//             response.send({error: JSON.stringify(error)});
//           } else {
        
//           }
//         })
        cachedAirtableResponse = {
          items: records.map(record => {
            return {
              id: record.id,
              name: record.get('name'),
              needed: record.get('needed'),
              notes: record.get('notes'),
              location: record.get('location')
            };
          }),
        }
        // disable cache for now
        // cachedAirtableResponseDate = new Date()
        response.send(cachedAirtableResponse)
      }
    })
  }
})

app.post("/api/shoppinglist/items", function(request, response, next) {
  airtableBase('shoppinglist').create({
      name: request.body.name,
      needed: true
    }, (err, record) => {
      if (err) { console.error(err); return; }
      response.send({ok: true})
    })
})

app.patch("/api/shoppinglist/items/:id", function(request, response, next) {
  airtableBase('shoppinglist').update(request.params.id, {
      needed: request.body.needed
    }, (err, record) => {
      if (err) { console.error(err); return; }
      response.send({ok: true})
    })
})

app.get("/api/weather", function(_, response) {
  if (cachedWeatherResponse && new Date() - cachedWeatherResponseDate < cacheTimeoutMs) {
    response.send(cachedWeatherResponse)
  } else {
    let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${process.env.LATITUDE},${process.env.LONGITUDE}`
    fetch(url).then(response => response.json()).then((data) => {
      response.send(data.currently)
    })                                   
  }
})                                                    
                                                      
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}. 🚢`)
})
