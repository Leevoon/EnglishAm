import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
];

export const ToeflWritingList = (props) => (
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

export const ToeflWritingEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <RichTextInput source="text" label="Content" />
      <RichTextInput source="profesor_text" label="Professor Text" />
      <SelectInput source="status" choices={statusChoices} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Edit>
);

export const ToeflWritingCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <RichTextInput source="text" label="Content" />
      <RichTextInput source="profesor_text" label="Professor Text" />
      <SelectInput source="status" choices={statusChoices} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Create>
);
