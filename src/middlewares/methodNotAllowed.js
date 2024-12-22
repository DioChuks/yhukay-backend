const methodNotAllowed = allowedMethods => {
  return (req, res, next) => {
    const methods = allowedMethods[req.path]
    if (methods && !methods.includes(req.method)) {
      res
        .status(405)
        .json({
          msg: `Method ${req.method} Not Allowed. Allowed methods: ${methods.join(', ')}`
        })
    } else {
      next()
    }
  }
}

module.exports = methodNotAllowed
