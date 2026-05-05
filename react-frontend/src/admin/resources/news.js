import React from 'react';
import {
  List, Datagrid, TextField, BooleanField, DateField, EditButton, NumberField,
  Edit, SimpleForm, TextInput, BooleanInput, NumberInput,
  Create,
} from 'react-admin';

export const NewsList = (props) => (
  <List {...props} sort={{ field: 'created_date', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="image" />
      <BooleanField source="status" looseValue />
      <NumberField source="sort_order" />
      <DateField source="created_date" />
      <EditButton />
    </Datagrid>
  </List>
);

const NewsForm = ({ create }) => (
  <SimpleForm>
    {!create && <TextInput disabled source="id" />}
    <TextInput source="image" helperText="Path or URL to header image" />
    <BooleanInput source="status" defaultValue={true} />
    <NumberInput source="sort_order" defaultValue={0} />
  </SimpleForm>
);

export const NewsEdit = (props) => <Edit {...props}><NewsForm /></Edit>;
export const NewsCreate = (props) => <Create {...props}><NewsForm create /></Create>;
