import React from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  ArrayInput, SimpleFormIterator, BooleanInput,
  TabbedForm, FormTab, EditButton,
} from 'react-admin';
import { StatusField } from '../../components';

const filters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <NumberInput source="test_category_id" label="Category ID" />,
];

export const TestList = () => (
  <List filters={filters} sort={{ field: 'id', order: 'DESC' }} perPage={25}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="question" label="Question" />
      <TextField source="category_name" label="Category" />
      <StatusField source="status" />
      <NumberField source="sort_order" label="Order" />
      <EditButton />
    </Datagrid>
  </List>
);

export const TestEdit = () => (
  <Edit>
    <TabbedForm>
      <FormTab label="Basic Info">
        <TextInput source="id" disabled />
        <TextInput source="question" multiline rows={3} fullWidth required />
        <NumberInput source="test_category_id" label="Test Category ID" required />
        <SelectInput source="status" choices={[
          { id: 1, name: 'Active' },
          { id: 0, name: 'Inactive' },
        ]} />
        <NumberInput source="sort_order" label="Order" defaultValue={0} />
      </FormTab>
      <FormTab label="Media">
        <TextInput source="image" label="Image Path" fullWidth />
        <TextInput source="audio" label="Audio Path" fullWidth />
      </FormTab>
      <FormTab label="Answers">
        <ArrayInput source="answers">
          <SimpleFormIterator inline>
            <TextInput source="text" label="Answer Text" helperText={false} />
            <BooleanInput source="is_correct" label="Correct?" helperText={false} />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Edit>
);

export const TestCreate = () => (
  <Create>
    <TabbedForm>
      <FormTab label="Basic Info">
        <TextInput source="question" multiline rows={3} fullWidth required />
        <NumberInput source="test_category_id" label="Test Category ID" required />
        <SelectInput source="status" choices={[
          { id: 1, name: 'Active' },
          { id: 0, name: 'Inactive' },
        ]} defaultValue={1} />
        <NumberInput source="sort_order" label="Order" defaultValue={0} />
      </FormTab>
      <FormTab label="Media">
        <TextInput source="image" label="Image Path" fullWidth />
        <TextInput source="audio" label="Audio Path" fullWidth />
      </FormTab>
      <FormTab label="Answers">
        <ArrayInput source="answers">
          <SimpleFormIterator inline>
            <TextInput source="text" label="Answer Text" helperText={false} />
            <BooleanInput source="is_correct" label="Correct?" helperText={false} />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Create>
);
