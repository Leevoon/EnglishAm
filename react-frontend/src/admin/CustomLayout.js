import React, { useState } from 'react';
import { Layout, Menu, useSidebarState } from 'react-admin';
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EmailIcon from '@mui/icons-material/Email';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import QuizIcon from '@mui/icons-material/Quiz';
import ClassIcon from '@mui/icons-material/Class';
import VideocamIcon from '@mui/icons-material/Videocam';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import BadgeIcon from '@mui/icons-material/Badge';
import InboxIcon from '@mui/icons-material/Inbox';
import TvIcon from '@mui/icons-material/Tv';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import InfoIcon from '@mui/icons-material/Info';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ForumIcon from '@mui/icons-material/Forum';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
import SettingsIcon from '@mui/icons-material/Settings';
import TranslateIcon from '@mui/icons-material/Translate';
import ImageIcon from '@mui/icons-material/Image';
import LanguageIcon from '@mui/icons-material/Language';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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

const SubMenu = ({ label, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen] = useSidebarState();

  return (
    <>
      <MenuItem onClick={() => setIsOpen((v) => !v)} dense>
        {icon && <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>}
        {sidebarOpen && <ListItemText primary={label} />}
        {sidebarOpen && (isOpen ? <ExpandLess /> : <ExpandMore />)}
      </MenuItem>
      <Collapse in={isOpen && sidebarOpen} timeout="auto" unmountOnExit>
        <List disablePadding sx={{ pl: 2 }}>
          {children}
        </List>
      </Collapse>
    </>
  );
};

const SubIcon = () => <RadioButtonUncheckedIcon sx={{ fontSize: 10 }} />;

const CustomMenu = () => (
  <Menu>
    <SectionLabel>MAIN NAVIGATION</SectionLabel>

    <Menu.Item to="/contact-messages" primaryText="Contact email" leftIcon={<EmailIcon />} />

    <SubMenu label="Catalog" icon={<LocalOfferIcon />}>
      <Menu.Item to="/categories" primaryText="Headers" leftIcon={<SubIcon />} />
      <Menu.Item to="/home-page-categories" primaryText="Choose Home Page Categories" leftIcon={<SubIcon />} />
      <Menu.Item to="/test-categories" primaryText="Test Filters" leftIcon={<SubIcon />} />
      <Menu.Item to="/test-levels" primaryText="Test Level" leftIcon={<SubIcon />} />
    </SubMenu>

    <SubMenu label="Tests" icon={<QuizIcon />}>
      <Menu.Item to="/categories?browse=1" primaryText="Tests" leftIcon={<SubIcon />} />
      <Menu.Item to="/toefl" primaryText="Toefl" leftIcon={<SubIcon />} />
      <Menu.Item to="/ielts" primaryText="IELTS" leftIcon={<SubIcon />} />
      <Menu.Item to="/overall-english" primaryText="Overall English" leftIcon={<SubIcon />} />
      <Menu.Item to="/trainings" primaryText="Trainings" leftIcon={<SubIcon />} />
    </SubMenu>

    <Menu.Item to="/demo-videos" primaryText="Demo videos" leftIcon={<VideocamIcon />} />

    <SubMenu label="Subject matter" icon={<ClassIcon />}>
      <Menu.Item to="/lessons-levels" primaryText="Levels" leftIcon={<SubIcon />} />
      <Menu.Item to="/lessons-filters" primaryText="Category" leftIcon={<SubIcon />} />
      <Menu.Item to="/lessons" primaryText="Subject matter" leftIcon={<SubIcon />} />
    </SubMenu>

    <Menu.Item to="/membership-plans" primaryText="Membership" leftIcon={<CardMembershipIcon />} />
    <Menu.Item to="/cv" primaryText="CV" leftIcon={<BadgeIcon />} />
    <Menu.Item to="/inbox" primaryText="Inbox" leftIcon={<InboxIcon />} />
    <Menu.Item to="/wrong-answers" primaryText="Wrong Answers" leftIcon={<TvIcon />} />
    <Menu.Item to="/school-template" primaryText="Schools Template" leftIcon={<SchoolIcon />} />
    <Menu.Item to="/dictionary" primaryText="Dictionary" leftIcon={<MenuBookIcon />} />
    <Menu.Item to="/gallery" primaryText="Gallery" leftIcon={<PhotoLibraryIcon />} />
    <Menu.Item to="/news" primaryText="News" leftIcon={<NewspaperIcon />} />
    <Menu.Item to="/slideshow" primaryText="Slide Show" leftIcon={<SlideshowIcon />} />
    <Menu.Item to="/static-pages" primaryText="Information" leftIcon={<InfoIcon />} />
    <Menu.Item to="/all-certificates" primaryText="All Certificates" leftIcon={<WorkspacePremiumIcon />} />
    <Menu.Item to="/certificate" primaryText="Certificates" leftIcon={<WorkspacePremiumIcon />} />
    <Menu.Item to="/faq" primaryText="FAQ" leftIcon={<ForumIcon />} />
    <Menu.Item to="/review" primaryText="Review" leftIcon={<VisibilityIcon />} />
    <Menu.Item to="/download" primaryText="Downloadable Content" leftIcon={<VisibilityIcon />} />
    <Menu.Item to="/socials" primaryText="Socials" leftIcon={<ShareIcon />} />

    <SubMenu label="Admins" icon={<AdminPanelSettingsIcon />}>
      <Menu.Item to="/admins" primaryText="Admins" leftIcon={<SubIcon />} />
      <Menu.Item to="/admins-groups" primaryText="User Groups" leftIcon={<SubIcon />} />
    </SubMenu>

    <Menu.Item to="/users" primaryText="Users" leftIcon={<PersonIcon />} />
    <Menu.Item to="/seo-urls" primaryText="Seo Urls" leftIcon={<LinkIcon />} />

    <SubMenu label="Settings" icon={<SettingsIcon />}>
      <Menu.Item to="/translations" primaryText="Translations" leftIcon={<TranslateIcon />} />
      <Menu.Item to="/menu-control" primaryText="Menu control" leftIcon={<SubIcon />} />
      <Menu.Item to="/page-images" primaryText="Page images" leftIcon={<ImageIcon />} />
      <Menu.Item to="/languages" primaryText="Languages" leftIcon={<LanguageIcon />} />
      <Menu.Item to="/currency" primaryText="Currency" leftIcon={<AttachMoneyIcon />} />
      <Menu.Item to="/site-contacts" primaryText="Site Contacts" leftIcon={<SubIcon />} />
    </SubMenu>
  </Menu>
);

const CustomLayout = (props) => <Layout {...props} menu={CustomMenu} />;

export default CustomLayout;
