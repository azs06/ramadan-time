export const getTime = (date = new Date()) =>
  date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

export const isEven = (num) => {
  return num % 2 === 0
}
