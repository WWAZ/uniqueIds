const uniqueIds = require('./uniqueIds')

if( typeof window !== 'undefined' ){
  // We're in a brwoser
  window['uniqueIds'] = uniqueIds
} else {
  // We're on a server
  module.exports = uniqueIds
}
