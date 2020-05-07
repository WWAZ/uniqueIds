/**
 * Node test for mudule
 */
const uniqueIds = require('./src/uniqueIds')

// Sets inital id (length needs to be >= 3)
uniqueIds.setInitial('aZZ')

for(let i=0; i<10; i++){
  console.log(uniqueIds.make())
}
// Reset. Alternatively provide custom id
// uniqueIds.reset('ggg')
uniqueIds.reset()
console.log('---')

for(let i=0; i<10; i++){
  console.log(uniqueIds.make())
}
