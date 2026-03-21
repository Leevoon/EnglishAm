import React from 'react';
import {
  List, Datagrid, NumberField,
  Edit, Create, SimpleForm, NumberInput, SelectInput,
  required, EditButton,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';
import { StatusField, HtmlPreviewField, ViewRelatedButton } from '../../components';

const filters = [
  <NumberInput source="toefl_reding_id" label="Reading Section ID" alwaysOn />,
];

export const ToeflReadingTestList = () => (
  <List filters={filters} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <NumberField source="toefl_reding_id" label="Section ID" />
      <HtmlPreviewField source="text" label="Passage Preview" maxLength={120} />
      <StatusField source="status" />
      <NumberField source="sort_order" label="Order" />
      <ViewRelatedButton resource="toefl-reading-questions" filterField="toefl_reading_test_id" label="Questions" />
      <EditButton />
    </Datagrid>
  </List>
);

export const ToeflReadingTestEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <NumberInput source="toefl_reding_id" label="Reading Section ID" validate={required()} />
      <RichTextInput source="text" label="Passage Text" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" label="Order" />
    </SimpleForm>
  </Edit>
);

export const ToeflReadingTestCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="toefl_reding_id" label="Reading Section ID" validate={required()} />
      <RichTextInput source="text" label="Passage Text" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
