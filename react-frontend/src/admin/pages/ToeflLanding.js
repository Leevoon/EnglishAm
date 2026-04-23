import React from 'react';
import { Link } from 'react-router-dom';
import { Title } from 'react-admin';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import EditNoteIcon from '@mui/icons-material/EditNote';

const SECTIONS = [
  { key: 'reading',   to: '/toefl-reading',   label: 'Reading',   icon: <MenuBookIcon fontSize="large" /> },
  { key: 'listening', to: '/toefl-listening', label: 'Listening', icon: <HeadphonesIcon fontSize="large" /> },
  { key: 'speaking',  to: '/toefl-speaking',  label: 'Speaking',  icon: <RecordVoiceOverIcon fontSize="large" /> },
  { key: 'writing',   to: '/toefl-writing',   label: 'Writing',   icon: <EditNoteIcon fontSize="large" /> },
];

const ToeflLanding = () => (
  <Box sx={{ p: 3 }}>
    <Title title="TOEFL" />
    <Typography variant="h4" sx={{ mb: 1 }}>TOEFL</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Pick a section to view, add, edit, or delete its tests.
    </Typography>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 2,
      }}
    >
      {SECTIONS.map((s) => (
        <Card key={s.key}>
          <CardActionArea component={Link} to={s.to}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4,
              }}
            >
              {s.icon}
              <Typography variant="h6" sx={{ mt: 1 }}>{s.label}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                View / add / edit / delete
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  </Box>
);

export default ToeflLanding;
