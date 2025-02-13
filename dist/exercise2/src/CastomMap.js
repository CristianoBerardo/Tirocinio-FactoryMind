"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMap = void 0;
console.log("Exercise 2:\n");
class CustomMap {
    constructor(array) {
        this.array = array;
    }
    addingNumber(int) {
        const arrayCopy = [];
        for (const element of this.array) {
            arrayCopy.push(element + int);
        }
        return arrayCopy;
    }
    subtractingNumber(int) {
        const arrayCopy = [];
        for (const element of this.array) {
            arrayCopy.push(element + int);
        }
        return arrayCopy;
    }
    customMap(a, f) {
        const arrayCopy = [];
        for (let i = 0; i < a.length; i++) {
            arrayCopy.push(f(a[i]));
        }
        return arrayCopy;
    }
}
exports.CustomMap = CustomMap;
const array = [1, 2, 3, 4, 5];
const customMap = new CustomMap(array);
console.log(`customMap.addingNumber(5) : ${customMap.addingNumber(5)}`);
console.log(`customMap.customMap(array, (x) => x + 5): ${customMap.customMap(array, (x) => x + 5)}`);
//# sourceMappingURL=CastomMap.js.map