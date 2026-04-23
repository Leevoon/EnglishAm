import React from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  EditButton,
} from 'react-admin';
import { useSearchParams } from 'react-router-dom';
import { StatusField } from '../../components';

const filters = [
  <TextInput source="q" label="Search" alwaysOn />,
];

// When the URL has ?browse=1 (Tests → Tests menu), clicking a row drills into
// the child test_categories for that header. Without it (Catalog → Headers),
// rowClick opens Edit as before.
export const CategoryList = () => {
  const [searchParams] = useSearchParams();
  const isBrowse = searchParams.get('browse') === '1';

  const rowClick = isBrowse
    ? (id) =>
        `/test-categories?filter=${encodeURIComponent(JSON.stringify({ category_id: id }))}&browse=1`
    : 'edit';

  return (
    <List
      filters={filters}
      sort={{ field: 'id', order: 'DESC' }}
      perPage={25}
      title={isBrowse ? 'Tests — pick a header' : undefined}
    >
      <Datagrid rowClick={rowClick}>
        <NumberField source="id" />
        <TextField source="name" />
        <NumberField source="parent_id" label="Parent ID" />
        <StatusField source="status" />
        <NumberField source="sort_order" label="Order" />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export const CategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" fullWidth required />
      <NumberInput source="parent_id" label="Parent ID" defaultValue={0} />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Edit>
);

export const CategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" fullWidth required />
      <NumberInput source="parent_id" label="Parent ID" defaultValue={0} />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
