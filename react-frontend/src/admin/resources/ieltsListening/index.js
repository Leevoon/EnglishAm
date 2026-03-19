import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext, ArrayInput, SimpleFormIterator, BooleanInput,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const IeltsListeningFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name" alwaysOn />
  </Filter>
);

export const IeltsListeningList = (props) => (
  <List {...props} filters={<IeltsListeningFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="listening_audio" />
      <TextField source="image" />
      <TextField source="status" />
      <NumberField source="sort_order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const IeltsListeningEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="listening_audio" />
      <TextInput source="image" />
      <SelectInput source="status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Edit>
);

export const IeltsListeningCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="listening_audio" />
      <TextInput source="image" />
      <SelectInput source="status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Create>
);
