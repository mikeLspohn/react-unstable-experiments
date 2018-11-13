import React from "react"
import { unstable_createResource as createResource } from "react-cache"
import fetchPokemon from "./fetchPokemon"

// New experimental async rendering data fetcher!
const myPokemon = createResource(fetchPokemon)

interface PokeListProps {
  search: string
}

export default function PokeList({ search }: PokeListProps) {
  // call to resource.read `throws` a promise and `Suspend`s rendering until it resolves
  // then renders the return below
  const pokemon = myPokemon.read(search)
  return <span>{JSON.stringify(pokemon || "Unknown", null, 2)}</span>
}
