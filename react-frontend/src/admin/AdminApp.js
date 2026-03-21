import React from 'react';
import { Admin, Resource } from 'react-admin';
import { BrowserRouter } from 'react-router-dom';

// Providers
import dataProvider from './dataProvider';
import authProvider from './authProvider';

// Layout
import CustomLayout from './CustomLayout';

// Existing Resources
import { CategoryList, CategoryEdit, CategoryCreate } from './resources/categories';
import { TestCategoryList, TestCategoryEdit, TestCategoryCreate } from './resources/testCategories';
import { TestList, TestEdit, TestCreate } from './resources/tests';
import { TestLevelList, TestLevelEdit, TestLevelCreate } from './resources/testLevels';
import { LanguageList, LanguageEdit, LanguageCreate } from './resources/languages';
import { UserList, UserEdit, UserCreate } from './resources/users';
import { AdminUserList, AdminUserEdit, AdminUserCreate } from './resources/admins';

// CMS Resources
import { NewsList, NewsEdit, NewsCreate } from './resources/news';
import { SlideshowList, SlideshowEdit, SlideshowCreate } from './resources/slideshow';
import { GalleryList, GalleryEdit, GalleryCreate } from './resources/gallery';
import { MembershipPlansList, MembershipPlansEdit, MembershipPlansCreate } from './resources/membershipPlans';
import { MembershipAccessList, MembershipAccessEdit, MembershipAccessCreate } from './resources/membershipAccess';
import { UserHistoryList } from './resources/userHistory';

// TOEFL Resources
import { ToeflReadingList, ToeflReadingEdit, ToeflReadingCreate } from './resources/toeflReading';
import { ToeflReadingTestList, ToeflReadingTestEdit, ToeflReadingTestCreate } from './resources/toeflReadingTests';
import { ToeflReadingQuestionList, ToeflReadingQuestionEdit, ToeflReadingQuestionCreate } from './resources/toeflReadingQuestions';
import { ToeflListeningList, ToeflListeningEdit, ToeflListeningCreate } from './resources/toeflListening';
import { ToeflListeningTestList, ToeflListeningTestEdit, ToeflListeningTestCreate } from './resources/toeflListeningTests';
import { ToeflListeningQuestionList, ToeflListeningQuestionEdit, ToeflListeningQuestionCreate } from './resources/toeflListeningQuestions';
import { ToeflSpeakingList, ToeflSpeakingEdit, ToeflSpeakingCreate } from './resources/toeflSpeaking';
import { ToeflWritingList, ToeflWritingEdit, ToeflWritingCreate } from './resources/toeflWriting';

// IELTS Resources
import { IeltsReadingList, IeltsReadingEdit, IeltsReadingCreate } from './resources/ieltsReading';
import { IeltsReadingQuestionList, IeltsReadingQuestionEdit, IeltsReadingQuestionCreate } from './resources/ieltsReadingQuestions';
import { IeltsListeningList, IeltsListeningEdit, IeltsListeningCreate } from './resources/ieltsListening';
import { IeltsListeningQuestionList, IeltsListeningQuestionEdit, IeltsListeningQuestionCreate } from './resources/ieltsListeningQuestions';
import { IeltsSpeakingList, IeltsSpeakingEdit, IeltsSpeakingCreate } from './resources/ieltsSpeaking';
import { IeltsWritingList, IeltsWritingEdit, IeltsWritingCreate } from './resources/ieltsWriting';

// Dashboard
import Dashboard from './Dashboard';

