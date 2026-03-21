import React from 'react';
import {
  List, Datagrid, TextField, NumberField, DateField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  required, EditButton,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';
import { StatusField, ViewRelatedButton } from '../../components';

const filters = [
  <TextInput source="q" label="Search" alwaysOn />,
];

export const IeltsReadingList = () => (
  <List filters={filters} sort={{ field: 'sort_order', order: 'ASC' }} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <TextField source="name" />
      <StatusField source="status" />
      <NumberField source="sort_order" label="Order" />
      <DateField source="created_date" label="Created" />
      <ViewRelatedButton resource="ielts-reading-questions" filterField="ielts_reading_id" label="Questions" />
      <EditButton />
    </Datagrid>
  </List>
);

export const IeltsReadingEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" validate={required()} fullWidth />
      <RichTextInput source="reading_text" label="Reading Text" fullWidth />
      <RichTextInput source="explain_text" label="Explanation" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" label="Order" />
    </SimpleForm>
  </Edit>
);

export const IeltsReadingCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <RichTextInput source="reading_text" label="Reading Text" fullWidth />
      <RichTextInput source="explain_text" label="Explanation" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
