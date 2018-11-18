import React, { useReducer, useEffect } from "react"
import { unstable_createResource as createResource } from "react-cache"
import fetchPokemon from "./fetchPokemon"

// New experimental async rendering data fetcher!
const myPokemon = createResource(fetchPokemon)

interface PokeListProps {
  search: string
}

interface PokemonAttack {
  name: string
  type: string
  damage: string
}

interface PokemonAttacks {
  special: Array<PokemonAttack>
  fast: Array<PokemonAttack>
}

interface Pokemon {
  id: number
  number: number
  name: string
  attacks: PokemonAttacks
}

type actionType = "ADD_POKEMON" | "POKEMON_NOT_FOUND"

interface action {
  type: actionType
  payload?: Pokemon
}

type reducerState<T> = {
  pokemon: Array<T>
  error: string
}

const initialState: reducerState<Pokemon> = { pokemon: [], error: "" }

const pokemonReducer = (
  state = initialState,
  { type, payload }: action
): reducerState<Pokemon> => {
  switch (type) {
    case "ADD_POKEMON":
      return payload
        ? { ...state, pokemon: [...state.pokemon, payload], error: "" }
        : state
    case "POKEMON_NOT_FOUND":
      return { ...state, error: "Pokemon not found" }
    default:
      throw Error("Bad action provided to pokemonReducer")
  }
}

export default function PokeList({ search }: PokeListProps) {
  // call to resource.read `throws` a promise and `Suspend`s rendering until it resolves
  // then renders the return below
  const [pokemonList, dispatch] = useReducer(pokemonReducer, initialState)
  const pokemonFromSearch = myPokemon.read(search)

  useEffect(
    () => {
      console.log("useEffect hook fired")
      if (
        pokemonFromSearch &&
        !pokemonList.pokemon.find(
          pokemon => pokemon.id === pokemonFromSearch.id
        )
      ) {
        console.log("add pokemon fired")
        dispatch({ type: "ADD_POKEMON", payload: pokemonFromSearch })
      } else {
        console.log("pokemon not found fired")
        dispatch({ type: "POKEMON_NOT_FOUND" })
      }
    },
    [pokemonFromSearch]
  )

  return (
    <>
      {pokemonList.error && <h1>{pokemonList.error}</h1>}
      {pokemonList.pokemon.map(pokeman => (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "20px",
            margin: "20px auto",
            width: "50%"
          }}
        >
          <h1>{pokeman.name}</h1>
          <p>{pokeman.number}</p>
          <h3>Attacks:</h3>

          <p>
            <strong>Fast</strong>
          </p>
          {pokeman.attacks.fast.map(attack => (
            <p>
              {attack.name} {attack.type} {attack.damage}
            </p>
          ))}

          <p>
            <strong>Special</strong>
          </p>
          {pokeman.attacks.special.map(attack => (
            <p>
              {attack.name} {attack.type} {attack.damage}
            </p>
          ))}
        </div>
      ))}
    </>
  )
}
