import React from 'react';
import {
  List, Datagrid, TextField, EmailField, BooleanField, DateField,
  Edit, SimpleForm, TextInput, BooleanInput, SelectInput,
  Create, SearchInput, EditButton,
} from 'react-admin';

const filters = [
  <SearchInput source="user_name" alwaysOn key="q" />,
];

export const UserList = (props) => (
  <List {...props} filters={filters} sort={{ field: 'created_date', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="user_name" label="Username" />
      <EmailField source="email" />
      <TextField source="first_name" />
      <TextField source="last_name" />
      <BooleanField source="block" looseValue label="Blocked" />
      <DateField source="created_date" />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="user_name" label="Username" />
      <TextInput source="email" />
      <TextInput source="first_name" />
      <TextInput source="last_name" />
      <SelectInput source="gender" choices={[{ id: 1, name: 'Male' }, { id: 2, name: 'Female' }]} />
      <TextInput source="phone" />
      <TextInput source="address" />
      <TextInput source="password" type="password" helperText="Leave blank to keep existing password" />
      <BooleanInput source="block" label="Blocked" />
    </SimpleForm>
  </Edit>
);

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="user_name" label="Username" />
      <TextInput source="email" />
      <TextInput source="first_name" />
      <TextInput source="last_name" />
      <TextInput source="password" type="password" />
      <SelectInput source="gender" choices={[{ id: 1, name: 'Male' }, { id: 2, name: 'Female' }]} defaultValue={1} />
    </SimpleForm>
  </Create>
);
