import React from 'react';
import { Layout, Menu, useSidebarState } from 'react-admin';
import { Box, Divider, Typography } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import QuizIcon from '@mui/icons-material/Quiz';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HistoryIcon from '@mui/icons-material/History';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import LockIcon from '@mui/icons-material/Lock';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import EditNoteIcon from '@mui/icons-material/EditNote';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const SectionLabel = ({ children }) => {
  const [open] = useSidebarState();
  if (!open) return <Divider sx={{ my: 0.5 }} />;
  return (
    <Box sx={{ pt: 2, pb: 0.5, px: 2 }}>
      <Typography
        variant="overline"
        sx={{
          color: 'primary.main',
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          lineHeight: 1,
          display: 'block',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

const CustomMenu = () => (
  <Menu>
    <Menu.DashboardItem />

    <SectionLabel>Content</SectionLabel>
    <Menu.Item to="/categories" primaryText="Categories" leftIcon={<CategoryIcon />} />
    <Menu.Item to="/test-categories" primaryText="Test Categories" leftIcon={<ListAltIcon />} />
    <Menu.Item to="/tests" primaryText="Tests" leftIcon={<QuizIcon />} />
    <Menu.Item to="/test-levels" primaryText="Test Levels" leftIcon={<SignalCellularAltIcon />} />
    <Menu.Item to="/languages" primaryText="Languages" leftIcon={<LanguageIcon />} />

    <SectionLabel>Users &amp; Access</SectionLabel>
    <Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleIcon />} />
    <Menu.Item to="/admins" primaryText="Admins" leftIcon={<AdminPanelSettingsIcon />} />
    <Menu.Item to="/user-history" primaryText="User History" leftIcon={<HistoryIcon />} />
    <Menu.Item to="/membership-plans" primaryText="Membership Plans" leftIcon={<CardMembershipIcon />} />
    <Menu.Item to="/membership-access" primaryText="Membership Access" leftIcon={<LockIcon />} />

    <SectionLabel>CMS</SectionLabel>
    <Menu.Item to="/news" primaryText="News" leftIcon={<NewspaperIcon />} />
    <Menu.Item to="/slideshow" primaryText="Slideshow" leftIcon={<SlideshowIcon />} />
    <Menu.Item to="/gallery" primaryText="Gallery" leftIcon={<PhotoLibraryIcon />} />

    <SectionLabel>Tests</SectionLabel>
    <Menu.Item to="/audio-tests" primaryText="Audio Tests" leftIcon={<VolumeUpIcon />} />
    <Menu.Item to="/synonym-tests" primaryText="Synonyms" leftIcon={<SwapHorizIcon />} />
    <Menu.Item to="/antonym-tests" primaryText="Antonyms" leftIcon={<CompareArrowsIcon />} />
    <Menu.Item to="/general-english-tests" primaryText="General English" leftIcon={<SchoolIcon />} />
    <Menu.Item to="/professional-english-tests" primaryText="Professional English" leftIcon={<BusinessCenterIcon />} />
    <Menu.Item to="/photo-tests" primaryText="Photo Tests" leftIcon={<PhotoCameraIcon />} />

    <SectionLabel>TOEFL</SectionLabel>
    <Menu.Item to="/toefl-reading" primaryText="Reading" leftIcon={<MenuBookIcon />} />
    <Menu.Item to="/toefl-listening" primaryText="Listening" leftIcon={<HeadphonesIcon />} />
    <Menu.Item to="/toefl-speaking" primaryText="Speaking" leftIcon={<RecordVoiceOverIcon />} />
    <Menu.Item to="/toefl-writing" primaryText="Writing" leftIcon={<EditNoteIcon />} />

    <SectionLabel>IELTS</SectionLabel>
    <Menu.Item to="/ielts-reading" primaryText="Reading" leftIcon={<MenuBookIcon />} />
    <Menu.Item to="/ielts-listening" primaryText="Listening" leftIcon={<HeadphonesIcon />} />
    <Menu.Item to="/ielts-speaking" primaryText="Speaking" leftIcon={<RecordVoiceOverIcon />} />
    <Menu.Item to="/ielts-writing" primaryText="Writing" leftIcon={<EditNoteIcon />} />
  </Menu>
);

const CustomLayout = (props) => <Layout {...props} menu={CustomMenu} />;

export default CustomLayout;
