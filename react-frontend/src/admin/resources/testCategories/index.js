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
  ImageField,
  ImageInput,
  Filter,
  useRecordContext,
} from 'react-admin';

const TestCategoryFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
  </Filter>
);

const StatusField = () => {
  const record = useRecordContext();
  return <span>{record?.status === 1 ? 'Active' : 'Inactive'}</span>;
};

export const TestCategoryList = () => (
  <List filters={<TestCategoryFilter />} sort={{ field: 'id', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <NumberField source="parent_id" label="Parent ID" />
      <NumberField source="category_id" label="Category ID" />
      <StatusField source="status" label="Status" />
      <NumberField source="sort_order" label="Order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const TestCategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" fullWidth required />
      <TextInput source="description" multiline rows={4} fullWidth />
      <NumberInput source="parent_id" label="Parent ID" defaultValue={0} />
      <NumberInput source="category_id" label="Category ID" defaultValue={0} />
      <TextInput source="image" label="Image Path" fullWidth />
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

export const TestCategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" fullWidth required />
      <TextInput source="description" multiline rows={4} fullWidth />
      <NumberInput source="parent_id" label="Parent ID" defaultValue={0} />
      <NumberInput source="category_id" label="Category ID" defaultValue={0} />
      <TextInput source="image" label="Image Path" fullWidth />
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

