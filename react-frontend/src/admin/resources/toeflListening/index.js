import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext,
} from 'react-admin';

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
];

export const ToeflListeningList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="status" />
      <NumberField source="sort_order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ToeflListeningEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <SelectInput source="status" choices={statusChoices} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Edit>
);

export const ToeflListeningCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <SelectInput source="status" choices={statusChoices} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Create>
);

function required() {
  return (value) => (value ? undefined : 'Required');
}
