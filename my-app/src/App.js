import './App.css'
import { useEffect, useState } from 'react'

const PAGE_NUMBER = 1

function App() {
  const [state, setState] = useState([])
  const [page, setPage] = useState(PAGE_NUMBER)

  useEffect(() => {
    fetch(`https://api.instantwebtools.net/v1/passenger?page=${page}&size=5`)
      .then((res) => res.json())
      .then((json) => setState([...state, ...json.data]))
  })

  const scrollToEnd = () => {
    setPage(page + 1)
  }

  window.onscroll = function () {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      scrollToEnd()
    }
  }

  return (
    <div className="header">
      <form action="http://localhost:5000/logout" method="GET">
        <button>Logout</button>
      </form>
      <div className="App">
        {state.length > 0 &&
          state.map((el, i) => (
            <div key={i} className={'container'}>
              <h4>Id: {el._id}</h4>
              <h4>Name: {el.name}</h4>
              <h4>Trips: {el.trips}</h4>
            </div>
          ))}
      </div>
    </div>
  )
}

export default App
