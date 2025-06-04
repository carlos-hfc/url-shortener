const dns = require("node:dns")
const express = require("express")
const cors = require("cors")
const urlParser = require("url")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

let db = []
let id = 1

app.post("/api/shorturl", async (request, response) => {
  console.log(request.body)
  const url = request.body.url
  const domain = urlParser.parse(url)

  dns.lookup(domain.hostname, async (err) => {
    if (err || !/^https?:\/\//.test) return response.json({ error: "invalid url" })

    const data = {
      original_url: url,
      short_url: id++
    }

    db.push(data)

    return response.json(data)
  })
})

app.get("/api/shorturl/:shortUrl", async (request, response) => {
  const { shortUrl } = request.params

  const url = db.find(item => item.short_url === Number(shortUrl))

  if (!url) return response.json({ error: "No short URL found for the given input" })

  return response.redirect(url.original_url)
})

app.listen(process.env.PORT || 3333, () => {
  console.log("HTTP Server running")
})
