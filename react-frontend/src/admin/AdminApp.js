import React from 'react';
import { Admin, Resource } from 'react-admin';
import { BrowserRouter } from 'react-router-dom';

// Providers
import dataProvider from './dataProvider';
import authProvider from './authProvider';

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

// Icons
import CategoryIcon from '@mui/icons-material/Category';
import QuizIcon from '@mui/icons-material/Quiz';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import LockIcon from '@mui/icons-material/Lock';
import HistoryIcon from '@mui/icons-material/History';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import EditNoteIcon from '@mui/icons-material/EditNote';

const AdminApp = () => {
  return (
    <BrowserRouter basename="/admin">
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        dashboard={Dashboard}
        requireAuth
        title="English.am Admin"
        disableTelemetry
      >
      {/* Existing Resources */}
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

      {/* CMS Content */}
      <Resource
        name="news"
        list={NewsList}
        edit={NewsEdit}
        create={NewsCreate}
        icon={NewspaperIcon}
        options={{ label: 'News' }}
      />
      <Resource
        name="slideshow"
        list={SlideshowList}
        edit={SlideshowEdit}
        create={SlideshowCreate}
        icon={SlideshowIcon}
        options={{ label: 'Slideshow' }}
      />
      <Resource
        name="gallery"
        list={GalleryList}
        edit={GalleryEdit}
        create={GalleryCreate}
        icon={PhotoLibraryIcon}
        options={{ label: 'Gallery' }}
      />
      <Resource
        name="membership-plans"
        list={MembershipPlansList}
        edit={MembershipPlansEdit}
        create={MembershipPlansCreate}
        icon={CardMembershipIcon}
        options={{ label: 'Membership Plans' }}
      />
      <Resource
        name="membership-access"
        list={MembershipAccessList}
        edit={MembershipAccessEdit}
        create={MembershipAccessCreate}
        icon={LockIcon}
        options={{ label: 'Membership Access' }}
      />
      <Resource
        name="user-history"
        list={UserHistoryList}
        icon={HistoryIcon}
        options={{ label: 'User History' }}
      />

      {/* TOEFL */}
      <Resource
        name="toefl-reading"
        list={ToeflReadingList}
        edit={ToeflReadingEdit}
        create={ToeflReadingCreate}
        icon={MenuBookIcon}
        options={{ label: 'TOEFL Reading' }}
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
        icon={HeadphonesIcon}
        options={{ label: 'TOEFL Listening' }}
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
        icon={RecordVoiceOverIcon}
        options={{ label: 'TOEFL Speaking' }}
      />
      <Resource
        name="toefl-writing"
        list={ToeflWritingList}
        edit={ToeflWritingEdit}
        create={ToeflWritingCreate}
        icon={EditNoteIcon}
        options={{ label: 'TOEFL Writing' }}
      />

      {/* IELTS */}
      <Resource
        name="ielts-reading"
        list={IeltsReadingList}
        edit={IeltsReadingEdit}
        create={IeltsReadingCreate}
        icon={MenuBookIcon}
        options={{ label: 'IELTS Reading' }}
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
        icon={HeadphonesIcon}
        options={{ label: 'IELTS Listening' }}
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
        icon={RecordVoiceOverIcon}
        options={{ label: 'IELTS Speaking' }}
      />
      <Resource
        name="ielts-writing"
        list={IeltsWritingList}
        edit={IeltsWritingEdit}
        create={IeltsWritingCreate}
        icon={EditNoteIcon}
        options={{ label: 'IELTS Writing' }}
      />
    </Admin>
    </BrowserRouter>
  );
};

export default AdminApp;
