import React from 'react'
import Menu from './Menu'

const Layout = ({title='Title',description='Description',children,className}) => {
  return (
    <div className='layout breaktextmobile'>
        <Menu/>
        <div className='layout-td'>
            <h1 className='text-4xl font-bold'>{title}</h1>
            <p className='text-xl'>{description}</p>
        </div>
        <div className={className}>
            {children}
        </div>
    </div>
  )
}

export default Layout