const AdminApp = () => {
  return (
    <BrowserRouter basename="/admin">
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        dashboard={Dashboard}
        layout={CustomLayout}
        requireAuth
        title="English.am Admin"
        disableTelemetry
      >
      {/* Content Management */}
      <Resource
        name="categories"
        list={CategoryList}
        edit={CategoryEdit}
        create={CategoryCreate}
        options={{ label: 'Categories' }}
        recordRepresentation="name"
      />
      <Resource
        name="test-categories"
        list={TestCategoryList}
        edit={TestCategoryEdit}
        create={TestCategoryCreate}
        options={{ label: 'Test Categories' }}
        recordRepresentation="name"
      />
      <Resource
        name="tests"
        list={TestList}
        edit={TestEdit}
        create={TestCreate}
        options={{ label: 'Tests' }}
        recordRepresentation="question"
      />
      <Resource
        name="test-levels"
        list={TestLevelList}
        edit={TestLevelEdit}
        create={TestLevelCreate}
        options={{ label: 'Test Levels' }}
        recordRepresentation="name"
      />
      <Resource
        name="languages"
        list={LanguageList}
        edit={LanguageEdit}
        create={LanguageCreate}
        options={{ label: 'Languages' }}
        recordRepresentation="name"
      />

      {/* Users & Access */}
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        options={{ label: 'Users' }}
        recordRepresentation="email"
      />
      <Resource
        name="admins"
        list={AdminUserList}
        edit={AdminUserEdit}
        create={AdminUserCreate}
        options={{ label: 'Admins' }}
        recordRepresentation="email"
      />
      <Resource
        name="user-history"
        list={UserHistoryList}
        options={{ label: 'User History' }}
      />
      <Resource
        name="membership-plans"
        list={MembershipPlansList}
        edit={MembershipPlansEdit}
        create={MembershipPlansCreate}
        options={{ label: 'Membership Plans' }}
        recordRepresentation="name"
      />
      <Resource
        name="membership-access"
        list={MembershipAccessList}
        edit={MembershipAccessEdit}
        create={MembershipAccessCreate}
        options={{ label: 'Membership Access' }}
      />

      {/* CMS */}
      <Resource
        name="news"
        list={NewsList}
        edit={NewsEdit}
        create={NewsCreate}
        options={{ label: 'News' }}
        recordRepresentation="title"
      />
      <Resource
        name="slideshow"
        list={SlideshowList}
        edit={SlideshowEdit}
        create={SlideshowCreate}
        options={{ label: 'Slideshow' }}
      />
      <Resource
        name="gallery"
        list={GalleryList}
        edit={GalleryEdit}
        create={GalleryCreate}
        options={{ label: 'Gallery' }}
      />

      {/* TOEFL */}
      <Resource
        name="toefl-reading"
        list={ToeflReadingList}
        edit={ToeflReadingEdit}
        create={ToeflReadingCreate}
        options={{ label: 'TOEFL Reading Sections' }}
        recordRepresentation="name"
      />
      <Resource
        name="toefl-reading-tests"
        list={ToeflReadingTestList}
        edit={ToeflReadingTestEdit}
        create={ToeflReadingTestCreate}
        options={{ label: 'TOEFL Reading Passages' }}
      />
      <Resource
        name="toefl-reading-questions"
        list={ToeflReadingQuestionList}
        edit={ToeflReadingQuestionEdit}
        create={ToeflReadingQuestionCreate}
        options={{ label: 'TOEFL Reading Questions' }}
      />
      <Resource
        name="toefl-listening"
        list={ToeflListeningList}
        edit={ToeflListeningEdit}
        create={ToeflListeningCreate}
        options={{ label: 'TOEFL Listening Sections' }}
        recordRepresentation="name"
      />
      <Resource
        name="toefl-listening-tests"
        list={ToeflListeningTestList}
        edit={ToeflListeningTestEdit}
        create={ToeflListeningTestCreate}
        options={{ label: 'TOEFL Listening Parts' }}
      />
      <Resource
        name="toefl-listening-questions"
        list={ToeflListeningQuestionList}
        edit={ToeflListeningQuestionEdit}
        create={ToeflListeningQuestionCreate}
        options={{ label: 'TOEFL Listening Questions' }}
      />
      <Resource
        name="toefl-speaking"
        list={ToeflSpeakingList}
        edit={ToeflSpeakingEdit}
        create={ToeflSpeakingCreate}
        options={{ label: 'TOEFL Speaking' }}
        recordRepresentation="name"
      />
      <Resource
        name="toefl-writing"
        list={ToeflWritingList}
        edit={ToeflWritingEdit}
        create={ToeflWritingCreate}
        options={{ label: 'TOEFL Writing' }}
        recordRepresentation="name"
      />

      {/* IELTS */}
      <Resource
        name="ielts-reading"
        list={IeltsReadingList}
        edit={IeltsReadingEdit}
        create={IeltsReadingCreate}
        options={{ label: 'IELTS Reading Sections' }}
        recordRepresentation="name"
      />
      <Resource
        name="ielts-reading-questions"
        list={IeltsReadingQuestionList}
        edit={IeltsReadingQuestionEdit}
        create={IeltsReadingQuestionCreate}
        options={{ label: 'IELTS Reading Questions' }}
      />
      <Resource
        name="ielts-listening"
        list={IeltsListeningList}
        edit={IeltsListeningEdit}
        create={IeltsListeningCreate}
        options={{ label: 'IELTS Listening Sections' }}
        recordRepresentation="name"
      />
      <Resource
        name="ielts-listening-questions"
        list={IeltsListeningQuestionList}
        edit={IeltsListeningQuestionEdit}
        create={IeltsListeningQuestionCreate}
        options={{ label: 'IELTS Listening Questions' }}
      />
      <Resource
        name="ielts-speaking"
        list={IeltsSpeakingList}
        edit={IeltsSpeakingEdit}
        create={IeltsSpeakingCreate}
        options={{ label: 'IELTS Speaking' }}
        recordRepresentation="name"
      />
      <Resource
        name="ielts-writing"
        list={IeltsWritingList}
        edit={IeltsWritingEdit}
        create={IeltsWritingCreate}
        options={{ label: 'IELTS Writing' }}
        recordRepresentation="name"
      />
    </Admin>
    </BrowserRouter>
  );
};

export default AdminApp;
