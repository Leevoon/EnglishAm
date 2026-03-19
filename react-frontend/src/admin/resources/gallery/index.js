import React from 'react';
import {
  List, Datagrid, TextField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, SelectInput, Filter,
  useRecordContext,
} from 'react-admin';

const GalleryFilter = (props) => (
  <Filter {...props}>
    <SelectInput label="Status" source="status" choices={[
      { id: 'Active', name: 'Active' },
      { id: 'Inactive', name: 'Inactive' },
    ]} />
  </Filter>
);

export const GalleryList = () => (
  <List filters={<GalleryFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="image" />
      <TextField source="status" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const GalleryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="image" />
      <SelectInput source="status" choices={[
        { id: 'Active', name: 'Active' },
        { id: 'Inactive', name: 'Inactive' },
      ]} />
    </SimpleForm>
  </Edit>
);

export const GalleryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="image" />
      <SelectInput source="status" choices={[
        { id: 'Active', name: 'Active' },
        { id: 'Inactive', name: 'Inactive' },
      ]} />
    </SimpleForm>
  </Create>
);
