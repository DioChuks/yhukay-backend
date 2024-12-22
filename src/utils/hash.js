const { hash } = require('bcrypt')

const createHash = (string) => hash(string, 10)

module.exports = createHash