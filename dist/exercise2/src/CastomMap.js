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
}
exports.CustomMap = CustomMap;
const array = [1, 2, 3, 4, 5];
const customMap = new CustomMap(array);
customMap.addingNumber(5);
console.log(customMap.addingNumber(5));
//# sourceMappingURL=CastomMap.js.map