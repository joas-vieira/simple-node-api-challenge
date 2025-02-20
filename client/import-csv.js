import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = new URL('./tasks.csv', import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  fromLine: 2,
})

async function readCSV() {
  const lines = stream.pipe(csvParse)

  for await (const record of lines) {
    const [title, description] = record

    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, description })
    })
  }
}

readCSV()


