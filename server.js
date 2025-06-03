const dns = require("node:dns")
const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let db = []
let id = 1

app.post("/api/shorturl", async (request, response) => {
  const { url } = request.body

  try {
    const domain = new URL(url).hostname

    dns.lookup(domain, async (err) => {
      if (err) return response.json({ error: "invalid url" })

      const data = {
        original_url: url,
        short_url: id++
      }

      db.push(data)

      return response.json(data)
    })
  } catch (error) {
    return response.json({ error: "invalid url" })
  }
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
