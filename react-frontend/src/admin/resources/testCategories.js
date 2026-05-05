import React from 'react';
import {
  List, Datagrid, TextField, NumberField, BooleanField, EditButton,
  Edit, SimpleForm, TextInput, NumberInput, BooleanInput, SelectInput,
  Create,
} from 'react-admin';

export const TestCategoryList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <NumberField source="category_id" />
      <NumberField source="level_id" />
      <TextField source="name" />
      <TextField source="tier" />
      <BooleanField source="status" looseValue />
      <EditButton />
    </Datagrid>
  </List>
);
const Form = ({ create }) => (
  <SimpleForm>
    {!create && <TextInput disabled source="id" />}
    <NumberInput source="category_id" />
    <NumberInput source="level_id" />
    <NumberInput source="parent_id" defaultValue={0} />
    <TextInput source="name" />
    <TextInput source="time" defaultValue="00:10:00" helperText="HH:MM:SS" />
    <SelectInput source="tier" choices={[
      { id: 'free', name: 'Free' },
      { id: 'silver', name: 'Silver' },
      { id: 'gold', name: 'Gold' },
    ]} defaultValue="free" />
    <NumberInput source="sort_order" defaultValue={0} />
    <BooleanInput source="status" defaultValue={true} />
  </SimpleForm>
);
export const TestCategoryEdit = (props) => <Edit {...props}><Form /></Edit>;
export const TestCategoryCreate = (props) => <Create {...props}><Form create /></Create>;
