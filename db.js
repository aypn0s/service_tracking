var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
})

connection.connect()

function query(queryText, terms) {
  return new Promise(function(resolve, reject) {
    connection.query(queryText, terms, function(err, rows) {
      if (err) throw err
      resolve(rows)
    })
  })
}

module.exports = query