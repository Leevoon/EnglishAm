import React from 'react';
import {
  List, Datagrid, TextField, BooleanField, NumberField, EditButton,
  Edit, SimpleForm, TextInput, BooleanInput, NumberInput,
  Create,
} from 'react-admin';

export const SlideshowList = (props) => (
  <List {...props} sort={{ field: 'sort_order', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="image" />
      <TextField source="href" />
      <BooleanField source="status" looseValue />
      <NumberField source="sort_order" />
      <EditButton />
    </Datagrid>
  </List>
);

const Form = ({ create }) => (
  <SimpleForm>
    {!create && <TextInput disabled source="id" />}
    <TextInput source="image" />
    <TextInput source="href" />
    <BooleanInput source="status" defaultValue={true} />
    <NumberInput source="sort_order" defaultValue={0} />
  </SimpleForm>
);

export const SlideshowEdit = (props) => <Edit {...props}><Form /></Edit>;
export const SlideshowCreate = (props) => <Create {...props}><Form create /></Create>;
