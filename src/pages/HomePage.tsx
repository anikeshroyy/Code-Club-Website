import React from 'react';
import { Box } from '@mui/material';
import HeroSection from '../components/home/HeroSection';
import AnnouncementSection from '../components/home/AnnouncementSection';
import UpcomingEventSection from '../components/home/UpcomingEventSection';
// import DivisionSection from '../components/home/DivisionSection';
import AboutSection from '../components/home/AboutSection';
import SEO from '../components/common/SEO';

const HomePage: React.FC = () => {
  return (
    <Box>
      <SEO
        title="Home"
        description="Official website of Code Club GEC Jamui. Empowering students to learn, build, and innovate through coding, hackathons, and tech events."
        path="/"
      />
      <HeroSection />
      <AnnouncementSection />
      <UpcomingEventSection />
      {/* <DivisionSection /> */}
      <AboutSection />
    </Box>
  );
};

export default HomePage; 