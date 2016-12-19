// @flow

const http = require('http')
const config = require('./config')
const router = require('rlite-router')()
const templates = require('./templates')
const database = require('./database')(config.database.name, config.database.username, config.database.password)
const fs = require('fs')

//Create a server
module.exports = http.createServer(function(request, response) {
    const send = (content) => response.end(content)
    response.setHeader('content-type', 'text/html')

    router.add('home', function (r) {
        send(templates('home'))
    })


    router.add('api/connectors', function() {
        response.setHeader('Content-Type', 'application/json')
        database.Connectors.findAll().then((result) => {
            send(JSON.stringify(result))
        })
    })

    router.add('api/items/:item', function() {
        response.setHeader('Content-Type', 'application/json')
        database.Items.findAll({
            where: {
                id: r.params.item
            },
            include: [
                {model: database.Connectors}
            ]
        }).then((result) => {
            send(JSON.stringify(result))
        })
    })

    router.add('api/items', function() {
        response.setHeader('Content-Type', 'application/json')
        if (request.method === 'POST') {
			var result = ''

			request.on('data', function(chunk) {
				result += chunk
			})

			request.on('end', function() {
                let item = JSON.parse(result.split('\n')[3])
                database.Items.create(item).then(function() {
                    send(JSON.stringify({ok: true}))
                })
            })
        } else {
            send('404')
        }
    })


    if (!router.run(request.url)) send('404')
})
