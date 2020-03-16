var fs = require('fs')

fs.readFile('./upload.txt', 'utf-8', function(err, data) {
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
})

var data = 'hello jack'
fs.writeFile('./upload.txt', data, function(err, data) {
  if (err) {
    console.log(err)
  } else {
    console.log('ok')
  }
})

try {
  var wData = 'hi, mick'
  fs.writeFileSync('./upload.txt', wData)
} catch (err) {
  console.log(err)
}