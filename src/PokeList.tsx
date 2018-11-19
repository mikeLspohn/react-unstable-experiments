import React, { useReducer, useEffect } from "react"
import { unstable_createResource as createResource } from "react-cache"
import fetchPokemon from "./fetchPokemon"

// Component Interfaces
interface PokeListProps {
  search: string
}

// Pokemon Interfaces (you can see how you can build up composable interfaces)
interface Pokemon {
  id: number
  number: number
  name: string
  attacks: PokemonAttacks
}

interface PokemonAttacks {
  special: Array<PokemonAttack>
  fast: Array<PokemonAttack>
}

interface PokemonAttack {
  name: string
  type: string
  damage: string
}

// Reducer Interfaces
type actionType = "ADD_POKEMON" | "POKEMON_NOT_FOUND"

interface action {
  type: actionType
  payload?: Pokemon
}

type reducerState<T> = {
  pokemon: Array<T>
  error: string
}

const myPokemon = createResource(fetchPokemon)
const initialState: reducerState<Pokemon> = { pokemon: [], error: "" }

type objWithKey<T> = { [key: string]: T }
const updateIn = (key: string, obj: objWithKey<any>, value: object) => {
  return { ...obj, [key]: { ...obj[key], ...value } }
}

const user = {
  id: 1,
  employee: {
    firstName: "john",
    lastName: "jonson"
  }
}
console.log(updateIn("employee", user, { firstName: "joey" }))

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
  const [pokemonList, dispatch] = useReducer(pokemonReducer, initialState)
  const pokemonFromSearch = myPokemon.read(search)

  useEffect(
    () => {
      if (
        pokemonFromSearch &&
        !pokemonList.pokemon.find(
          pokemon => pokemon.id === pokemonFromSearch.id
        )
      ) {
        dispatch({ type: "ADD_POKEMON", payload: pokemonFromSearch })
      } else {
        dispatch({ type: "POKEMON_NOT_FOUND" })
      }
    },
    [pokemonFromSearch]
  )

  return (
    <>
      {pokemonList.error && (
        <h1 style={{ textAlign: "center" }}>{pokemonList.error}</h1>
      )}
      {pokemonList.pokemon.map(pokeman => (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "20px",
            width: "70%",
            margin: "20px auto 40px auto",
            overflow: "hidden"
          }}
        >
          <h1>
            {pokeman.name}{" "}
            <span style={{ fontSize: "14px" }}>{pokeman.number}</span>
          </h1>
          <h3>Attacks:</h3>

          <div>
            <p>
              <strong>Fast</strong>
            </p>
            <table
              style={{
                border: "1px solid black",
                padding: "4px",
                textAlign: "center",
                width: "100%"
              }}
            >
              <thead>
                <th>name</th>
                <th>type</th>
                <th>damage</th>
              </thead>
              {pokeman.attacks.fast.map((attack, i) => (
                <tr key={i}>
                  <td style={{ width: "33%" }}>{attack.name}</td>
                  <td style={{ width: "33%" }}>{attack.type}</td>
                  <td style={{ width: "33%" }}>{attack.damage}</td>
                </tr>
              ))}
            </table>
          </div>

          <div>
            <p>
              <strong>Special</strong>
            </p>
            <table
              style={{
                border: "1px solid black",
                padding: "4px",
                textAlign: "center",
                width: "100%"
              }}
            >
              <thead>
                <th>name</th>
                <th>type</th>
                <th>damage</th>
              </thead>
              {pokeman.attacks.special.map((attack, i) => (
                <tr key={i}>
                  <td style={{ width: "33%" }}>{attack.name}</td>
                  <td style={{ width: "33%" }}>{attack.type}</td>
                  <td style={{ width: "33%" }}>{attack.damage}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      ))}
    </>
  )
}
