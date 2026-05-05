import React from 'react';
import {
  List, Datagrid, TextField, NumberField, BooleanField, EditButton,
  Edit, SimpleForm, TextInput, NumberInput, BooleanInput, SelectInput,
  Create,
} from 'react-admin';

export const ToeflReadingList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="time" />
      <TextField source="tier" />
      <BooleanField source="status" looseValue />
      <NumberField source="sort_order" />
      <EditButton />
    </Datagrid>
  </List>
);
const Form = ({ create }) => (
  <SimpleForm>
    {!create && <TextInput disabled source="id" />}
    <TextInput source="title" />
    <TextInput source="time" defaultValue="01:00:00" helperText="HH:MM:SS" />
    <SelectInput source="tier" choices={[
      { id: 'free', name: 'Free' },
      { id: 'silver', name: 'Silver' },
      { id: 'gold', name: 'Gold' },
    ]} defaultValue="silver" />
    <BooleanInput source="status" defaultValue={true} />
    <NumberInput source="sort_order" defaultValue={0} />
  </SimpleForm>
);
export const ToeflReadingEdit = (props) => <Edit {...props}><Form /></Edit>;
export const ToeflReadingCreate = (props) => <Create {...props}><Form create /></Create>;
