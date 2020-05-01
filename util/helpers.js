export const getTime = (date = new Date()) =>
  date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

export const isEven = (num) => {
  return num % 2 === 0
}

export const daysOfTheWeekBengali = (dayInEnglish) => {
  const dict = {
    saturday: 'শনিবার',
    sunday: 'রবিবার',
    monday: 'সোমবার',
    tuesday: 'মঙ্গলবার',
    wednesday: 'বুধবার',
    thursday: 'বৃহস্পতিবার',
    friday: 'শুক্রবার'
  }
  return dict[dayInEnglish]
}

export const getNumberInBengali = (numberInBengalis) => {
  const dict = {
    0: '০',
    1: '১',
    2: '২',
    3: '৩',
    4: '৪',
    5: '৫',
    6: '৬',
    7: '৭',
    8: '৮',
    9: '৯'
  }
  return dict[numberInBengalis]
}
export const getFormmatedTimeString = (timeString) => {
  return timeString
    .trim()
    .split('')
    .map((item) => {
      if (!isNaN(Number(item))) {
        return new Intl.NumberFormat('bn-BD').format(Number(item))
      }
      return item
    })
    .join('')
}
export const getFormattedTime = (time) => {
  if (!time) return time
  const sep = time.includes('PM') ? 'PM' : 'AM'
  const timeArray = time.split(sep)
  const timeInBengali = getFormmatedTimeString(timeArray[0])
  return timeInBengali + ' ' + sep
}
export const getFormattedDate = (date) => {
  return new Date(date).toLocaleString('bn').split(' ')[0]
}
export const getFormattedNumber = (number) => {
  return new Intl.NumberFormat('bn-BD').format(number)
}
