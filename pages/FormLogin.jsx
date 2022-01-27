import React, { useState, useEffect } from 'react'

import { Button, TextField } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'

const FormLogin = ({ rol }) => {
  const url = '#'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [credencialsValid, setCredencialsValid] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // if (localStorage.getItem('user-info')) {
    // }
  }, [])

  const validarCorreo = (email) => {
    const expReg =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    const isValid = expReg.test(email)
    isValid ? setEmailValid(false) : setEmailValid(true)
    return isValid
  }

  const heartStyle = { color: 'red' }
  const inputStyle = { padding: '8px 0' }
  const buttonStyle = { backgroundColor: '#075c2c', padding: '5px 0', margin: '5px 0' }
  const textStyle = { color: 'red', fontSize: '14px' }

  const dataLogin = async () => {
    try {
      const item = { email, password }
      let direction = ''

      const Request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      }

      if (rol === 'Contador') direction = 'http://localhost:8000/auth/account'
      else direction = 'http://localhost:8000/auth/users'

      const emailIsValid = validarCorreo(email)

      if (emailIsValid) {
        localStorage.removeItem('user-info')
        const result = await fetch(direction, Request)
        // .then((res) => {
        //   if (!response.ok) {
        //   throw new Error('Network response was not OK');
        // }
        // })
        // .catch((err) => {
        //   // setError(true)
        //   console.log('error dentro del fetch 2 ', err)
        //   return { status: 'false' }
        // })
        // .finally(() => setLoading(true))

        const res = await result.json()
        console.log('este es el res', res)
        if (res.status) {
          setCredencialsValid(false)
          console.log('se creo el token y se almaceno')
          localStorage.setItem('user-info', JSON.stringify(res.token))
        } else {
          setCredencialsValid(true)
        }
      }
    } catch (err) {
      setError(true)
      console.log('error en login ', err)
    }
  }

  if (error) {
    return <div className='pass'>Error al obtener los datos. Favor de recargar la página</div>
  }

  if (loading) return <>Please wait a moment...</>
  return (
    <>
      <span className='remember'>
        {credencialsValid && <div style={textStyle}>El usuario o contraseña son incorrectos</div>}
        {emailValid && <div style={textStyle}>Los datos son incorrectos</div>}
      </span>
      <TextField
        label='Email'
        placeholder='Ingrese Email'
        color='secondary'
        required
        fullWidth
        style={inputStyle}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label='Password'
        placeholder='Ingrese Password'
        color='secondary'
        type='password'
        required
        fullWidth
        style={inputStyle}
        onChange={(e) => setPassword(e.target.value)}
      />

      <FormControlLabel
        style={inputStyle}
        control={
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite style={heartStyle} />}
          />
        }
        label='Recordar Usuario'
      />

      <Button
        type='submit'
        style={buttonStyle}
        variant='contained'
        fullWidth
        onClick={dataLogin}
      >
        Ingresar
      </Button>
      <div className='remember'>
        <a className='pass' href={url}>¿Olvidaste la contraseña?</a>
        <div className='pass'>¿No tienes cuenta?<a href={url}>Registrate</a></div>
      </div>

    </>
  )
}

export default FormLogin
