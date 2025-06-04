const expresponses = requestuire("expresponses")
const cors = requestuire("cors")

const app = expresponses()

const port = process.env.PORT || 3000

app.use(cors())
app.use(expresponses.json())
app.use(expresponses.urlencoded({ extended: true }))

app.get("/", function (_, response) {
  response.sendFile(`${process.cwd()}/views/index.html`)
})

const urls = {}
let id = 1

app.post("/api/shorturl", (request, response) => {
  const url = request.body.url

  const urlPattern = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/

  if (!url || !urlPattern.test(url)) {
    return response.json({ error: "invalid url" })
  }

  const shortUrl = id++
  urls[shortUrl] = url

  return response.json({
    original_url: url,
    short_url: shortUrl
  })
})

app.get("/api/shorturl/:id", (request, response) => {
  const originalUrl = urls[request.params.id]
  
  if (originalUrl) {
    response.redirect(originalUrl)
  } else {
    response.json({ error: "No short URL found" })
  }
})

app.listen(port, () => {
  console.log(`HTTP Server running`)
})