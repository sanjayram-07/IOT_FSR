const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async (req, res, next) => {
  const auth = req.headers['authorization']
  if (!auth) return res.status(401).json({ message: 'No token provided' })
  const parts = auth.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token error' })
  }
  const token = parts[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.id }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}