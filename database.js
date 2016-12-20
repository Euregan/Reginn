// @flow

const Sequelize = require('sequelize')

module.exports = (database, username, password) => {
    const firstTime = false
    let db = new Sequelize(database, username, password, {logging: () => {}})
    let tables = {}

    tables.Items = db.define('items', {
        id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
        name: { type: Sequelize.STRING }
    })

    tables.Connectors = db.define('connectors', {
        id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
        name: { type: Sequelize.STRING }
    })

    tables.Specifications = db.define('specifications', {
        id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
        name: { type: Sequelize.STRING }
    })

    tables.ItemsSpecifications = db.define('items_specifications', {
        type: {type: Sequelize.STRING(1) }
    })

    tables.Items.belongsToMany(tables.Specifications, {through: tables.ItemsSpecifications})
    tables.Specifications.belongsToMany(tables.Items, {through: tables.ItemsSpecifications})
    tables.Specifications.belongsTo(tables.Connectors)
    tables.Connectors.hasMany(tables.Specifications)

    tables.Connectors.sync({force: firstTime}).then(() => {
        tables.Specifications.sync({force: firstTime}).then(() => {
            tables.Items.sync({force: firstTime}).then(() => {
                tables.ItemsSpecifications.sync({force: firstTime}).then(() => {
                })
            })
        })
    })

    return tables
}
