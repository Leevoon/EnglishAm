import React from 'react';
import {
  List, Datagrid, TextField, NumberField, BooleanField, EditButton,
  Edit, SimpleForm, TextInput, NumberInput, BooleanInput, SelectInput,
  Create,
} from 'react-admin';

export const IeltsReadingList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <NumberField source="ielts_type" label="Track (0=GT, 1=Acad)" />
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
    <SelectInput source="ielts_type" choices={[
      { id: 0, name: 'General Training' },
      { id: 1, name: 'Academic' },
    ]} defaultValue={0} />
    <SelectInput source="tier" choices={[
      { id: 'free', name: 'Free' },
      { id: 'silver', name: 'Silver' },
      { id: 'gold', name: 'Gold' },
    ]} defaultValue="silver" />
    <TextInput source="reading_text" multiline minRows={6} />
    <BooleanInput source="status" defaultValue={true} />
    <NumberInput source="sort_order" defaultValue={0} />
  </SimpleForm>
);
export const IeltsReadingEdit = (props) => <Edit {...props}><Form /></Edit>;
export const IeltsReadingCreate = (props) => <Create {...props}><Form create /></Create>;
