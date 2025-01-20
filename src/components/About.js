import React,{useContext} from 'react'
import noteContext from '../context/notes/noteContext'
import { useEffect } from 'react'

const About = () => {
    //const a = useContext(noteContext)
    // useEffect(()=>{
    //     a.update();
    //     // eslint-disable-next-line
    // },[])
  return (
    <div>
      {/* This is about {a.state.name} and he is in class {a.state.class} */}
      This is about page
    </div>
  )
}

export default About
