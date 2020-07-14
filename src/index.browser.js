/**
 * UniqeIds
 * Endless unique ids.
 *
 * @author   WWAZ <https://github.com/WWAZ>
 * @license  NoLicense
 */

const uniqueIds = require('../src/uniqueIds')

if( typeof window !== 'undefined' ){
  // We're in a browser
  window['uniqueIds'] = uniqueIds
}
