/**
 * Node test for mudule
 */
const uniqueIds = require('../index')

test('Should create a new id aaa', () => {
  expect(uniqueIds.make()).toEqual('aab')
})

test('Should accept "hjmM" as valid id', () => {
  expect(uniqueIds.valid("hjmM")).toEqual(true)
})

test('Should not accept "g6bM" as valid id', () => {
  // Contains number
  expect(uniqueIds.valid("g6bM")).toEqual(false)
})

test('Should not accept "gg;" as valid id', () => {
  // Contains special char
  expect(uniqueIds.valid("gg;")).toEqual(false)
})

test('Should not accept "gg" as valid id', () => {
  // Is too short
  expect(uniqueIds.valid("gg")).toEqual(false)
})

test('Should reset', () => {
  uniqueIds.reset()
  expect(uniqueIds.getLast()).toEqual('aaa')
})

test('id("abc") should be equal to 54', () => {
  expect(uniqueIds.toNumber('abc')).toEqual(54)
})

test('Create 5000 ids in a for loop - toNumber(id) should equal i', () => {
  let id
  for(let i=1; i < 5000; i++){
    id = uniqueIds.make()
    expect(uniqueIds.toNumber(id)).toEqual(i)
  }
})

test('Resetting after setting inital should equal to inital value', () => {
  uniqueIds.setInitial('aZZ')
  uniqueIds.reset()
  expect(uniqueIds.getLast()).toEqual('aZZ')
})

test('Resetting depot with valid characters should work', () => {
  uniqueIds.setDepot(',.-#+?=)(/&%$§!')
  // Next id should be ,,.
  expect(uniqueIds.make()).toEqual(',,.')
  // Id ',.#' should now be valid
  expect(uniqueIds.valid(",.#")).toEqual(true)
})

test('Resetting depot with too less characters should throw error', () => {

  let e = () => {
    // Too short
    uniqueIds.setDepot('aa')
  };
  expect(e).toThrow(TypeError)

})

test('Resetting depot with string containing at least one character twice should throw error', () => {

  let e = () => {
    // Char 'a' twice
    uniqueIds.setDepot('aabcd')
  };
  expect(e).toThrow(TypeError)

})

test('Resetting depot with string containing numbers should throw error', () => {

  let e = () => {
    // Contains numbers
    uniqueIds.setDepot('abcde2')
  };
  expect(e).toThrow(TypeError)

})


test('Resetting error handler should not throw Error, it should return a string', () => {

  uniqueIds.setErrorHandler((msg) => {
    return msg
  })

  expect(uniqueIds.setDepot('abcde2')).toEqual('Depot may not contain numbers.')

})
