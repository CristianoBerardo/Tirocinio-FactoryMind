console.log("Exercise 2:\n");

export interface ICustomMap<T> {
  addingNumber(int: T): Array<T>;
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
}

const array = [1, 2, 3, 4, 5];

const customMap = new CustomMap(array);

console.log(customMap.addingNumber(5));
