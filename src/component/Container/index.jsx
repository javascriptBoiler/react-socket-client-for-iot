import React from 'react'
import './style.css'

export default function Index({children}) {
  return (
    <div style={{
        display:'flex', 
        flexDirection: 'row', 
        gap:10, 
        flexWrap:'wrap', 
        justifyContent:'center', 
        alignItems:'center',
        height:'90vh',
        overflow:'auto',
        position:'relative'
        }}
    >
        {children}
    </div>
  )
}
