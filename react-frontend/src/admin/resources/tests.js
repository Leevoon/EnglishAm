import React from 'react';
import {
  List, Datagrid, TextField, NumberField, BooleanField, EditButton,
  Edit, SimpleForm, TextInput, NumberInput, BooleanInput, SelectInput,
  Create,
} from 'react-admin';

export const TestList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <NumberField source="parent_id" label="Test ID" />
      <TextField source="question" />
      <NumberField source="sort_order" />
      <BooleanField source="status" looseValue />
      <EditButton />
    </Datagrid>
  </List>
);
const Form = ({ create }) => (
  <SimpleForm>
    {!create && <TextInput disabled source="id" />}
    <NumberInput source="parent_id" label="Test (test_category) ID" />
    <SelectInput source="question_type" choices={[
      { id: 1, name: 'Text' }, { id: 2, name: 'Image' }, { id: 3, name: 'Video' }
    ]} defaultValue={1} />
    <SelectInput source="answer_type" choices={[
      { id: 1, name: 'Text' }, { id: 2, name: 'Image' }
    ]} defaultValue={1} />
    <TextInput source="question" multiline />
    <TextInput source="image" />
    <TextInput source="audio" />
    <NumberInput source="sort_order" defaultValue={0} />
    <BooleanInput source="status" defaultValue={true} />
  </SimpleForm>
);
export const TestEdit = (props) => <Edit {...props}><Form /></Edit>;
export const TestCreate = (props) => <Create {...props}><Form create /></Create>;
