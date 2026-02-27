import React from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';

// Providers
import dataProvider from './dataProvider';
import authProvider from './authProvider';

// Resources
import { CategoryList, CategoryEdit, CategoryCreate } from './resources/categories';
import { TestCategoryList, TestCategoryEdit, TestCategoryCreate } from './resources/testCategories';
import { TestList, TestEdit, TestCreate } from './resources/tests';
import { TestLevelList, TestLevelEdit, TestLevelCreate } from './resources/testLevels';
import { LanguageList, LanguageEdit, LanguageCreate } from './resources/languages';
import { UserList, UserEdit, UserCreate } from './resources/users';
import { AdminUserList, AdminUserEdit, AdminUserCreate } from './resources/admins';

// Dashboard
import Dashboard from './Dashboard';

// Icons
import CategoryIcon from '@mui/icons-material/Category';
import QuizIcon from '@mui/icons-material/Quiz';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminApp = () => {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      basename="/admin"
      title="English.am Admin"
      disableTelemetry
    >
      <Resource
        name="categories"
        list={CategoryList}
        edit={CategoryEdit}
        create={CategoryCreate}
        icon={CategoryIcon}
        options={{ label: 'Categories' }}
      />
      <Resource
        name="test-categories"
        list={TestCategoryList}
        edit={TestCategoryEdit}
        create={TestCategoryCreate}
        icon={ListAltIcon}
        options={{ label: 'Test Categories' }}
      />
      <Resource
        name="tests"
        list={TestList}
        edit={TestEdit}
        create={TestCreate}
        icon={QuizIcon}
        options={{ label: 'Tests' }}
      />
      <Resource
        name="test-levels"
        list={TestLevelList}
        edit={TestLevelEdit}
        create={TestLevelCreate}
        icon={SignalCellularAltIcon}
        options={{ label: 'Test Levels' }}
      />
      <Resource
        name="languages"
        list={LanguageList}
        edit={LanguageEdit}
        create={LanguageCreate}
        icon={LanguageIcon}
        options={{ label: 'Languages' }}
      />
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        icon={PeopleIcon}
        options={{ label: 'Users' }}
      />
      <Resource
        name="admins"
        list={AdminUserList}
        edit={AdminUserEdit}
        create={AdminUserCreate}
        icon={AdminPanelSettingsIcon}
        options={{ label: 'Admins' }}
      />
    </Admin>
  );
};

export default AdminApp;

