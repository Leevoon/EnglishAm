import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext, ArrayInput, SimpleFormIterator, BooleanInput,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const IeltsSpeakingFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name" alwaysOn />
  </Filter>
);

export const IeltsSpeakingList = (props) => (
  <List {...props} filters={<IeltsSpeakingFilter />}>
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

export const IeltsSpeakingEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <SelectInput source="status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Edit>
);

export const IeltsSpeakingCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <SelectInput source="status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Create>
);
