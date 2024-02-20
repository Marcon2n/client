import { useEffect, useState } from 'react'
import InputValueComponent from './components/inputValue.component'
import Navbar from './components/navbar'
import keycloak from './keycloak/keycloak'

import './App.css'

async function getKey (token: string) {
  const options = {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
  }
  const response = await fetch('http://localhost:9000/key',options)
  const key = await response.json()
  return key
}

function App() {
  const [auth, setAuth] = useState(false)

  if(!auth) {
    keycloak.init({
      onLoad: 'login-required'
    }).then(
      auth => {
        if(auth) {
          setAuth(true)
        }
      }
    )
  }

  useEffect(()=>{
    if(!auth) return
    getKey(keycloak.token)
  },[auth])

  return (
    <>
    {auth?<div className='flex flex-col w-full'>
      <Navbar/>
      <div className='flex grow'>
        <InputValueComponent/>
      </div>
    </div>:null}
    </>
  )
}

export default App
