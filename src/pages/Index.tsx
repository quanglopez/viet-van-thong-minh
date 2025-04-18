
import React from 'react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import UseCases from "@/components/UseCases";
import WritingInterface from "@/components/WritingInterface";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <WritingInterface />
      <UseCases />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
