import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const MembershipPlansFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Name" source="name" alwaysOn />
    <SelectInput label="Level" source="level" choices={[
      { id: 0, name: 'Free' },
      { id: 1, name: 'Silver' },
      { id: 2, name: 'Gold' },
    ]} />
    <SelectInput label="VIP" source="vip" choices={[
      { id: 0, name: 'No' },
      { id: 1, name: 'Yes' },
    ]} />
    <SelectInput label="Status" source="status" choices={[
      { id: 'Active', name: 'Active' },
      { id: 'Inactive', name: 'Inactive' },
    ]} />
  </Filter>
);

export const MembershipPlansList = () => (
  <List filters={<MembershipPlansFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="price" />
      <TextField source="level" />
      <TextField source="vip" />
      <TextField source="status" />
      <NumberField source="sort_ortder" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const MembershipPlansEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <NumberInput source="price" />
      <SelectInput source="level" choices={[
        { id: 0, name: 'Free' },
        { id: 1, name: 'Silver' },
        { id: 2, name: 'Gold' },
      ]} />
      <SelectInput source="vip" choices={[
        { id: 0, name: 'No' },
        { id: 1, name: 'Yes' },
      ]} />
      <RichTextInput source="description" />
      <SelectInput source="status" choices={[
        { id: 'Active', name: 'Active' },
        { id: 'Inactive', name: 'Inactive' },
      ]} />
      <NumberInput source="sort_ortder" />
    </SimpleForm>
  </Edit>
);

export const MembershipPlansCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <NumberInput source="price" />
      <SelectInput source="level" choices={[
        { id: 0, name: 'Free' },
        { id: 1, name: 'Silver' },
        { id: 2, name: 'Gold' },
      ]} />
      <SelectInput source="vip" choices={[
        { id: 0, name: 'No' },
        { id: 1, name: 'Yes' },
      ]} />
      <RichTextInput source="description" />
      <SelectInput source="status" choices={[
        { id: 'Active', name: 'Active' },
        { id: 'Inactive', name: 'Inactive' },
      ]} />
      <NumberInput source="sort_ortder" />
    </SimpleForm>
  </Create>
);
