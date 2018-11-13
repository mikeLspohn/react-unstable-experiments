import React, { Suspense, Component, useState, useRef, useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"
import PositionForm from "./PositionForm"
import PokeList from "./PokeList"

function App() {
  /* Stateful function component with useState Hook! */
  const [pokeName, setPokeName] = useState("bulbasaur")
  const [searchTerm, setSearchTerm] = useState("")
  /*
   * Mutable variable references (instance variable)
   * can be used for anything you may use an instance variabe (this.something) for
   * In this case, a boolean value that we don't care to keep in state because it
   * only serves to update once.
   *
   * Can also be used as a `ref` to a Component of DOM node like `React.createRef` current does
   */

  let hasSearched = useRef(false)

  {
    /*
     *  Lifecylces condensed into one logical spot for
     *  side-effect code (e.g. componentDidMount/DidUpdate)
     */
  }
  useEffect(() => {
    if (!hasSearched.current) {
      setSearchTerm(pokeName)
      hasSearched.current = true
    }
  })

  return (
    <div className="App">
      <input
        name="pokeName"
        value={pokeName}
        onChange={e => setPokeName(e.target.value)}
      />
      <button onClick={() => setSearchTerm(pokeName)}>Search</button>

      <Suspense fallback={<h1>loading...</h1>}>
        {/* PokeList reads a react-cache resource (fetch api call)
         *   so we wrap this with `Suspense` and provide a fallback to render until the promise has resolved
         *
         *   Under the hood, when react comes across a `createResource(somePromise).read` call inside
         *   a `render` function (function component) it `throw`s the `Promise` created by the resource
         *   I know, crazy right! in js `throw` technically just ends execution of any code after so in
         *   new React fiber with suspense, they throw the function and then let react-cache resolve the cache
         *   and show the fallback UI given to `Suspense` then renders the component
         *   once the promise is resolved.
         */}
        <PokeList search={searchTerm} />
      </Suspense>
    </div>
  )
}

export default App
