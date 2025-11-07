import React from 'react'
import { Navbar } from './Navbar'
import { Hero } from './Hero'
import { WelcomeSection } from './WelcomeSection'
import { RoomsSection } from './RoomsSection'
import { AmenitiesSection } from './AmenitiesSection'
import { LocationSection } from './LocationSection'
import { ContactSection } from './ContactSection'
import { Footer } from './Footer'
import { ChatWidget } from './ChatWideget'

const LandingPage = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
    <WelcomeSection/>
    <RoomsSection/>
    <AmenitiesSection/>
    <LocationSection/>
    <ContactSection/>
    <Footer/>
    <ChatWidget />
    </>
  )
}

export default LandingPage