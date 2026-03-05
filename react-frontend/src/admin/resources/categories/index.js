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
  Filter,
  useRecordContext,
} from 'react-admin';

// Filter component for searching
const CategoryFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
  </Filter>
);

// Status field display
const StatusField = () => {
  const record = useRecordContext();
  return <span>{record?.status === 1 ? 'Active' : 'Inactive'}</span>;
};

// List view
export const CategoryList = () => (
  <List filters={<CategoryFilter />} sort={{ field: 'id', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="name" />
      <NumberField source="parent_id" label="Parent ID" />
      <StatusField source="status" label="Status" />
      <NumberField source="sort_order" label="Order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// Edit view
export const CategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" fullWidth required />
      <NumberInput source="parent_id" label="Parent ID" defaultValue={0} />
      <SelectInput
        source="status"
        choices={[
          { id: 1, name: 'Active' },
          { id: 0, name: 'Inactive' },
        ]}
      />
      <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
    </SimpleForm>
  </Edit>
);

// Create view
export const CategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" fullWidth required />
      <NumberInput source="parent_id" label="Parent ID" defaultValue={0} />
      <SelectInput
        source="status"
        choices={[
          { id: 1, name: 'Active' },
          { id: 0, name: 'Inactive' },
        ]}
        defaultValue={1}
      />
      <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
