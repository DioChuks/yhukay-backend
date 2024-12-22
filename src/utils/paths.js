const { dirname, join } = require('path')

const joinRelativeToMainPath = (path = '') => {
  const { filename } = require.main || {}

  if (!filename) return path

  return join(dirname(filename), path)
}

const appUrl = (path = '') => `${process.env.APP_URL}/${path}`

module.exports = { joinRelativeToMainPath, appUrl }
