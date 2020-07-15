/**
 * Creates endless unique ids
 * --------------------------------------------------------------------------
 *
 * Starting from 'aab' ... 'aac' ... 'ZZZ' ... 'baaa' ... to infinity.
 *
 * Default character depot consists of all upper- and lowercase letters
 * (= 52 chars). A default id length of 3 characters provides
 * (52) x (52) x (52) = 140.608 combinations.
 *
 * Environmental behavioral differences
 * --------------------------------------------------------------------------
 * - Browser) Every request lifecycle starts with 'aaa'.
 * - Node) Runs as long the server is up. Use reset() to start from 'aaa'.
 *
 * @author   WWAZ <https://github.com/WWAZ>
 * @license  NoLicense
 *
 * @module uniqueId
 */


"use strict"


/**
 * Minimal length of character depot.
 *
 * @var {number}
 */
let minDepotLength = 3


/**
 * Error handler method.
 * Default is throwing an error message.
 * It may be overidden by setErrorHandler()
 *
 * @param {string} msg
 * @private
 */
let _errorHandler = (msg) => {
  throw TypeError(msg)
}


/**
 * Resets error handler method.
 *
 * @param {function} method
 * @return nothing
 */
const setErrorHandler = function(method){
  if( typeof method === 'function' ){
    _errorHandler = method
  }
}


/**
* Initial first id
* as numeric value. Where -1 = 0.
*
* @var {number}
* @private
*/
let initalNumber = -1


/**
* Number of last created id.
*
* @var {number}
* @private
*/
let lastNumber = initalNumber


/**
* Initial depot charcaters.
*
* @var {string}
* @private
*/
let depotChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'


/**
 * Sets initial first id.
 *
 * @param {mixed} val - id string or number
 * @return nothing
 * @private
*/
const setInitial = function(val){
  if( typeof val === 'string' ){
    if( valid(val) ){
      setInitialNumber( toNumber(val) )
    }
  }
  if( typeof val === 'number' ){
    setInitialNumber( val )
  }
}


/**
 * Sets initial first id by number.
 *
 * @param {number} val - initial id value
 * @return nothing
 * @private
*/
function setInitialNumber(val){
  initalNumber = val - 1
  lastNumber = initalNumber
}


/**
 * Sets depot chars.
 *
 * @param {string} val - depot chars
 * @return nothing
*/
const setDepot = function(val){

  if( typeof val !== 'string' ){
    return _errorHandler('Depot must be type of string.')
  }

  if(val.length < minDepotLength ){
    return _errorHandler('Depot string needs to have a length of at least ' + minDepotLength + ' characters.')
  }

  if( countMultipleCharacters(val) > 0 ){
    return _errorHandler('Depot may not contain any character twice.')
  }

  if( /\d/.test(val) ){
    return _errorHandler('Depot may not contain numbers.')
  }

  // Release cache
  depotReleaseCache()

  depotChars = val

  // Set initial value (three times first char of depot)
  setInitial(depotFirst() + depotFirst() + depotFirst())

}


/**
 * Returns the number of characters
 * that appear at least twice in a string.
 *
 * e.g. 'abbcdddef' -> 2 => found 'b' and 'd' more than once.
 *
 * @param {string} str
 * @return {number}
 * @private
 */
function countMultipleCharacters(str){
   try{
     return str.split('').sort().join('').match(/(.)\1+/g).length
   } catch( e ){
     // TypeError
     return 0
   }
}


/**
 * Returns new unique id.
 *
 * @param none
 * @return {string} unique id
 *
 * @example
 * let id = uniqueId.make() // --> 'aaa'
*/
const make = function(){
  lastNumber++
  return toString(lastNumber)
}


/**
 * Sets last id to it's inital value (default = 'aaa')
 *
 * @param none
 * @return nothing
*/
const reset = function(){
  lastNumber = initalNumber
}


/**
 * Returns last generated id.
 *
 * @param none
 * @return {string} id
 */
const lastId = function(){
  if( lastNumber === initalNumber ){
    return false
  }
  return lastNumber >= 0 ? toString( lastNumber ) : false
}


/**
 * Returns true when given id exists.
 *
 * @param {string} id
 * @return {boolean}
 */
const exists = function(id){
  if( toNumber(id) <= lastNumber ){
    return true
  }
  return false
}


