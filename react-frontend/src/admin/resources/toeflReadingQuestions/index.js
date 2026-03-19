import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext,
  ArrayInput, SimpleFormIterator, BooleanInput,
} from 'react-admin';

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
];

const ToeflReadingQuestionFilter = (props) => (
  <Filter {...props}>
    <NumberInput source="toefl_reading_test_id" label="Passage ID" alwaysOn />
  </Filter>
);

export const ToeflReadingQuestionList = (props) => (
  <List {...props} filters={<ToeflReadingQuestionFilter />}>
    <Datagrid>
      <TextField source="id" />
      <NumberField source="toefl_reading_test_id" />
      <TextField source="text" />
      <NumberField source="answer_count" />
      <TextField source="status" />
      <NumberField source="sort_order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ToeflReadingQuestionEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <NumberInput source="toefl_reading_test_id" label="Passage ID" />
      <TextInput source="text" multiline fullWidth />
      <SelectInput source="status" choices={statusChoices} />
      <NumberInput source="sort_order" />
      <ArrayInput source="answers">
        <SimpleFormIterator>
          <TextInput source="text" />
          <TextInput source="answer_question" />
          <BooleanInput source="is_correct" label="Correct?" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const ToeflReadingQuestionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <NumberInput source="toefl_reading_test_id" label="Passage ID" />
      <TextInput source="text" multiline fullWidth />
      <SelectInput source="status" choices={statusChoices} />
      <NumberInput source="sort_order" />
      <ArrayInput source="answers">
        <SimpleFormIterator>
          <TextInput source="text" />
          <TextInput source="answer_question" />
          <BooleanInput source="is_correct" label="Correct?" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
