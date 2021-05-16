/**
 * In place shuffles the array of any elements type with Fisher-Yates algorithm
 * @param {*[]} elements array of elements of any type
 */
export function shuffle(elements) {
  for (let i = elements.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * i);
    [elements[i], elements[j]] = [elements[j], elements[i]];
  }
}

/**
 * Combinations with repetition of elements of any type
 * https://en.wikipedia.org/wiki/Combination
 * @param {*[]} elements array of possible element values
 * @param {number} taking number of elements in combinations
 * @return {*[]} all possible combinations of the array elements
 */
export function combinationsWithRepetition(elements, taking) {
  if (taking <= 0 || elements.length <= 0) {
    return [];
  }
  if (taking === 1) {
    return elements.map((e) => [e]);
  }
  let combinations = [];
  let reducedElements = elements;
  elements.forEach((element) => {
    combinations = combinations.concat(
      combinationsWithRepetition(reducedElements, taking - 1).map((e) =>
        [element].concat(e),
      ),
    );
    reducedElements = reducedElements.slice(1);
  });
  return combinations;
}
