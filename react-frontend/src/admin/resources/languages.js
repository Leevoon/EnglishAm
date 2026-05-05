import React from 'react';
import {
  List, Datagrid, TextField, BooleanField, NumberField, EditButton,
  Edit, SimpleForm, TextInput, BooleanInput, NumberInput,
  Create,
} from 'react-admin';

export const LanguagesList = (props) => (
  <List {...props} sort={{ field: 'sort_order', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="iso" />
      <BooleanField source="status" looseValue />
      <NumberField source="sort_order" />
      <EditButton />
    </Datagrid>
  </List>
);
const Form = ({ create }) => (
  <SimpleForm>
    {!create && <TextInput disabled source="id" />}
    <TextInput source="name" />
    <TextInput source="iso" helperText="ISO code (en, hy, ru, ...)" />
    <TextInput source="image" helperText="Flag image path" />
    <BooleanInput source="status" defaultValue={true} />
    <NumberInput source="sort_order" defaultValue={0} />
  </SimpleForm>
);
export const LanguagesEdit = (props) => <Edit {...props}><Form /></Edit>;
export const LanguagesCreate = (props) => <Create {...props}><Form create /></Create>;
