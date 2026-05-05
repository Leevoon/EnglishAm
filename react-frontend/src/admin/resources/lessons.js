import React from 'react';
import {
  List, Datagrid, TextField, NumberField, BooleanField, EditButton,
  Edit, SimpleForm, TextInput, NumberInput, BooleanInput,
  Create,
} from 'react-admin';

export const LessonsList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="level_id" />
      <NumberField source="filter_id" />
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
    <TextInput source="description" />
    <NumberInput source="level_id" defaultValue={1} />
    <NumberInput source="filter_id" defaultValue={1} />
    <TextInput source="duration" />
    <TextInput source="lesson" multiline minRows={6} helperText="HTML body" />
    <TextInput source="image" />
    <BooleanInput source="status" defaultValue={true} />
    <NumberInput source="sort_order" defaultValue={0} />
  </SimpleForm>
);
export const LessonsEdit = (props) => <Edit {...props}><Form /></Edit>;
export const LessonsCreate = (props) => <Create {...props}><Form create /></Create>;
