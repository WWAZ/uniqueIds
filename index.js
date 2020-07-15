/**
 * UniqeIds
 * Endless unique ids.
 *
 * @author   WWAZ <https://github.com/WWAZ>
 * @license  NoLicense
 */

const uniqueIds = require('./src/uniqueIds')

if( window ){
  window['UniqueIds'] = uniqueIds
}


module.exports = uniqueIds
