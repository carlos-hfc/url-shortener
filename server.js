const express = require("express")
const cors = require("cors")

const app = express()

const port = process.env.PORT || 3333

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = []
let id = 1

app.post("/api/shorturl", (request, response) => {
  const url = request.body.url

  const urlPattern = /^https?:\/\/(www\.)?[a-zA-Z0-9-]/

  if (!url || !urlPattern.test(url)) {
    return response.json({ error: "invalid url" })
  }

  const data = {
    original_url: url,
    short_url: id++
  }

  db.push(data)

  return response.json(data)
})

app.get("/api/shorturl/:id", (request, response) => {
  const item = db.find(item => item.short_url === Number(request.params.id))

  if (item) {
    response.redirect(item.original_url)
  } else {
    response.json({ error: "No short URL found" })
  }
})

app.listen(port, () => {
  console.log(`HTTP Server running`)
})