import React from 'react';
import {
  List, Datagrid, TextField, EditButton,
  Edit, SimpleForm, TextInput,
  Create,
} from 'react-admin';

export const TranslationsList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="key" />
      <EditButton />
    </Datagrid>
  </List>
);
const Form = ({ create }) => (
  <SimpleForm>
    {!create && <TextInput disabled source="id" />}
    <TextInput source="key" />
  </SimpleForm>
);
export const TranslationsEdit = (props) => <Edit {...props}><Form /></Edit>;
export const TranslationsCreate = (props) => <Create {...props}><Form create /></Create>;
