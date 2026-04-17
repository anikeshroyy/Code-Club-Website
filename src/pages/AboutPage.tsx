import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import AboutHero from '../components/about/AboutHero';
import PrincipalMessage from '../components/about/PrincipalMessage';
import FacultyCoordinators from '../components/about/FacultyCoordinators';
import TeamMembers from '../components/about/TeamMembers';
import PastMembers from '../components/about/PastMembers';
import SEO from '../components/common/SEO';

const AboutPage: React.FC = () => {
  return (
    <Box>
      <SEO
        title="About Us"
        description="Learn about Code Club GEC Jamui — our story, mission, vision, faculty coordinators, and the team driving innovation at Government Engineering College Jamui."
        path="/about"
      />
      <AboutHero />
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Our Story
          </Typography>
          <Typography variant="body1" paragraph>
            The Code Club at Government Engineering College, Jamui was established in 2020 with the aim of fostering a culture of coding and innovation among students. What started as a small group of passionate coders has now grown into a vibrant community of tech enthusiasts.
          </Typography>
          <Typography variant="body1" paragraph>
            Our club provides a platform for students to enhance their coding skills, collaborate on projects, and prepare for the competitive tech industry. We organize workshops, hackathons, coding competitions, and guest lectures to help students stay updated with the latest technologies and industry trends.
          </Typography>
          
          <Typography variant="h4" component="h2" sx={{ mt: 6, mb: 2 }}>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            Our mission is to create a collaborative environment where students can learn, innovate, and grow together. We aim to bridge the gap between academic learning and industry requirements by providing practical exposure to real-world projects and challenges.
          </Typography>
          
          <Typography variant="h4" component="h2" sx={{ mt: 6, mb: 2 }}>
            Our Vision
          </Typography>
          <Typography variant="body1">
            We envision a future where every student at GEC Jamui is equipped with the necessary coding skills and technical knowledge to excel in their careers. We strive to be a catalyst for innovation and technological advancement within our college and beyond.
          </Typography>
        </Box>
      </Container>
      
      <PrincipalMessage />
      <FacultyCoordinators />
      <TeamMembers />
      <PastMembers />
    </Box>
  );
};

export default AboutPage; 