// @flow

const hogan = require('hogan.js')
const fs = require('fs')

const main = hogan.compile(fs.readFileSync('./templates/main.html').toString())

const template = (template) => {
    let file = fs.readFileSync('./templates/' + template + '.html').toString()
    let body = hogan.compile(file)
    return (data) => main.render({title: "Reginn", body: body.render(data)})
}

module.exports = (view, data) => template(view)(data)
