/**
 * 判断是否为空
 * @param {any} value
 * @returns {boolean} 是否为空
 */
export function isEmpty(value: any): boolean {
  return (
    value === undefined
    || value === null
    || (typeof value === 'string' && value.trim() === '')
    || (Array.isArray(value) && value.length === 0)
    || (typeof value === 'object' && Object.keys(value).length === 0)
  )
}
