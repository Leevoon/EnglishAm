import React from 'react';
import {
  List, Datagrid, TextField, EmailField, NumberField, DateField,
  Edit, Create, SimpleForm, TextInput, SelectInput, PasswordInput,
  EditButton,
} from 'react-admin';
import { BlockStatusField } from '../../components';

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
