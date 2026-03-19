import React from 'react';
import {
  List, Datagrid, TextField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, SelectInput, Filter,
  useRecordContext,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const NewsFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Title" source="title" alwaysOn />
    <SelectInput label="Status" source="status" choices={[
      { id: 'Active', name: 'Active' },
      { id: 'Inactive', name: 'Inactive' },
    ]} />
  </Filter>
);

export const NewsList = () => (
  <List filters={<NewsFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="image" />
      <TextField source="status" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const NewsEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="image" />
      <RichTextInput source="content" />
      <SelectInput source="status" choices={[
        { id: 'Active', name: 'Active' },
        { id: 'Inactive', name: 'Inactive' },
      ]} />
    </SimpleForm>
  </Edit>
);

export const NewsCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="image" />
      <RichTextInput source="content" />
      <SelectInput source="status" choices={[
        { id: 'Active', name: 'Active' },
        { id: 'Inactive', name: 'Inactive' },
      ]} />
    </SimpleForm>
  </Create>
);
