const express = require('express')
const router = express.Router()
const query = require("../db")

router.get('/', async function(req, res, next) {
  const rmaid = req.query.id
  let rows = []
  if ( rmaid ) { 
    rows = await query("SELECT * FROM rmatrack WHERE rmaid = ?", rmaid)
  }
  if ( rows.length ) {
    res.render('status', {rows: rows})
  } else {
    res.render('index', {id: rmaid})
  }
})

module.exports = router