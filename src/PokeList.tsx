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
//
// The awesome thing about typescript wtih reducers
// is there's no chance of missing a `case` in a switch
// over these types, and you can be confident your reducer
// can't be called with improper action types and that it will
// always return the correct state shape
// Besides actual logic (math, reordering so on) everything is really
// safe with the type checking and it elminates a lot of need for
// simple tests like testing that an actionCreator returns a valid action type
type actionType = "ADD_POKEMON" | "POKEMON_NOT_FOUND"

interface action {
  type: actionType
  payload?: Pokemon
}

type reducerState<T> = {
  pokemon: Array<T>
  error: string
}

// New experimental async rendering data fetcher!
const myPokemon = createResource(fetchPokemon)
const initialState: reducerState<Pokemon> = { pokemon: [], error: "" }

// The real advantages of the `reducer` pattern really come out with
// static typing in place. We can have much more assurance that we have a pure
// data-in data-out function that always yields predicatable results.
// And we can also feel more secure in our own ability to not mess up when dispatch an
// action name "ADD_NEW_ITEM_TO_COMPENSABLE_DUTY" (and elminates the need to set those up as constants)
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
      // if our search fetched a pokemon successfully
      // and the pokemon is not already in our list then dispatch addPokemon
      // otherwise set the error state to show a not found message
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
    // 2nd param to useEffect is what tells it when it should refire
    // so whenever pokemonFromSearch changes, this code should refire on that render
    [pokemonFromSearch]
  )

  // with `pokemonList` being typed (return type from reducer function) we can
  // be sure that nothing in render should ever fail because of trying to access
  // a property of `undefined` (cannot call length of undefined)
  // and if the data shape for `Pokemon` ever changes, it will be easy to spot
  // what and where exactly in the UI that props need to be updated accordingly so that could
  // never be something that simply got looked over
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
