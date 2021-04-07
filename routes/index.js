const express = require('express')
const router = express.Router()
const query = require("../db")

router.get('/', async function(req, res, next) {
  const rmaid = req.query.id
  let rows = []
  if ( rmaid ) { 
    rows = await query("SELECT * FROM transactions " +  
      "WHERE rmaid = ? " +
      "AND (details like '%Created by%' " +
      "OR details like '%Status Changed from%') " +
      "ORDER BY date ASC", 
      [rmaid]
    )
  }
  if ( rows.length ) {
    res.render('status', {rows: rows})
  } else {
    res.render('index', {id: rmaid})
  }
})

module.exports = router