const fs = require('fs').promises
const jsdom = require("jsdom")
const { JSDOM } = jsdom

function formatBook (data, book_num) {
  const dom = new JSDOM(data)
  const document = dom.window.document

  const book_name = document.querySelector('h1').textContent.trim()
  const book_abridged = book_name.slice(0,3)

  const parts = []

  for (const el of document.querySelectorAll('dt')) {
    if (el.textContent.length === 0) continue
    const [, chapter_num, verset_num] = el.textContent.match(/([0-9]+).([0-9]+)/)
    const verset = el.nextElementSibling.textContent.replace(/\n/g, ' ').trim()

    parts.push(`${book_name}\t${book_abridged}\t${book_num}\t${chapter_num}\t${verset_num}\t${verset}`)
  }
  return parts.join('\n')
}

async function run () {
  const books = await fs.readdir('books')
  const parts = []
  for (const bookFile of books) {
    const data = await fs.readFile(`books/${bookFile}`)
    const book_num = parseInt(bookFile.match(/^([0-9]+)/)[0], 10)
    parts.push(formatBook(data.toString(), book_num))
  }
  await fs.writeFile(`sgd.tsv`, parts.join('\n'))
}

run().catch(err => {
  console.error(err)
})

