import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext, ArrayInput, SimpleFormIterator, BooleanInput,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const IeltsReadingFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name" alwaysOn />
  </Filter>
);

export const IeltsReadingList = (props) => (
  <List {...props} filters={<IeltsReadingFilter />}>
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

export const IeltsReadingEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <RichTextInput source="reading_text" label="Reading Text" />
      <RichTextInput source="explain_text" label="Explanation" />
      <SelectInput source="status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Edit>
);

export const IeltsReadingCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <RichTextInput source="reading_text" label="Reading Text" />
      <RichTextInput source="explain_text" label="Explanation" />
      <SelectInput source="status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Create>
);
