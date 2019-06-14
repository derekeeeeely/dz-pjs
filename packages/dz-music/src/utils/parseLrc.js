
export default function parse(text) {
  const lines = text.split('\n')
  const pattern = /\[\d{2}:\d{2}.\d*\]/g
  const lyrics = []
  lines.map(line => {
    const timeLines = line.match(pattern)
    const lyricLine = line.replace(pattern, "")
    if(timeLines && timeLines.length) {
      for (let i=0; i<timeLines.length; i++) {
        const timeLine = timeLines[i]
        const min = timeLine.replace(/(\[|\:|\]|\.)/g, "").slice(0, 2)
        const sec = timeLine.replace(/(\[|\:|\]|\.)/g, "").slice(2, 4)
        const seconds = (+min) * 60 + (+sec)
        lyrics.push({
          [seconds]: lyricLine || '......'
        })
      }
    }
  })
  lyrics.sort((a, b) => {
    const keyA = +Object.keys(a)[0]
    const keyB = +Object.keys(b)[0]
    return keyA - keyB
  })
  return lyrics
}
