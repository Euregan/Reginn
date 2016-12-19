// @flow

const Sequelize = require('sequelize')

module.exports = (database, username, password) => {
    let db = new Sequelize(database, username, password, {logging: () => {}})
    let tables = {}

    tables.Items = db.define('items', {
        id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
        name: { type: Sequelize.DATE }
    })

    tables.Connectors = db.define('connectors', {
        id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
        name: { type: Sequelize.STRING }
    })

    tables.Items.belongsToMany(tables.Connectors, {through: 'items_conectors'})
    tables.Connectors.belongsToMany(tables.Items, {through: 'items_conectors'})

    tables.Items.sync().then(() => {
        tables.Connectors.sync()
    })

    return tables
}
