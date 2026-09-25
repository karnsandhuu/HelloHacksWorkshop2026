import { useState } from 'react'

const pokemonTypes = [
  { name: 'Fire', style: 'border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100' },
  { name: 'Water', style: 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100' },
  { name: 'Grass', style: 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100' },
  { name: 'Ground', style: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100' },
]

function App() {
  const [selectedType, setSelectedType] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function getMatchup(type) {
    try {
      const response = await fetch(
        `http://localhost:5001/api/type/${encodeURIComponent(type.toLowerCase())}`,
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load matchup.')
      }

      return data
    } catch (error) {
      return { error: error.message || 'Unable to connect to the server.' }
    }
  }

  async function handleTypeClick(type) {
    setIsLoading(true)
    setSelectedType('Loading…')
    const response = await getMatchup(type)
    if (response.error) {
      setSelectedType(response.error)
    } else {
      const formatTypes = (types) => types
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join(', ')

      const attackAdvice = response.double_damage_from.length
        ? `Attack with ${formatTypes(response.double_damage_from)}-type moves to deal 2× damage.`
        : 'No move types deal 2× damage against this type.'
      const defenseAdvice = response.half_damage_to.length
        ? `${formatTypes(response.half_damage_to)}-type Pokémon take ½ damage from ${type}-type moves.`
        : `No Pokémon types take ½ damage from ${type}-type moves.`

      setSelectedType(
        `Facing a ${type}-type Pokémon\n\n${attackAdvice}\n\n${defenseAdvice}\n\nThese matchups consider one type only. A second type or an ability can change the damage.`,
      )
    }
    setIsLoading(false)
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-stone-100 px-5 py-12 font-sans text-slate-900">
      <section aria-labelledby="battle-title" className="w-full max-w-lg overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="h-2 bg-red-500" />
        <div className="p-6 sm:p-10">
          <div aria-hidden="true" className="relative mb-6 size-12 overflow-hidden rounded-full border-2 border-slate-900 bg-white">
            <div className="h-1/2 border-b-2 border-slate-900 bg-red-500" />
            <div className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-900 bg-white" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-red-600">Trainer toolkit</p>
          <h1 id="battle-title" className="text-3xl font-bold tracking-tight sm:text-4xl">Pokémon Battle Assistant</h1>
          <p id="type-prompt" className="mt-4 text-base text-slate-600">What type of Pokémon are you fighting?</p>
          <div role="group" aria-labelledby="type-prompt" className="mt-6 grid grid-cols-2 gap-3">
            {pokemonTypes.map(({ name, style }) => (
              <button key={name} type="button" disabled={isLoading} onClick={() => handleTypeClick(name)} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 disabled:cursor-wait disabled:opacity-60 ${style}`}>
                {name}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mt-4 whitespace-pre-line break-words text-slate-600">{selectedType}</p>
        </div>
      </section>
    </main>
  )
}

export default App
