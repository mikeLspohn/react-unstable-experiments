/*
 * Simple `fetch` api call using the pokemon graphql api
 * with a stringified graphql query sent over the wire
 */
function fetchPokemon(name: string) {
  const pokemonQuery = `
        query ($name: String) {
          pokemon(name: $name) {
            id
            number
            name
            attacks {
              fast {
                name
                type
                damage
              }
              special {
                name
                type
                damage
              }
            }
          }
        }
      `
  return window
    .fetch("https://graphql-pokemon.now.sh", {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({
        query: pokemonQuery,
        variables: { name }
      })
    })
    .then(r => r.json())
    .then(response => response.data.pokemon)
}

export default fetchPokemon
