import React from 'react';
import {
  List, Datagrid, NumberField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  ArrayInput, SimpleFormIterator, BooleanInput,
  required, EditButton,
} from 'react-admin';
import { StatusField, HtmlPreviewField } from '../../components';

const filters = [
  <NumberInput source="toefl_reading_test_id" label="Passage ID" alwaysOn />,
];

export const ToeflReadingQuestionList = () => (
  <List filters={filters} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <NumberField source="toefl_reading_test_id" label="Passage ID" />
      <HtmlPreviewField source="text" label="Question" maxLength={100} />
      <NumberField source="answer_count" label="Answers" />
      <StatusField source="status" />
      <NumberField source="sort_order" label="Order" />
      <EditButton />
    </Datagrid>
  </List>
);

export const ToeflReadingQuestionEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <NumberInput source="toefl_reading_test_id" label="Passage ID" validate={required()} />
      <TextInput source="text" label="Question" multiline fullWidth rows={3} />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" label="Order" />
      <ArrayInput source="answers" label="Answer Options">
        <SimpleFormIterator inline>
          <TextInput source="text" label="Answer Text" sx={{ width: 400 }} />
          <TextInput source="answer_question" label="Explanation" sx={{ width: 200 }} />
          <BooleanInput source="true_false" label="Correct?" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const ToeflReadingQuestionCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="toefl_reading_test_id" label="Passage ID" validate={required()} />
      <TextInput source="text" label="Question" multiline fullWidth rows={3} />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
      <ArrayInput source="answers" label="Answer Options">
        <SimpleFormIterator inline>
          <TextInput source="text" label="Answer Text" sx={{ width: 400 }} />
          <TextInput source="answer_question" label="Explanation" sx={{ width: 200 }} />
          <BooleanInput source="true_false" label="Correct?" defaultValue={false} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
