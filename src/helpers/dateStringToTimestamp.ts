export default function dateStringToTimestamp(dateString: string) {
  const date = new Date(dateString)
  return date.getTime()
}
