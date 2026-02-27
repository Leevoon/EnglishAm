import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  BooleanInput,
  Filter,
  ReferenceInput,
  useRecordContext,
  TabbedForm,
  FormTab,
} from 'react-admin';

const TestFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <NumberInput label="Category ID" source="test_category_id" />
  </Filter>
);

const StatusField = () => {
  const record = useRecordContext();
  return <span>{record?.status === 1 ? 'Active' : 'Inactive'}</span>;
};

export const TestList = () => (
  <List filters={<TestFilter />} sort={{ field: 'id', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="question" label="Question" />
      <TextField source="category_name" label="Category" />
      <TextField source="level_name" label="Level" />
      <StatusField source="status" label="Status" />
      <NumberField source="sort_order" label="Order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const TestEdit = () => (
  <Edit>
    <TabbedForm>
      <FormTab label="Basic Info">
        <TextInput source="id" disabled />
        <TextInput source="question" multiline rows={3} fullWidth required />
        <TextInput source="explanation" multiline rows={4} fullWidth label="Explanation" />
        <NumberInput source="test_category_id" label="Test Category ID" required />
        <NumberInput source="test_level_id" label="Test Level ID" required />
        <SelectInput
          source="status"
          choices={[
            { id: 1, name: 'Active' },
            { id: 0, name: 'Inactive' },
          ]}
        />
        <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
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
        <TextInput source="explanation" multiline rows={4} fullWidth label="Explanation" />
        <NumberInput source="test_category_id" label="Test Category ID" required />
        <NumberInput source="test_level_id" label="Test Level ID" required />
        <SelectInput
          source="status"
          choices={[
            { id: 1, name: 'Active' },
            { id: 0, name: 'Inactive' },
          ]}
          defaultValue={1}
        />
        <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
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

