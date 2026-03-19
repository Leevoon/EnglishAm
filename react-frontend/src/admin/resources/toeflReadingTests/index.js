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

export const ToeflReadingTestList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <NumberField source="toefl_reding_id" />
      <TextField source="status" />
      <NumberField source="sort_order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ToeflReadingTestEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <NumberInput source="toefl_reding_id" label="Reading ID" />
      <RichTextInput source="text" fullWidth />
      <SelectInput source="status" choices={statusChoices} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Edit>
);

export const ToeflReadingTestCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <NumberInput source="toefl_reding_id" label="Reading ID" />
      <RichTextInput source="text" fullWidth />
      <SelectInput source="status" choices={statusChoices} />
      <NumberInput source="sort_order" />
    </SimpleForm>
  </Create>
);
