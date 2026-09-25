import { useState } from 'react'

const pokemonTypes = [
  { name: 'Fire', style: 'border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100' },
  { name: 'Water', style: 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100' },
  { name: 'Grass', style: 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100' },
  { name: 'Ground', style: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100' },
]

function App() {
  const [selectedType, setSelectedType] = useState('')

function getMatchup(type) {
  // API CALL WILL GO HERE, AND WE WILL RETURN THE RESPONSE
  return `Fake API response: You are fighting a ${type}-type Pokémon.`;
}

function handleTypeClick(type) {
  const response = getMatchup(type);
  setSelectedType(response);
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
              <button key={name} type="button" onClick={() => handleTypeClick(type.name)} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 ${style}`}>
                {name}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mt-4 text-slate-600">{selectedType}</p>
        </div>
      </section>
    </main>
  )
}

export default App
