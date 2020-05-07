const UniqueIds = require('./uniqueIds')

if( typeof window !== 'undefined' ){
  window['UniqueIds'] = UniqueIds
} else {
  module.exports = UniqueIds
}
