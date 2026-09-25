const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const typeCache = new Map()

// Examples: /api/type/fire or /api/type/10
app.get('/api/type/:type', async (req, res) => {
  const type = req.params.type.trim().toLowerCase()

  if (!/^(\d+|[a-z]+(?:-[a-z]+)*)$/.test(type)) {
    return res.status(400).json({ error: 'Enter a valid type ID or name.' })
  }

  if (typeCache.has(type)) {
    return res.json(typeCache.get(type))
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}/`, {
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return res.status(response.status).json({
        error: response.status === 404 ? 'Pokémon type not found.' : 'PokéAPI request failed.',
      })
    }

    const data = await response.json()
    const result = {
      half_damage_to: data.damage_relations.half_damage_to.map(type => type.name),
      double_damage_from: data.damage_relations.double_damage_from.map(type => type.name),
    }

    typeCache.set(String(data.id), result)
    typeCache.set(data.name, result)
    return res.json(result)
  } catch (error) {
    const timedOut = error.name === 'TimeoutError'
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'PokéAPI request timed out.' : 'Unable to fetch Pokémon type data.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
