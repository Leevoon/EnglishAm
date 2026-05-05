import React from 'react';
import {
  List, Datagrid, TextField, BooleanField, DateField, NumberField, EditButton,
  Edit, SimpleForm, TextInput, BooleanInput, NumberInput,
  Create,
} from 'react-admin';

export const GalleryList = (props) => (
  <List {...props}>
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

const Form = ({ create }) => (
  <SimpleForm>
    {!create && <TextInput disabled source="id" />}
    <TextInput source="image" />
    <BooleanInput source="status" defaultValue={true} />
    <NumberInput source="sort_order" defaultValue={0} />
  </SimpleForm>
);

export const GalleryEdit = (props) => <Edit {...props}><Form /></Edit>;
export const GalleryCreate = (props) => <Create {...props}><Form create /></Create>;
