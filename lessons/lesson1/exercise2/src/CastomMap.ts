console.log("Exercise 2:\n");

export interface ICustomMap<T> {
  customMap(a: T[], f: (x: number) => number): Array<T>;
}

export class CustomMap implements ICustomMap<number> {
  private array: number[];

  constructor(array: number[]) {
    this.array = array;
  }

  public addingNumber(int: number): number[] {
    const arrayCopy: number[] = [];

    for (const element of this.array) {
      arrayCopy.push(element + int);
    }

    return arrayCopy;
  }

  public subtractingNumber(int: number): number[] {
    const arrayCopy: number[] = [];

    for (const element of this.array) {
      arrayCopy.push(element + int);
    }

    return arrayCopy;
  }

  public customMap(a: number[], f: (x: number) => number): number[] {
    const arrayCopy: number[] = [];

    for (let i = 0; i < a.length; i++) {
      arrayCopy.push(f(a[i]));
    }

    return arrayCopy;
  }
}

const array = [1, 2, 3, 4, 5];

const customMap = new CustomMap(array);

console.log(`customMap.addingNumber(5) : ${customMap.addingNumber(5)}`);
console.log(
  `customMap.customMap(array, (x) => x + 5): ${customMap.customMap(
    array,
    (x) => x + 5
  )}`
);
