import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Services from "../components/Services";
import Team from "../components/Team";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import Blog from "../components/Blog";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Services />
        <Team />
        <Testimonials />
        <Contact />
        <FAQ />
        <Blog />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
