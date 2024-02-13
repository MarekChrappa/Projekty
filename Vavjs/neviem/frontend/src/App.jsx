import { useEffect } from 'react'
import { useState } from 'react'

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

  return <>
    <h1>Images</h1>
    <div style={{ display: 'flex', gap: '10px' }}>
      <But label='<' onclick={previous} />
      {image 
        ? <Img src={image.src} /> 
        : <div style={{ height: '200px', width: '300px' }}><p>Invalid image</p></div> }
      <But label='>' onclick={next} />
    </div>
  </>
}

export default App