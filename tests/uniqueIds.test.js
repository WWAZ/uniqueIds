/**
 * Node test for mudule
 */
const uniqueIds = require('../index')

test('Should create a new id aaa', () => {
  expect(uniqueIds.make()).toEqual('aaa')
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
  expect(uniqueIds.lastId()).toEqual(false)
})

test('toNumber("abc") should be equal to number 54', () => {
  expect(uniqueIds.toNumber('abc')).toEqual(54)
})

test('toNumber(123) should throw error', () => {
  let e = () => {
    // No string privided
    uniqueIds.toNumber(123)
  };
  expect(e).toThrow(TypeError)
})

test('toString(0) should be equal to id "aaa"', () => {
  expect(uniqueIds.toString(0)).toEqual('aaa')
})

test('toString(97624343827398128999) should be equal to id ",!$!.//$§)=+,(/,,,"', () => {
  // Save depot
  let depot = uniqueIds.depot()
  // Set new depot
  uniqueIds.setDepot(',.-#+?=)(/&%$§!')
  // Make tests
  expect(uniqueIds.toString(97624343827398128999)).toEqual(',!$!.//$§)=+,(/,,,')
  expect(uniqueIds.toNumber(',!$!.//$§)=+,(/,,,')).toEqual(97624343827398128999)
  // Restore depot for further testings
  uniqueIds.setDepot(depot)
})

test('toString("a") should throw error', () => {
  let e = () => {
    // No number privided
    uniqueIds.toString('a')
  };
  expect(e).toThrow(TypeError)
})

test('toString(-2) should throw error', () => {
  let e = () => {
    // Negative number provided
    uniqueIds.toString(-2)
  };
  expect(e).toThrow(TypeError)
})

test('Create 5000 ids in a for loop - toNumber(id) should equal i', () => {
  let id
  uniqueIds.reset()
  for(let i=0; i < 5000; i++){
    id = uniqueIds.make()
    expect(uniqueIds.toNumber(id)).toEqual(i)
  }
})

test('setInitial("aZZ"): Resetting after setting inital id string should equal inital value', () => {
  uniqueIds.setInitial('aZZ')
  // Last id is false - none was set yet.
  expect(uniqueIds.lastId()).toEqual(false) // aZY
  // First id is as set 'aZZ'
  expect(uniqueIds.make()).toEqual('aZZ')
  // Next id is 'baa'
  expect(uniqueIds.make()).toEqual('baa')
})

test('setInitial(1): Resetting after setting inital numeric value should equal inital value', () => {
  uniqueIds.setInitial(0)
  // Last id is false - none was set yet.
  expect(uniqueIds.lastId()).toEqual(false)
  // First id is as set 'aaa'
  expect(uniqueIds.make()).toEqual('aaa')
  // Next id is 'aab'
  expect(uniqueIds.make()).toEqual('aab')
})

test('exists(): Id "aaY" should exist after setting initial id to "aaZ" ', () => {
  uniqueIds.setInitial('aaZ')
  // 'aaY' exists, because it's smaller than 'aaZ'.
  // Admittedly, that's poor. but Currently, an algo for recording
  // taken id's is missing so long.
  expect(uniqueIds.exists('aaY')).toEqual(true)
})

test('Resetting depot with valid special characters ",.-#+?=)(/&%$§!" should work', () => {
  uniqueIds.setDepot(',.-#+?=)(/&%$§!')
  // Next id should be ,,,
  expect(uniqueIds.make()).toEqual(',,,')
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
