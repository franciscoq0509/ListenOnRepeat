export const checkNextProps = (nextProps, props, property) => {
  if (nextProps[property] && !nextProps[property].isFetching && props[property].isFetching != nextProps[property].isFetching) {
    if (nextProps[property].response) {
      return true  
    } else {
      return 'empty'
    }
  }
  return false
}

export const getDuration = (str) => {
  const reg = "^PT(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?$"
  const match = str.match(reg)
  const hr = match[1]
  const min = match[2]
  const sec = match[3]
  let duration = 0
  if (hr) duration += parseInt(hr) * 60 * 60
  if (min) duration += parseInt(min) * 60
  if (sec) duration += parseInt(sec)
  return duration * 1000
}

export const secondsToTime = (sec) => {
  const sec_num = parseInt(sec, 10)/1000; 
  let hours   = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) { seconds = "0" + seconds; }
  if (hours && hours != '00') {
    return hours+':'+minutes+':'+seconds;
  }
  return minutes+':'+seconds;
}