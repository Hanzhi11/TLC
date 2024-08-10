import bin from './assets/bin.svg'
import lightning from './assets/lightning.svg'
import './App.css'
import Numbers from './components/Numbers'

function App() {
  const index = 1
  return (
    <div>
        <div>{index}</div>
        <Numbers />
        <div>
          <button className='selectButton'>
            <img src={lightning} className="select" alt="Select Icon" />
  </button>
          <button className='clearButton'><img src={bin} className="clear" alt="Clear Icon" />
  </button>
        </div>
    </div>
  )
}

export default App
