const puppeteer = require('puppeteer');

const fb = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://www.derekz.cn')
  const title = await page.title()
  console.log(title)
  await browser.close()
}

const bing = async (pages) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.setViewport({ width: 1920, height: 1080 });
  const imgList = []
  for (let i = 0; i < pages; i++) {
    await page.goto(`https://bing.ioliu.cn/?p=${i}`)
    const singlePage = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('a.mark'))
      return imgs.map(e => e.href.replace(/https:\/\/bing.ioliu.cn\/photo/, 'http://h1.ioliu.cn/bing/').replace(/\?force=home_\d/, '_1920x1080.jpg'))
    })
    for (let j = 0; j < singlePage.length; j++) {
      await page.goto(singlePage[j])
      await page.screenshot({ path: `bing/bing_${i}_${j}.jpg` });
    }
  }
  console.log('done')
  await browser.close()
}

const IEEE = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://ieeexplore.ieee.org/search/searchresult.jsp?queryText=speech%20recognition&sortType=desc_p_Publication_Year')
  const papers = await page.evaluate(() => {
    const paper = Array.from(document.querySelectorAll('a.icon-pdf.ng-scope'))
    return paper.map(e => e.href)
  })
  for (let i = 0; i < papers.length; i++) {
    await page.goto(papers[i])
    await page.pdf({ path: `paper/speech_recognition_${i}.pdf`, format: 'A4' })
  }
  console.log('done')
  await browser.close()
}

// fb()
// bing(1)
IEEE()
