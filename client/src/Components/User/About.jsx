import React from 'react'
import Nav from './Nav'
import Footer from './Footer'

const About = () => {
  return (
    <>
      <Nav />
      <div className="container mt-5">
        <h1>About Us</h1>
        <p>Welcome to Magic Library, your one-stop destination for all your literary needs.</p>
        {/* Add more content here */}
      </div>
      <Footer />
    </>
  )
}

export default About