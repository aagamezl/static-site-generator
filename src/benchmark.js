const iterations = parseInt(process.argv[2], 10)
const array = new Array(iterations);

// for
console.log('for');
console.time('Execution Time');
for (let i = 0; i < array.length; i++) {
  array[i];
}
console.timeEnd('Execution Time');

// for
console.log('\nfor with caching length');
console.time('Execution Time');
for (let i = 0, length = array.length; i < length; i++) {
  array[i];
}
console.timeEnd('Execution Time');

// forEach
console.log('\nforEach');
console.time('Execution Time');
array.forEach((i) => {
  array[i];
});
console.timeEnd('Execution Time');

// some
console.log('\nsome');
console.time('Execution Time');
array.some((i) => {
  array[i];
});
console.timeEnd('Execution Time');

// for of
console.log('\nfor of');
console.time('Execution Time');
for (let i of array) {
  array[i];
}
console.timeEnd('Execution Time');
