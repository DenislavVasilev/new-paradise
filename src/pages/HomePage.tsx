import React from 'react';
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import ProjectInfo from "../components/ProjectInfo";
import AvailabilityCounter from "../components/AvailabilityCounter";
import Location from "../components/Gallery";
import ContactForm from "../components/ContactForm";

const HomePage = () => {
  return (
    <>
      <Hero />
      <Benefits />
      <ProjectInfo />
      <AvailabilityCounter />
      <Location />
      <ContactForm />
    </>
  );
};

export default HomePage;