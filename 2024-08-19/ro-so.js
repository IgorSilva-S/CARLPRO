//Rest operator and Spread operator

const sum = (...values) => {
    return values.reduce((accumulator, actualValue) => accumulator + actualValue, 0)
}

console.log(sum(1, 2, 3))

console.log(sum([1, 2, 3]))
console.log(sum(...[1, 2, 3]))

const myArray = [1, 2, 3, 4, 5]
console.log(sum(myArray))
console.log(sum(...myArray))