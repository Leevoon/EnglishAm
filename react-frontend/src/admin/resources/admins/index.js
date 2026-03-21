import React from 'react';
import {
  List, Datagrid, TextField, EmailField, NumberField, DateField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, PasswordInput,
  EditButton,
} from 'react-admin';
import { StatusField } from '../../components';

const filters = [
  <TextInput source="q" label="Search" alwaysOn />,
];

export const AdminUserList = () => (
  <List filters={filters} sort={{ field: 'id', order: 'DESC' }} perPage={25}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <EmailField source="email" />
      <TextField source="name" />
      <TextField source="group_name" label="Group" />
      <StatusField source="status" />
      <DateField source="created_date" label="Created" />
      <EditButton />
    </Datagrid>
  </List>
);

export const AdminUserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="email" type="email" fullWidth required />
      <PasswordInput source="password" label="New Password (leave empty to keep current)" fullWidth />
      <TextInput source="name" fullWidth />
      <NumberInput source="group_id" label="Group ID" />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
    </SimpleForm>
  </Edit>
);

export const AdminUserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="email" type="email" fullWidth required />
      <PasswordInput source="password" fullWidth required />
      <TextInput source="name" fullWidth />
      <NumberInput source="group_id" label="Group ID" defaultValue={2} />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
    </SimpleForm>
  </Create>
);
