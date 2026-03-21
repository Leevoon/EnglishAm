import React from 'react';
import { useRecordContext } from 'react-admin';
import { Chip, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const StatusField = ({ source = 'status' }) => {
  const record = useRecordContext();
  if (!record) return null;
  const value = record[source];
  const isActive = value === 1 || value === '1' || value === 'active' || value === 'Active';
  return (
    <Chip
      label={isActive ? 'Active' : 'Inactive'}
      color={isActive ? 'success' : 'default'}
      size="small"
      variant={isActive ? 'filled' : 'outlined'}
    />
  );
};
StatusField.defaultProps = { label: 'Status', source: 'status' };

export const BlockStatusField = ({ source = 'status' }) => {
  const record = useRecordContext();
  if (!record) return null;
  const value = record[source];
  const isActive = value === 1 || value === '1';
  return (
    <Chip
      label={isActive ? 'Active' : 'Blocked'}
      color={isActive ? 'success' : 'error'}
      size="small"
      variant={isActive ? 'filled' : 'outlined'}
    />
  );
};
BlockStatusField.defaultProps = { label: 'Status', source: 'status' };

export const HtmlPreviewField = ({ source, maxLength = 80 }) => {
  const record = useRecordContext();
  if (!record || !record[source]) return <span style={{ color: '#999' }}>-</span>;
  const stripped = record[source]
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return (
    <span title={stripped} style={{ fontSize: '0.8125rem' }}>
      {stripped.length > maxLength ? stripped.substring(0, maxLength) + '...' : stripped}
    </span>
  );
};
HtmlPreviewField.defaultProps = { label: 'Preview' };

export const ViewRelatedButton = ({ resource, filterField, label }) => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Button
      component={Link}
      to={`/${resource}?filter=${encodeURIComponent(JSON.stringify({ [filterField]: record.id }))}`}
      size="small"
      color="primary"
      variant="outlined"
      startIcon={<VisibilityIcon />}
      sx={{ textTransform: 'none', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
    >
      {label}
    </Button>
  );
};
