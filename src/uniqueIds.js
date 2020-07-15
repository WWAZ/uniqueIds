/*
 |--------------------------------------------------------------------------
 | Unique Ids
 |--------------------------------------------------------------------------
 |
 | Creates unique id strings
 | starting from 'aab' ... 'aac' ... 'ZZZ' ... 'ZZZa' ... infinity
 |
 | Default character depot consists of all upper- and lowercase letters
 | (= 48 chars). A default id length of 3 characters provides
 | 110.592 possible combinations.
 | (48) x (48) x (48) = 110.592
 |
 |
 | Environmental behavioral differences
 |--------------------------------------------------------------------------
 | Unique ids will be created ...
 | a) Browser: for the length of a request lifecycle
 | b) Node: as long as the server is up (use reset() to start from 'aaa')
 |
 |
*/


/**
 * Creates global unique ids
 *
 * starting from 'aab' ... 'aac' ... 'ZZZ' ... 'ZZZa' ... infinity.
 * - Browser) Every request lifecycle starts with 'aaa'.
 * - Node) Runs as long the server is up. Use reset() to start from 'aaa'.
 *
 * @module uniqueId
 */


"use strict"


/**
 * Minimal length of character depot
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
 * Resets error handler method
 *
 * @param {function} method
 */
const setErrorHandler = function(method){
  if( typeof method === 'function' ){
    _errorHandler = method
  }
}


/**
* Initial first id
* Needs to have min length of minDepotLength (default = 3).
*
* @var {string}
* @private
*/
let inital = 'aaa'


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
 * @param {string} val - initial id value
 * @return nothing
*/
const setInitial = function(val){
  if( val.length < minDepotLength ){
    return _errorHandler('Initial value needs to have a length of at least 3 characters.')
  }
  inital = val
  last = val
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
  let first = depotFirst()
  setInitial(first + first + first)

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
     return str.toLowerCase().split('').sort().join('').match(/(.)\1+/g).length
   } catch( e ){
     // TypeError
     return 0
   }
}


/**
 * Stores last provided id.
 * Default is initial.
 *
 * @var {string}
 * @private
*/
let last = inital


/**
 * Sets last id.
 *
 * @param {string} id
 * @return nothing
 * @throws {Error} when no id is provided or id is unvalid
 * @private
 */
function setLast(id){
  if( typeof id !== 'undefined' ){
    if( validate(id) ){
      last = id
      return true
    }
  }
  return _errorHandler('Id "' + id + '" is unvalid.')
}


/**
 * Returns new unique id.
 *
 * @param none
 * @return {string} unique id
 *
 * @example
 * const uniqueId = require('uniqueId')
 * let id = uniqueId.make() // --> 'aaa'
*/
const make = function(){

  // Split last id into single chars
  let l = last.split('')
  // n = index of last string
  let n = l.length - 1

  let updated = 0;
  let next

  // Start with last char.
  // If there's a next character
  // in char depot, last letter
  // will be replaced.
  // 'abc' -> 'abd'
  // When there's no next char,
  // the leftern char will be updated
  // and so on.
  // 'abz' -> 'aca'
  while (!updated && n > -1) {
    // Set next char
    next = getNext(l[n], n)
    if( next ){
      // We've found next.
      // Update id.
      l[n] = next
      updated = 1
      // Set all following to first char.
      // e.g. 'abz' -> 'aca'
      // e.g. 'azz' -> 'baa'
      let nn = n + 1;
      if( typeof l[nn] !== 'undefined' ){
        for(let i=nn; i < l.length; i++){
          l[i] = depotFirst()
        }
      }
    }
    n--
  }

  if( !updated ){
    // No character was updated, no new id was found
    // extend id length by 1, add first character.
    // e.g. ZZZ -> baaa
    l = addPlaceValue(l)
  }

  // Convert char arr back to string.
  last = l.join('')

  // Return new id
  return last

}


/**
 * Add place value to id
 * e.g. ZZZ -> baaa.
 *
 * @param {array} id
 * @return {array} id
 * @private
 */
function addPlaceValue(arr){
  for(let i in arr){
    // set all digits to first char of depot (regulary 'a')
    arr[i] = depotFirst()
  }
  // Put second char of depot at the beginning (regulary 'b')
  arr.unshift(depotSecond())
  return arr
}


/**
 * Sets last id to it's inital value (default = 'aaa')
 * or to a given string.
 *
 * @param {string} id (optional)
 * @return nothing
*/
const reset = function(id){
  if( typeof id !== 'undefined' ){
    return setLast(id)
  }
  last = inital
  return true
}


/**
 * Returns next char after given char.
 *
 * @param {string} char
 * @param {number} n - index if current char in id
 * @return string next char
 * @private
*/
function getNext(char, n){
  let index = depot().indexOf(char)
  let ip = index + 1
  let next = depotSplit()[ip]
  if(typeof next !== 'undefined' ){
    if( n === 0 && !isNaN(parseInt(next)) ){
      // We're dealing with the first position
      // of id. There are no numbers allowed
      // Return false
      return false
    }
    return next
  }
  return false
}


/**
 * Returns last generated id.
 *
 * @param none
 * @return {string} id
 */
const getLast = function(){
  return last
}


/**
 * Returns true when given id exists.
 *
 * @param {string} id
 * @return {boolean}
 */
const exists = function(id){
  if( toNumber(id) <= toNumber(last) ){
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

/*
@todo
exports.toString = function(number){
  number = number.split('')
  let id = ''
  let carry = 0
  let dl = depotLength()
  let placeValue = 0
  let char
  for(let i=number.length-1; i === 0; i--){

    //number+= depotCharIndex(id[i]) * Math.pow(dl, placeValue)
    {char, carry} = charAtnTimesDepotLength(placeValue, number[i], carry)
    id+= char
    placeValue++
  }
  return Math.round(number)
}

function fillZero(value, n){
  value = String(value)
  for(let i=0; i<n; i++){
    value+='0'
  }
  return parseInt(value)
}

function charAtnTimesDepotLength(placeValue, number, carry){
  let baseNumber = number
  number = (number + carry) * fillZero(1, placeValue)
  let maxDepotLength = Math.pow(depotLength(), placeValue)

  // Drei Möglichkeiten
  // a) number < lepotLength
  // b) number < maxDepotLength
  // c) number > maxDepotLength
  if( number <=  depotLength() ){
    // number < lepotLength
    return depotCharIndex(number)
  }
  if( number <=  maxDepotLength ){
    // number < maxDepotLength
    return depotCharIndex(baseNumber)
    // 2000 / 10 = 200 Durchläufe beginnend ab 2 -> b
    // 2245 / 10 = 224.5 Durchläufe beginnend ab 2 -> b
  }
  // number > maxDepotLength

  let pos = number *
  if( pos <= depotLength() ){
    return {
      char: depotCharIndex(pos),
      carry: 0
    }
  }

}
*/


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
 * (Checks if given chars of id are part or depot chars).
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
* Returns depot chars.
*
* @param none
* @return {string} depot chars
* @private
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
  setDepot,
  make,
  reset,
  getLast,
  exists,
  toNumber,
  valid,
  depot,
  setErrorHandler
}
