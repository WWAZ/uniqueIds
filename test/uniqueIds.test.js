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

test('id("abc") should be equal to 54 ', () => {
  expect(uniqueIds.toNumber('abc')).toEqual(54)
})

test('Resetting after setting inital should equal to inital value', () => {
  uniqueIds.setInitial('aZZ')
  uniqueIds.reset()
  expect(uniqueIds.getLast()).toEqual('aZZ')
})
