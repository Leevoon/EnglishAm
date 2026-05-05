import React from 'react';
import { Admin, Resource } from 'react-admin';
import dataProvider from './dataProvider';
import authProvider from './authProvider';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage';

import { UserList, UserEdit, UserCreate } from './resources/users';
import { AdminList, AdminEdit, AdminCreate } from './resources/admins';
import { NewsList, NewsEdit, NewsCreate } from './resources/news';
import { GalleryList, GalleryEdit, GalleryCreate } from './resources/gallery';
import { FaqList, FaqEdit, FaqCreate } from './resources/faq';
import { SlideshowList, SlideshowEdit, SlideshowCreate } from './resources/slideshow';
import { MembershipList, MembershipEdit, MembershipCreate } from './resources/membership';
import { ContactMessagesList, ContactMessagesShow } from './resources/contactMessages';
import { LanguagesList, LanguagesEdit, LanguagesCreate } from './resources/languages';
import { TranslationsList, TranslationsEdit, TranslationsCreate } from './resources/translations';
import { TestList, TestEdit, TestCreate } from './resources/tests';
import { TestCategoryList, TestCategoryEdit, TestCategoryCreate } from './resources/testCategories';
import { ToeflReadingList, ToeflReadingEdit, ToeflReadingCreate } from './resources/toeflReading';
import { ToeflListeningList, ToeflListeningEdit, ToeflListeningCreate } from './resources/toeflListening';
import { IeltsReadingList, IeltsReadingEdit, IeltsReadingCreate } from './resources/ieltsReading';
import { LessonsList, LessonsEdit, LessonsCreate } from './resources/lessons';

import PeopleIcon from '@mui/icons-material/People';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import ArticleIcon from '@mui/icons-material/Article';
import PhotoIcon from '@mui/icons-material/PhotoLibrary';
import HelpIcon from '@mui/icons-material/Help';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import StarIcon from '@mui/icons-material/Star';
import InboxIcon from '@mui/icons-material/Inbox';
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';
import QuizIcon from '@mui/icons-material/Quiz';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import SchoolIcon from '@mui/icons-material/School';

export default function AdminApp() {
  return (
    <Admin
      basename="/admin"
      dataProvider={dataProvider}
      loginPage={LoginPage}
      authProvider={authProvider}
      dashboard={Dashboard}
      title="english.am admin"
      requireAuth
    >
      <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={PeopleIcon} />
      <Resource name="admins" list={AdminList} edit={AdminEdit} create={AdminCreate} icon={AdminIcon} />
      <Resource name="news" list={NewsList} edit={NewsEdit} create={NewsCreate} icon={ArticleIcon} />
      <Resource name="gallery" list={GalleryList} edit={GalleryEdit} create={GalleryCreate} icon={PhotoIcon} />
      <Resource name="faq" list={FaqList} edit={FaqEdit} create={FaqCreate} icon={HelpIcon} />
      <Resource name="slideshow" list={SlideshowList} edit={SlideshowEdit} create={SlideshowCreate} icon={SlideshowIcon} />
      <Resource name="membership" list={MembershipList} edit={MembershipEdit} create={MembershipCreate} icon={StarIcon} />
      <Resource name="contact-messages" list={ContactMessagesList} show={ContactMessagesShow} icon={InboxIcon} options={{ label: 'Contact Messages' }} />
      <Resource name="languages" list={LanguagesList} edit={LanguagesEdit} create={LanguagesCreate} icon={LanguageIcon} />
      <Resource name="translation" list={TranslationsList} edit={TranslationsEdit} create={TranslationsCreate} icon={TranslateIcon} options={{ label: 'Translations' }} />
      <Resource name="test" list={TestList} edit={TestEdit} create={TestCreate} icon={QuizIcon} options={{ label: 'Test Questions' }} />
      <Resource name="test-category" list={TestCategoryList} edit={TestCategoryEdit} create={TestCategoryCreate} icon={CategoryIcon} options={{ label: 'Tests (Catalog)' }} />
      <Resource name="toefl-reading" list={ToeflReadingList} edit={ToeflReadingEdit} create={ToeflReadingCreate} icon={MenuBookIcon} options={{ label: 'TOEFL Reading' }} />
      <Resource name="toefl-listening" list={ToeflListeningList} edit={ToeflListeningEdit} create={ToeflListeningCreate} icon={HeadphonesIcon} options={{ label: 'TOEFL Listening' }} />
      <Resource name="ielts-reading" list={IeltsReadingList} edit={IeltsReadingEdit} create={IeltsReadingCreate} icon={MenuBookIcon} options={{ label: 'IELTS Reading' }} />
      <Resource name="lessons" list={LessonsList} edit={LessonsEdit} create={LessonsCreate} icon={SchoolIcon} />
    </Admin>
  );
}
