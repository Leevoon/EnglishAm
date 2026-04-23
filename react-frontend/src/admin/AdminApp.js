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
import {
  HomePageCategoriesList,
  HomePageCategoriesEdit,
  HomePageCategoriesCreate,
} from './resources/homePageCategories';
import {
  ContactMessagesList,
  ContactMessagesShow,
  ContactMessagesEdit,
} from './resources/contactMessages';

// TOEFL Combined Resources
import { ToeflReadingList, ToeflReadingEdit, ToeflReadingCreate } from './resources/toeflReading';
import { ToeflListeningList, ToeflListeningEdit, ToeflListeningCreate } from './resources/toeflListening';
import { ToeflSpeakingList, ToeflSpeakingEdit, ToeflSpeakingCreate } from './resources/toeflSpeaking';
import { ToeflWritingList, ToeflWritingEdit, ToeflWritingCreate } from './resources/toeflWriting';

// TOEFL Sub-resources (kept for dataProvider access, edit from combined pages)
import { ToeflReadingTestEdit, ToeflReadingTestCreate } from './resources/toeflReadingTests';
import { ToeflReadingQuestionEdit, ToeflReadingQuestionCreate } from './resources/toeflReadingQuestions';
import { ToeflListeningTestEdit, ToeflListeningTestCreate } from './resources/toeflListeningTests';
import { ToeflListeningQuestionEdit, ToeflListeningQuestionCreate } from './resources/toeflListeningQuestions';

// IELTS Combined Resources
import { IeltsReadingList, IeltsReadingEdit, IeltsReadingCreate } from './resources/ieltsReading';
import { IeltsListeningList, IeltsListeningEdit, IeltsListeningCreate } from './resources/ieltsListening';
import { IeltsSpeakingList, IeltsSpeakingEdit, IeltsSpeakingCreate } from './resources/ieltsSpeaking';
import { IeltsWritingList, IeltsWritingEdit, IeltsWritingCreate } from './resources/ieltsWriting';

// IELTS Sub-resources (kept for dataProvider access)
import { IeltsReadingQuestionEdit, IeltsReadingQuestionCreate } from './resources/ieltsReadingQuestions';
import { IeltsListeningQuestionEdit, IeltsListeningQuestionCreate } from './resources/ieltsListeningQuestions';

// Section Tests
import {
  AudioTestList, AudioTestEdit, AudioTestCreate,
  SynonymTestList, SynonymTestEdit, SynonymTestCreate,
  AntonymTestList, AntonymTestEdit, AntonymTestCreate,
  GeneralEnglishTestList, GeneralEnglishTestEdit, GeneralEnglishTestCreate,
  ProfessionalEnglishTestList, ProfessionalEnglishTestEdit, ProfessionalEnglishTestCreate,
  PhotoTestList, PhotoTestEdit, PhotoTestCreate,
} from './resources/sectionTests';

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
      <Resource
        name="home-page-categories"
        list={HomePageCategoriesList}
        edit={HomePageCategoriesEdit}
        create={HomePageCategoriesCreate}
        options={{ label: 'Home Page Categories' }}
      />
      <Resource
        name="contact-messages"
        list={ContactMessagesList}
        show={ContactMessagesShow}
        edit={ContactMessagesEdit}
        options={{ label: 'Contact email' }}
        recordRepresentation={(r) => `${r.subject} — ${r.email}`}
      />

      {/* Section Tests */}
      <Resource
        name="audio-tests"
        list={AudioTestList}
        edit={AudioTestEdit}
        create={AudioTestCreate}
        options={{ label: 'Audio Tests' }}
        recordRepresentation="name"
      />
      <Resource
        name="synonym-tests"
        list={SynonymTestList}
        edit={SynonymTestEdit}
        create={SynonymTestCreate}
        options={{ label: 'Synonyms' }}
        recordRepresentation="name"
      />
      <Resource
        name="antonym-tests"
        list={AntonymTestList}
        edit={AntonymTestEdit}
        create={AntonymTestCreate}
        options={{ label: 'Antonyms' }}
        recordRepresentation="name"
      />
      <Resource
        name="general-english-tests"
        list={GeneralEnglishTestList}
        edit={GeneralEnglishTestEdit}
        create={GeneralEnglishTestCreate}
        options={{ label: 'General English' }}
        recordRepresentation="name"
      />
      <Resource
        name="professional-english-tests"
        list={ProfessionalEnglishTestList}
        edit={ProfessionalEnglishTestEdit}
        create={ProfessionalEnglishTestCreate}
        options={{ label: 'Professional English' }}
        recordRepresentation="name"
      />
      <Resource
        name="photo-tests"
        list={PhotoTestList}
        edit={PhotoTestEdit}
        create={PhotoTestCreate}
        options={{ label: 'Photo Tests' }}
        recordRepresentation="name"
      />

      {/* TOEFL - Combined pages */}
      <Resource
        name="toefl-reading"
        list={ToeflReadingList}
        edit={ToeflReadingEdit}
        create={ToeflReadingCreate}
        options={{ label: 'TOEFL Reading' }}
        recordRepresentation="name"
      />
      <Resource
        name="toefl-reading-tests"
        edit={ToeflReadingTestEdit}
        create={ToeflReadingTestCreate}
        options={{ label: 'TOEFL Reading Passages' }}
      />
      <Resource
        name="toefl-reading-questions"
        edit={ToeflReadingQuestionEdit}
        create={ToeflReadingQuestionCreate}
        options={{ label: 'TOEFL Reading Questions' }}
      />
      <Resource
        name="toefl-listening"
        list={ToeflListeningList}
        edit={ToeflListeningEdit}
        create={ToeflListeningCreate}
        options={{ label: 'TOEFL Listening' }}
        recordRepresentation="name"
      />
      <Resource
        name="toefl-listening-tests"
        edit={ToeflListeningTestEdit}
        create={ToeflListeningTestCreate}
        options={{ label: 'TOEFL Listening Parts' }}
      />
      <Resource
        name="toefl-listening-questions"
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

      {/* IELTS - Combined pages */}
      <Resource
        name="ielts-reading"
        list={IeltsReadingList}
        edit={IeltsReadingEdit}
        create={IeltsReadingCreate}
        options={{ label: 'IELTS Reading' }}
        recordRepresentation="name"
      />
      <Resource
        name="ielts-reading-questions"
        edit={IeltsReadingQuestionEdit}
        create={IeltsReadingQuestionCreate}
        options={{ label: 'IELTS Reading Questions' }}
      />
      <Resource
        name="ielts-listening"
        list={IeltsListeningList}
        edit={IeltsListeningEdit}
        create={IeltsListeningCreate}
        options={{ label: 'IELTS Listening' }}
        recordRepresentation="name"
      />
      <Resource
        name="ielts-listening-questions"
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
