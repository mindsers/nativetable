export class FilterUtils {
  /**
  * Closure
  * AND logical condition
  *
  * @param {Object[]} items - array of boolean value
  * @returns {boolean}
  */
  static applyAndCondition(items) {
    let condition = true
    for (let item of items) {
      condition = condition && item
    }

    return condition
  }

  /**
   * Closure
   * OR logical condition
   *
   * @param {Object[]} items - array of boolean value
   * @returns {boolean}
   */
  static applyOrCondition(items) {
    let condition = false
    for (let item of items) {
      condition = condition || item
    }

    return condition
  }

  /**
   * Closure
   * Calculate conditionnal result for one columns
   *
   * @param {Object} item - item to test
   * @param {function|any[]} - array of value to match or a closure for custom condition
   *
   * @return {boolean}
   */
  static applyCustomCondition(item, condition) {
    if (typeof condition === 'function') { // custom condition
      let closure = condition
      let result = closure(item)
      if (typeof result === 'boolean') {
        return result
      }

      return false // bad return type of closure
    }

    let column = []
    for (let value of condition) { // normal condition
      column.push(item === value)
    }

    return FilterUtils.applyOrCondition(column)
  }
}
