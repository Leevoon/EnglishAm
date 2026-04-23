import React from 'react';
import {
  List, Datagrid, TextField, EmailField, DateField,
  Show, SimpleShowLayout,
  Edit, SimpleForm, SelectInput, TextInput,
  useRecordContext, useUpdate, useNotify, useRefresh,
  TopToolbar, ShowButton, EditButton, DeleteButton,
} from 'react-admin';
import { Chip, Button } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';

// 0 = unread, 1 = read (different semantics than other tables — don't reuse StatusField)
const ReadStatusField = ({ source = 'status' }) => {
  const record = useRecordContext();
  if (!record) return null;
  const isRead = record[source] === 1 || record[source] === '1';
  return (
    <Chip
      label={isRead ? 'Read' : 'Unread'}
      color={isRead ? 'default' : 'primary'}
      size="small"
      variant={isRead ? 'outlined' : 'filled'}
    />
  );
};
ReadStatusField.defaultProps = { label: 'Status', source: 'status' };

const ToggleReadButton = () => {
  const record = useRecordContext();
  const [update, { isLoading }] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();
  if (!record) return null;
  const isRead = record.status === 1 || record.status === '1';
  const next = isRead ? 0 : 1;

  const onClick = (e) => {
    e.stopPropagation();
    update(
      'contact-messages',
      { id: record.id, data: { status: next }, previousData: record },
      {
        onSuccess: () => { notify(isRead ? 'Marked as unread' : 'Marked as read'); refresh(); },
        onError: (err) => notify(`Error: ${err.message}`, { type: 'warning' }),
      }
    );
  };

  return (
    <Button
      size="small"
      variant="outlined"
      disabled={isLoading}
      onClick={onClick}
      startIcon={isRead ? <MarkEmailUnreadIcon /> : <MarkEmailReadIcon />}
    >
      {isRead ? 'Mark unread' : 'Mark read'}
    </Button>
  );
};

const filters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <SelectInput source="status" label="Status" choices={[
    { id: 0, name: 'Unread' },
    { id: 1, name: 'Read' },
  ]} />,
];

export const ContactMessagesList = () => (
  <List filters={filters} sort={{ field: 'created_date', order: 'DESC' }} perPage={25}>
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <ReadStatusField />
      <DateField source="created_date" label="Received" showTime />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="subject" />
      <ToggleReadButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const ShowActions = () => (
  <TopToolbar>
    <ToggleReadButton />
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

export const ContactMessagesShow = () => (
  <Show actions={<ShowActions />}>
    <SimpleShowLayout>
      <ReadStatusField />
      <DateField source="created_date" label="Received" showTime />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="subject" />
      <TextField source="body" component="pre" sx={{ whiteSpace: 'pre-wrap' }} />
    </SimpleShowLayout>
  </Show>
);

export const ContactMessagesEdit = () => (
  <Edit redirect="list">
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" disabled />
      <TextInput source="email" disabled />
      <TextInput source="subject" disabled fullWidth />
      <TextInput source="body" disabled multiline fullWidth rows={8} />
      <SelectInput source="status" choices={[
        { id: 0, name: 'Unread' },
        { id: 1, name: 'Read' },
      ]} />
    </SimpleForm>
  </Edit>
);
