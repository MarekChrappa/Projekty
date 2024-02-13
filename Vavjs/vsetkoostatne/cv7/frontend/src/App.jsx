import { response } from 'express'
import { useEffect, useRef } from 'react'
import { useState } from 'react'

import Home from './Home'

/**
 * @param {{ label: string, onclick: (...args?: any) => any }} props 
 */
const But = (props) => (
  <button style={{ padding: '10px' }} onClick={props.onclick}>{props?.label || '-'}</button>
)

/**
 * 
 * @param {{ src: string }} props 
 */
const Img = (props) => (
  <img style={{ height: '200px', width: '300px', objectFit: 'cover' }} src={props.src} />
)

const useImage = () => {
  const [image, setImage] = useState(null)
  const [imageId, setImageId] = useState(1)

  useEffect(() => {
    fetch(`http://localhost:8080/image?id=${imageId}`)
      .then((res) => res.json())
      .then((res) => {
        setImage(res)
      })
  }, [imageId])

  const next = () => setImageId(imageId + 1)
  const previous = () => setImageId(imageId - 1)

  return [image, previous, next]
}


const App = () => {
  const [image, previous, next] = useImage()
  const Name = useRef(); const Password = useRef(); const email = useRef(); const age = useRef(); const height = useRef()


  function register_handle(e)
  {
    console.log(Name.current.value)
    console.log(Password.current.value)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username:   Name.current.value,
        pw:         Password.current.value,
        email:      email.current.value,
        age:        age.current.value,
        height:     height.current.value
      })
      };
      fetch('http://localhost:8080/register', requestOptions)
        .then(response => response.json())
        console.log(response)
  }

  function login_handle(e)
  {
    console.log(Name.current.value)
    console.log(Password.current.value)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username:   Name.current.value,
        pw:         Password.current.value
      })
      };
      fetch('https://reqres.in/api/posts', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }));
  }

  return <>
    <h1>Images</h1>
    <div style={{ display: 'flex', gap: '10px' }}>
      <But label='<' onclick={previous} />
      {image 
        ? <Img src={image.src} /> 
        : <div style={{ height: '200px', width: '300px' }}><p>Invalid image</p></div> }
      <But label='>' onclick={next} />
    </div>
    <div id='register'>
      <div>Register</div>
      <div>UserName</div>
      <input ref = {Name} type="text"/>
      <div>Email</div>
      <input ref = {email} type="text"/>
      <div>Password</div>
      <input ref = {Password} type="password"/>
      <div>Age</div>
      <input ref = {age} type="number"/>
      <div>height</div>
      <input ref = {height} type="number"/>
      <But label='Register' onclick={register_handle}/>
    </div>
  </>
}

export default App