import React from 'react';
import {
  List, Datagrid, TextField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, SelectInput, Filter,
  useRecordContext,
} from 'react-admin';

const SlideshowFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Value" source="value" alwaysOn />
    <SelectInput label="Status" source="status" choices={[
      { id: 'Active', name: 'Active' },
      { id: 'Inactive', name: 'Inactive' },
    ]} />
  </Filter>
);

export const SlideshowList = () => (
  <List filters={<SlideshowFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="value" />
      <TextField source="status" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const SlideshowEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="value" />
      <SelectInput source="status" choices={[
        { id: 'Active', name: 'Active' },
        { id: 'Inactive', name: 'Inactive' },
      ]} />
    </SimpleForm>
  </Edit>
);

export const SlideshowCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="value" />
      <SelectInput source="status" choices={[
        { id: 'Active', name: 'Active' },
        { id: 'Inactive', name: 'Inactive' },
      ]} />
    </SimpleForm>
  </Create>
);
