import React from 'react'
import Nav from './Nav'
import PromoSlider from './PromoSlider'
import Categorias from './Categorias'
import Footer from './Footer'

const UserDashboard = () => {
  return (
    <>
      <Nav/>
      <PromoSlider/><br/>
      <Categorias/><br/>
      <Footer/>
    </>
  )
}

export default UserDashboard