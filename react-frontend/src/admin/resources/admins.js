import React from 'react';
import {
  List, Datagrid, TextField, EmailField, DateField,
  Edit, SimpleForm, TextInput, NumberInput,
  Create, EditButton,
} from 'react-admin';

export const AdminList = (props) => (
  <List {...props} sort={{ field: 'created_date', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <EmailField source="email" />
      <TextField source="name" />
      <TextField source="group_id" />
      <DateField source="created_date" />
      <EditButton />
    </Datagrid>
  </List>
);

export const AdminEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="email" />
      <TextInput source="name" />
      <NumberInput source="group_id" />
      <TextInput source="password" type="password" helperText="Leave blank to keep existing password" />
    </SimpleForm>
  </Edit>
);

export const AdminCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" />
      <TextInput source="name" />
      <NumberInput source="group_id" defaultValue={1} />
      <TextInput source="password" type="password" />
    </SimpleForm>
  </Create>
);
