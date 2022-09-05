import React from 'react'
import logo from '../../assets/short.png'
import { Container } from './styles'

const Header = () => {
  return (
    <Container>
        <div className='header'>
            <img src={logo} alt='' className='logo'/>
        </div>
    </Container>
  )
}

export default Header;
