import React from 'react'
import Menu from './Menu'

const Layout = ({title='Title',description='Description',children,className='not_set'}) => {
  return (
  <>
    <Menu/>
        <div className='layout-td'>
            <h1 className='layout_title'>{title}</h1>
            <p className='layout_desc'>{description}</p>
        </div>
    <div className='container'>
      <div className='layout '>
        <div className={className}>
            {children}
        </div>
    </div>
    </div>
  </>
  )
}

export default Layout