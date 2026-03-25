import React from 'react';
import {
  List, Datagrid, TextField, EmailField, NumberField, DateField,
  Edit, Create, SimpleForm, TextInput, SelectInput, PasswordInput,
  EditButton, useRecordContext, useGetList,
} from 'react-admin';
import { Chip } from '@mui/material';
import { BlockStatusField } from '../../components';

const MembershipLevelField = ({ label }) => {
  const record = useRecordContext();
  if (!record) return null;
  const level = record.membership_level || 0;
  const labels = { 0: 'Free', 1: 'Silver', 2: 'Gold' };
  const colors = { 0: 'default', 1: 'info', 2: 'warning' };
  return <Chip label={labels[level] || 'Free'} size="small" color={colors[level] || 'default'} variant={level > 0 ? 'filled' : 'outlined'} />;
};
MembershipLevelField.defaultProps = { label: 'Membership' };

const MembershipInput = () => {
  const { data: plans } = useGetList('membership-plans', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'level', order: 'ASC' },
    filter: {},
  });
  const choices = [
    { id: 0, name: 'Free (No Membership)' },
    ...(plans || []).map(p => ({ id: p.id, name: `${p.name || 'Plan ' + p.id} (Level ${p.level})` })),
  ];
  return <SelectInput source="membership_id" choices={choices} label="Membership Plan" />;
};

const filters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <SelectInput source="status" choices={[
    { id: 1, name: 'Active' },
    { id: 0, name: 'Blocked' },
  ]} />,
];

export const UserList = () => (
  <List filters={filters} sort={{ field: 'id', order: 'DESC' }} perPage={25}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <EmailField source="email" />
      <TextField source="user_name" label="Username" />
      <TextField source="first_name" label="First Name" />
      <TextField source="last_name" label="Last Name" />
      <MembershipLevelField source="membership_level" />
      <BlockStatusField source="status" />
      <DateField source="created_date" label="Created" />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="email" type="email" fullWidth required />
      <PasswordInput source="password" label="New Password (leave empty to keep current)" fullWidth />
      <TextInput source="user_name" label="Username" fullWidth />
      <TextInput source="first_name" label="First Name" fullWidth />
      <TextInput source="last_name" label="Last Name" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Blocked' },
      ]} />
      <MembershipInput />
    </SimpleForm>
  </Edit>
);

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="email" type="email" fullWidth required />
      <PasswordInput source="password" fullWidth required />
      <TextInput source="user_name" label="Username" fullWidth />
      <TextInput source="first_name" label="First Name" fullWidth />
      <TextInput source="last_name" label="Last Name" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Blocked' },
      ]} defaultValue={1} />
    </SimpleForm>
  </Create>
);
