import React from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryCards from '../components/home/CategoryCards';
import AboutSection from '../components/home/AboutSection';
import PopularTests from '../components/home/PopularTests';
import WhyChooseUs from '../components/home/WhyChooseUs';
import MembershipPlans from '../components/home/MembershipPlans';
import LatestNews from '../components/home/LatestNews';
import GallerySection from '../components/home/GallerySection';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section with Carousel */}
      <HeroCarousel />
      
      {/* Category Selection - "learn a language with us" */}
      <CategoryCards />
      
      {/* About Us Section */}
      <AboutSection />
      
      {/* Most Popular Tests */}
      <PopularTests />
      
      {/* Why Choose Us */}
      <WhyChooseUs />
      
      {/* Membership Plans */}
      <MembershipPlans />
      
      {/* Latest News */}
      <LatestNews />
      
      {/* Pictures and Gallery */}
      <GallerySection />
    </div>
  );
};

export default Home;