/**
 * Returns numeric representation of given id.
 *
 * @param {string} id
 * @return {number} numeric representation
 */
const toNumber = function(id){
  if( typeof id !== 'string' ){
    return _errorHandler('Value must be string')
  }
  id = id.split('')
  let dl = depotLength()
  let placeValue = id.length - 1
  let number = 0
  for(let i in id){
    number+= depotCharIndex(id[i]) * Math.pow(dl, placeValue)
    placeValue--
  }
  return Math.round(number)
}


/**
 * Returns id by given number.
 *
 * @param {number} number
 * @return {string} id
 */
const toString = function(number){

  if( typeof number !== 'number' ){
    return _errorHandler('Value must be number')
  }

  if( number < 0 ){
    return _errorHandler('Number must be > 0')
  }

  let dpl = depotLength()

  // Carryover to next loop
  let carryover = number

  // Index of character
  let charIndex

  // Total sum of set characters per loop
  let sumCharsTotal = 0

  // Final id string
  let id = ''

  for(let placeValue = getMaxPlaceValue(number); placeValue >= 0; placeValue--){
    charIndex = Math.floor(dpl / (Math.pow(dpl, placeValue + 1) / carryover) )
    id+= depotIndex(charIndex)
    sumCharsTotal+= charIndex * Math.pow(dpl, placeValue)
    carryover = number - sumCharsTotal
  }

  return id

}


/**
 * Returns maximal possible power for given number.
 *
 * @param {number} number
 * @return {number} power
 */
function getMaxPlaceValue(number){
  let power = 0
  while(number >= Math.pow(depotLength(), power)){
    power++
  }
  return power < minDepotLength ? minDepotLength - 1 : power - 1
}


/**
 * Returns true when given id is valid.
 *
 * @param {string} id
 * @return {boolean}
 */
const valid = function(id){
  return validate(id)
}


/**
 * Returns true when given id is valid.
 *
 * @param {string} id
 * @return {boolean}
 */
function validate(id){
  id = id.split('')
  if( id.length < minDepotLength ){
    return false
  }
  let dp = depot()
  for(let i in id){
    if( dp.indexOf(id[i]) === -1 ){
      return false
    }
  }
  return true
}


/**
 * Depot cache values.
 *
 * @private
 */
let _depot = false
let _depotLength = false
let _depotFirst = false
let _depotSecond = false


/**
 * Releases depot cache.
 *
 * @param none
 * @return nothing
 * @private
 */
function depotReleaseCache(){
  _depot = false
  _depotLength = false
  _depotFirst = false
  _depotSecond = false
}


/**
* Returns depot string.
*
* @param none
* @return {string} depot string
*/
const depot = function(){
  return depotChars
}


/**
 * Returns splitted depot as array.
 *
 * @param none
 * @return {array} depot
 * @private
 */
function depotSplit(){
  if( !_depot ){
    _depot = depot().split('')
  }
  return _depot
}


/**
 * Returns index of given char in depot.
 *
 * @param {string} char
 * @return {number} index
 * @private
 */
function depotCharIndex(char){
  return depotSplit().indexOf(char)
}


/**
 * Returns char at given index in depot.
 *
 * @param {number} index
 * @return {string} char
 * @private
 */
function depotIndex(index){
  return depotSplit()[index]
}


/**
 * Return depot length.
 *
 * @param none
 * @return {number}
 * @private
 */
function depotLength(){
  if( !_depotLength ){
    _depotLength = depotSplit().length
  }
  return _depotLength
}


/**
 * Returns first character
 * of depot chars.
 *
 * @param none
 * @return {string} first depot char
 * @private
*/
function depotFirst(){
  if( !_depotFirst ){
    _depotFirst = depot().substr(0,1);
  }
  return _depotFirst
}


/**
 * Returns second character
 * of depot chars.
 *
 * @param none
 * @return {string} first depot char
 * @private
*/
function depotSecond(){
  if( !_depotSecond ){
    _depotSecond = depot().substr(1,1);
  }
  return _depotSecond
}


module.exports = {
  setInitial,
  make,
  reset,
  lastId,
  exists,
  toNumber,
  toString,
  valid,
  depot,
  setDepot,
  setErrorHandler
}
