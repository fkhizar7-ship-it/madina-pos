import { useState } from 'react'
import './App.css'
import POSBilling from './component/POSBilling'

function App() {
  const [count, setCount] = useState(0)

  return (
 <>
 <POSBilling/>
 </>
  )
}

export default App
