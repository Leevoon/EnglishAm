// Mock data for testing without database
// Data sourced from db/db_english_sample.sql to match real DB format

const mockData = {
  languages: [
    { id: 1, name: 'English', iso: 'en', status: 1, sort_order: 0, image: 'f036b632a35dbed62095df7c43e6656b.jpg' },
    { id: 2, name: 'Русский', iso: 'ru', status: 1, sort_order: 0, image: '4bca1a649f93f40fdcd28a4def0d730b.jpg' },
    { id: 3, name: 'Հայերեն', iso: 'am', status: 1, sort_order: 0, image: '8218b5ec377f730d9f1dc777d8d2ce8b.jpg' },
    { id: 5, name: '中文', iso: 'cn', status: 1, sort_order: 0, image: 'd7b00d7e255e48bcab9082f11ba68b53.jpg' },
    { id: 6, name: 'हिन्दी', iso: 'in', status: 1, sort_order: 0, image: '6646f9cd8ec1b5a2fc56ea4e92126977.jpg' },
    { id: 7, name: 'Deutsch', iso: 'de', status: 1, sort_order: 0, image: 'ccb4d6f34c345d1dcf1a7c0f11c54c9a.jpg' },
    { id: 8, name: 'اللغة العربية', iso: 'eg', status: 1, sort_order: 0, image: '998ee4d06b9e75555abc823cb7dd8f80.jpg' }
  ],

  // Categories from `category` table - parent_id=0 means top-level
  categories: [
    { id: 1, parent_id: 0, status: 1, sort_order: 0, key: 'test', show_scool_part: 0, show_scool_level_or_filter: 0, has_level: 1, image: null },
    { id: 2, parent_id: 1, status: 1, sort_order: 1, key: null, show_scool_part: 1, show_scool_level_or_filter: 0, has_level: 1, image: null },
    { id: 3, parent_id: 1, status: 1, sort_order: 2, key: null, show_scool_part: 1, show_scool_level_or_filter: 1, has_level: 1, image: null },
    { id: 4, parent_id: 1, status: 1, sort_order: 4, key: null, show_scool_part: 1, show_scool_level_or_filter: 1, has_level: 1, image: null },
    { id: 6, parent_id: 1, status: 0, sort_order: 5, key: null, show_scool_part: 1, show_scool_level_or_filter: 1, has_level: 1, image: null },
    { id: 9, parent_id: 1, status: 0, sort_order: 3, key: null, show_scool_part: 1, show_scool_level_or_filter: 1, has_level: 1, image: 'dd96faa68c114a7bd3589645e3f6b327.jpg' },
    { id: 11, parent_id: 1, status: 0, sort_order: 6, key: null, show_scool_part: 1, show_scool_level_or_filter: 1, has_level: 1, image: null },
    { id: 15, parent_id: 1, status: 1, sort_order: 0, key: null, show_scool_part: 0, show_scool_level_or_filter: 0, has_level: 1, image: null },
    { id: 17, parent_id: 1, status: 0, sort_order: 0, key: null, show_scool_part: 0, show_scool_level_or_filter: 0, has_level: 1, image: 'b10d95e999955f8d22e1be952fd4d5aa.JPG' },
    { id: 19, parent_id: 1, status: 1, sort_order: 0, key: null, show_scool_part: 0, show_scool_level_or_filter: 0, has_level: 1, image: null }
  ],

  categoryLabels: [
    { id: 224, category_id: 11, language_id: 1, value: 'MOVIE TESTS' },
    { id: 225, category_id: 11, language_id: 2, value: 'КИНО ТЕСТЫ' },
    { id: 226, category_id: 11, language_id: 3, value: 'ԿԻՆՈ ԹԵdelays' },
    { id: 233, category_id: 6, language_id: 1, value: 'MISCELLANEOUS TESTS' },
    { id: 234, category_id: 6, language_id: 2, value: 'РАЗНООБРАЗНЫЕ ТЕСТЫ' },
    { id: 235, category_id: 6, language_id: 3, value: 'ԲԱԶՄdelays Թdelays' },
    { id: 272, category_id: 9, language_id: 1, value: 'KID ENGLISH' },
    { id: 273, category_id: 9, language_id: 2, value: 'АНГЛИЙСКИЙ ДЛЯ ДЕТЕЙ' },
    { id: 274, category_id: 9, language_id: 3, value: 'ՓՈdelays DELAYS' },
    { id: 284, category_id: 17, language_id: 1, value: 'IQ' },
    { id: 285, category_id: 17, language_id: 2, value: 'IQ' },
    { id: 286, category_id: 17, language_id: 3, value: 'IQ' },
    // Category 1 labels (Tests)
    { id: 400, category_id: 1, language_id: 1, value: 'TESTS' },
    { id: 401, category_id: 1, language_id: 2, value: 'ТЕСТЫ' },
    { id: 402, category_id: 1, language_id: 3, value: 'Թdelays' },
    // Category 2 labels (Audio Tests)
    { id: 403, category_id: 2, language_id: 1, value: 'AUDIO TESTS' },
    { id: 404, category_id: 2, language_id: 2, value: 'АУДИО ТЕСТЫ' },
    { id: 405, category_id: 2, language_id: 3, value: ' DELAYS DELAYS' },
    // Category 3 labels (Synonyms)
    { id: 406, category_id: 3, language_id: 1, value: 'SYNONYMS' },
    { id: 407, category_id: 3, language_id: 2, value: 'СИНОНИМЫ' },
    { id: 408, category_id: 3, language_id: 3, value: 'DELAYS' },
    // Category 4 labels (Antonyms)
    { id: 409, category_id: 4, language_id: 1, value: 'ANTONYMS' },
    { id: 410, category_id: 4, language_id: 2, value: 'АНТОНИМЫ' },
    { id: 411, category_id: 4, language_id: 3, value: 'DELAYS' },
    // Category 15 labels (Grammar)
    { id: 412, category_id: 15, language_id: 1, value: 'GRAMMAR' },
    { id: 413, category_id: 15, language_id: 2, value: 'ГРАММАТИКА' },
    { id: 414, category_id: 15, language_id: 3, value: 'ՔDELAYS' },
    // Category 19 labels (General English)
    { id: 415, category_id: 19, language_id: 1, value: 'GENERAL ENGLISH' },
    { id: 416, category_id: 19, language_id: 2, value: 'ОБЩИЙ АНГЛИЙСКИЙ' },
    { id: 417, category_id: 19, language_id: 3, value: 'ԸՆDELAYS DELAYS' }
  ],

  // Test categories from `test_category` table
  testCategories: [
    { id: 8, category_id: 2, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 13, category_id: 2, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 26, category_id: 2, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 27, category_id: 2, parent_id: 0, level_id: 3, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 28, category_id: 2, parent_id: 0, level_id: 3, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 29, category_id: 3, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 30, category_id: 3, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 31, category_id: 3, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 32, category_id: 3, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 33, category_id: 3, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 34, category_id: 3, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 35, category_id: 3, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 36, category_id: 3, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 37, category_id: 3, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 38, category_id: 3, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 39, category_id: 4, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 40, category_id: 4, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 41, category_id: 4, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 42, category_id: 4, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null },
    { id: 43, category_id: 4, parent_id: 0, level_id: 0, status: 1, sort_order: 0, time: '00:10:00', view_count: 0, image: null }
  ],

  testCategoryLabels: [
    { id: 100, test_category_id: 8, language_id: 1, name: 'Audio Test 1', description: '', seo_name: 'AudioTest1' },
    { id: 101, test_category_id: 8, language_id: 2, name: 'Аудио Тест 1', description: '', seo_name: 'АудиоТест1' },
    { id: 102, test_category_id: 8, language_id: 3, name: '', description: '', seo_name: '' },
    { id: 103, test_category_id: 13, language_id: 1, name: 'Audio Test 2', description: '', seo_name: 'AudioTest2' },
    { id: 104, test_category_id: 13, language_id: 2, name: 'Аудио Тест 2', description: '', seo_name: '' },
    { id: 105, test_category_id: 13, language_id: 3, name: '', description: '', seo_name: '' },
    { id: 106, test_category_id: 26, language_id: 1, name: 'Audio Test 3', description: '', seo_name: 'AudioTest3' },
    { id: 107, test_category_id: 27, language_id: 1, name: 'Audio Test 4', description: '', seo_name: 'AudioTest4' },
    { id: 108, test_category_id: 28, language_id: 1, name: 'Audio Test 5', description: '', seo_name: 'AudioTest5' },
    { id: 109, test_category_id: 29, language_id: 1, name: 'Synonym Test 1', description: '', seo_name: 'SynonymTest1' },
    { id: 110, test_category_id: 30, language_id: 1, name: 'Synonym Test 2', description: '', seo_name: 'SynonymTest2' },
    { id: 111, test_category_id: 31, language_id: 1, name: 'Synonym Test 3', description: '', seo_name: 'SynonymTest3' },
    { id: 112, test_category_id: 32, language_id: 1, name: 'Synonym Test 4', description: '', seo_name: 'SynonymTest4' },
    { id: 113, test_category_id: 33, language_id: 1, name: 'Synonym Test 5', description: '', seo_name: 'SynonymTest5' },
    { id: 114, test_category_id: 34, language_id: 1, name: 'Synonym Test 6', description: '', seo_name: 'SynonymTest6' },
    { id: 115, test_category_id: 35, language_id: 1, name: 'Synonym Test 7', description: '', seo_name: 'SynonymTest7' },
    { id: 116, test_category_id: 36, language_id: 1, name: 'Synonym Test 8', description: '', seo_name: 'SynonymTest8' },
    { id: 117, test_category_id: 37, language_id: 1, name: 'Synonym Test 9', description: '', seo_name: 'SynonymTest9' },
    { id: 118, test_category_id: 38, language_id: 1, name: 'Synonym Test 10', description: '', seo_name: 'SynonymTest10' },
    { id: 119, test_category_id: 39, language_id: 1, name: 'Antonym Test 1', description: '', seo_name: 'AntonymTest1' },
    { id: 120, test_category_id: 40, language_id: 1, name: 'Antonym Test 2', description: '', seo_name: 'AntonymTest2' },
    { id: 121, test_category_id: 41, language_id: 1, name: 'Antonym Test 3', description: '', seo_name: 'AntonymTest3' },
    { id: 122, test_category_id: 42, language_id: 1, name: 'Antonym Test 4', description: '', seo_name: 'AntonymTest4' },
    { id: 123, test_category_id: 43, language_id: 1, name: 'Antonym Test 5', description: '', seo_name: 'AntonymTest5' }
  ],

  // Test levels from `test_level` table
  testLevels: [
    { id: 12, status: 1, sort_order: 0 },
    { id: 13, status: 1, sort_order: 0 },
    { id: 14, status: 1, sort_order: 0 },
    { id: 15, status: 1, sort_order: 0 },
    { id: 16, status: 1, sort_order: 0 },
    { id: 17, status: 1, sort_order: 0 },
    { id: 18, status: 1, sort_order: 0 },
    { id: 19, status: 1, sort_order: 0 },
    { id: 20, status: 1, sort_order: 0 }
  ],

  testLevelLabels: [
    { id: 124, test_level_id: 12, language_id: 1, name: 'Basic', seo_name: 'Basic' },
    { id: 125, test_level_id: 12, language_id: 2, name: 'Начальный Уровень', seo_name: 'НачальныйУровень' },
    { id: 126, test_level_id: 12, language_id: 3, name: 'Մեկնարdelays Մdelays', seo_name: 'ՄdelaysՄdelays' },
    { id: 127, test_level_id: 13, language_id: 1, name: 'Elementary', seo_name: 'Elementary' },
    { id: 128, test_level_id: 13, language_id: 2, name: 'Элементарный Уровень', seo_name: 'ЭлементарныйУровень' },
    { id: 129, test_level_id: 13, language_id: 3, name: 'Տdelays Մdelays', seo_name: 'ՏdelaysՄdelays' },
    { id: 130, test_level_id: 14, language_id: 1, name: 'Beginner', seo_name: 'Beginner' },
    { id: 131, test_level_id: 14, language_id: 2, name: 'Новичок', seo_name: 'Новичок' },
    { id: 132, test_level_id: 14, language_id: 3, name: 'Սdelays', seo_name: 'Սdelays' },
    { id: 137, test_level_id: 15, language_id: 1, name: 'Pre-Intermediate', seo_name: 'PreIntermediate' },
    { id: 138, test_level_id: 15, language_id: 2, name: 'Уровень Ниже Среднего', seo_name: 'УровеньНижеСреднего' },
    { id: 139, test_level_id: 15, language_id: 3, name: 'Միdelays Մdelaysیdelay Ցdelays', seo_name: 'ՄdelaysՄdelaysdelaysՑdelays' },
    { id: 140, test_level_id: 16, language_id: 1, name: 'Intermediate', seo_name: 'Intermediate' },
    { id: 141, test_level_id: 17, language_id: 1, name: 'Upper-Intermediate', seo_name: 'UpperIntermediate' },
    { id: 142, test_level_id: 18, language_id: 1, name: 'Advanced', seo_name: 'Advanced' },
    { id: 143, test_level_id: 19, language_id: 1, name: 'Proficiency', seo_name: 'Proficiency' },
    { id: 144, test_level_id: 20, language_id: 1, name: 'TOEFL Level', seo_name: 'TOEFLLevel' }
  ],

  // Tests from `test` table (sample data)
  tests: [
    { id: 16, parent_id: 9, status: 1, question_type: 1, answer_type: 1, image: '', question: 'What?', sort_order: 0, view_count: 0, audio: null },
    { id: 20, parent_id: 9, status: 1, question_type: 1, answer_type: 1, image: '', question: 'what?', sort_order: 0, view_count: 0, audio: null },
    { id: 21, parent_id: 9, status: 1, question_type: 1, answer_type: 1, image: '', question: '1. What is this ?', sort_order: 0, view_count: 0, audio: null },
    { id: 22, parent_id: 9, status: 1, question_type: 1, answer_type: 1, image: '', question: '1. What is this ?', sort_order: 0, view_count: 0, audio: null },
    { id: 23, parent_id: 9, status: 1, question_type: 1, answer_type: 1, image: '', question: '1. What is this ?', sort_order: 0, view_count: 0, audio: null },
    { id: 45, parent_id: 10, status: 1, question_type: 2, answer_type: 1, image: 'Bonsai_IMG_6426.jpg', question: 'What is it?', sort_order: 0, view_count: 0, audio: null },
    { id: 46, parent_id: 10, status: 1, question_type: 2, answer_type: 1, image: 'Bonsai_IMG_6426.jpg', question: 'What is it?', sort_order: 0, view_count: 0, audio: null },
    { id: 47, parent_id: 10, status: 1, question_type: 2, answer_type: 1, image: 'Blue_Tiger_Im_IMG_9450.jpg', question: 'What is it?', sort_order: 0, view_count: 0, audio: null }
  ],

  // Test answers from `test_answer` table
  testAnswers: [
    { id: 35, test_id: 16, true_false: 0, value: 'v' },
    { id: 36, test_id: 16, true_false: 1, value: 'true' },
    { id: 37, test_id: 16, true_false: 0, value: 'sadvfsa' },
    { id: 38, test_id: 16, true_false: 0, value: 'sfsfds' },
    { id: 71, test_id: 21, true_false: 0, value: 's' },
    { id: 72, test_id: 21, true_false: 1, value: 'true' },
    { id: 73, test_id: 21, true_false: 0, value: 'w' },
    { id: 74, test_id: 21, true_false: 0, value: 'e' },
    { id: 79, test_id: 23, true_false: 1, value: 'true' },
    { id: 80, test_id: 23, true_false: 0, value: 'a' },
    { id: 81, test_id: 23, true_false: 0, value: 's' },
    { id: 82, test_id: 23, true_false: 0, value: 'd' },
    { id: 83, test_id: 22, true_false: 0, value: 'Cork5' },
    { id: 84, test_id: 22, true_false: 0, value: 'Cork4' },
    { id: 85, test_id: 22, true_false: 1, value: 'true' },
    { id: 86, test_id: 22, true_false: 0, value: 'Cork2' },
    { id: 87, test_id: 20, true_false: 1, value: 'true' },
    { id: 88, test_id: 20, true_false: 0, value: 'bdfsf' },
    { id: 89, test_id: 20, true_false: 0, value: 'csdfdsf' },
    { id: 90, test_id: 20, true_false: 0, value: 'dff' }
  ],

  testLabels: [
    { id: 1, test_id: 16, language_id: 1, value: 'What?' },
    { id: 2, test_id: 20, language_id: 1, value: 'what?' },
    { id: 3, test_id: 21, language_id: 1, value: '1. What is this ?' },
    { id: 4, test_id: 22, language_id: 1, value: '1. What is this ?' },
    { id: 5, test_id: 23, language_id: 1, value: '1. What is this ?' }
  ],

  // Slideshows from `slideshow` table
  slideshows: [
    { id: 9, status: 1, sort_order: 0, image: '7ce56961f0e16fb7943aaa3b20d88e3d.jpg', href: '' },
    { id: 10, status: 1, sort_order: 0, image: '2b31ff635fea53adbef4ebf2736cc7a4.jpg', href: '' }
  ],

  slideshowLabels: [
    { id: 32, slideshow_id: 9, language_id: 1, value: '<p>as an old adage puts it</p>\r\n\r\n<h1>learn a new language and get a new soul</h1>\r\n\r\n<p>&nbsp;</p>\r\n' },
    { id: 33, slideshow_id: 9, language_id: 2, value: '<p>You only have to know one thing</p>\r\n\r\n<h1>You can learn English</h1>\r\n\r\n<p>For everyone</p>\r\n' },
    { id: 34, slideshow_id: 9, language_id: 3, value: '<p>You only have to know one thing</p>\r\n\r\n<h1>You can learn English</h1>\r\n\r\n<p>For everyone</p>\r\n' },
    { id: 39, slideshow_id: 10, language_id: 1, value: '<p>bear it in mind that</p>\r\n\r\n<h1>precision beats power and timing beats speed</h1>\r\n' },
    { id: 40, slideshow_id: 10, language_id: 2, value: '<h5>You only have to know one thing</h5>\r\n\r\n<h1>You can learn English</h1>\r\n\r\n<p>For everyone</p>\r\n' },
    { id: 41, slideshow_id: 10, language_id: 3, value: '<h5>You only have to know one thing</h5>\r\n\r\n<h1>You can learn English</h1>\r\n\r\n<p>For everyone</p>\r\n' }
  ],

  // News from `news` table
  news: [
    { id: 1, status: 1, created_date: '2016-04-14', sort_order: 0, view_count: 278, image: '', video: 'https://www.youtube.com/watch?v=cIcaoOXl4ro', type: 2 },
    { id: 2, status: 1, created_date: '2016-04-14', sort_order: 0, view_count: 248, image: 'Bonsai_IMG_6426.jpg', video: '', type: 1 }
  ],

  newsLabels: [
    { id: 37, news_id: 1, language_id: 1, title: '16 habits', value: '' },
    { id: 38, news_id: 1, language_id: 2, title: '16 привычeк', value: '' },
    { id: 39, news_id: 1, language_id: 3, title: '16 delays', value: '' },
    { id: 34, news_id: 2, language_id: 1, title: '', value: '' },
    { id: 35, news_id: 2, language_id: 2, title: '', value: '' },
    { id: 36, news_id: 2, language_id: 3, title: '', value: '' }
  ],

  // Memberships from `membership` table
  memberships: [
    { id: 1, status: 1, sort_ortder: 2, price: null, vip: 0 },
    { id: 2, status: 1, sort_ortder: 3, price: 1000000, vip: 1 },
    { id: 3, status: 1, sort_ortder: 1, price: null, vip: 0 }
  ],

  membershipLabels: [
    { id: 60, membership_id: 3, language_id: 1, title: 'BRONZE USER', short_description: '', description: '' },
    { id: 61, membership_id: 3, language_id: 2, title: 'BRONZE USER', short_description: '', description: '' },
    { id: 62, membership_id: 3, language_id: 3, title: 'BRONZE USER', short_description: '', description: '' },
    { id: 67, membership_id: 1, language_id: 1, title: 'SILVER USER', short_description: '', description: '' },
    { id: 68, membership_id: 1, language_id: 2, title: 'SILVER USER', short_description: '', description: '' },
    { id: 69, membership_id: 1, language_id: 3, title: 'SILVER USER', short_description: '', description: '' },
    { id: 74, membership_id: 2, language_id: 1, title: 'GOLDEN USER', short_description: '', description: '' },
    { id: 75, membership_id: 2, language_id: 2, title: 'GOLDEN USER', short_description: '', description: '' },
    { id: 76, membership_id: 2, language_id: 3, title: 'GOLDEN USER', short_description: '', description: '' }
  ],

  // Reviews from `review` table
  reviews: [
    { id: 1, user_id: 1, status: 1, profession: 'Architect', review: 'English.am is an excellent resource for language learning. The practice tests are comprehensive and helpful.', created_date: '2018-07-19' },
    { id: 2, user_id: 1, status: 1, profession: 'Doctor', review: 'English.am truly deserves recognition. It has a significant impact on language learners around the globe.', created_date: '2018-07-23' },
    { id: 3, user_id: 1, status: 0, profession: 'Linguist', review: 'English.am has many praise-worthy features. ESL instructors around the world find it suited to their needs.', created_date: '2018-07-25' }
  ],

  // Gallery from `gallery` table
  gallery: [
    { id: 5, status: 1, created_date: '2016-07-20', sort_order: 12, image: 'cf4a6d2d6cb675783704125e7bb110f0.Ranbu' },
    { id: 6, status: 1, created_date: '2016-07-20', sort_order: 0, image: '826c0181c45aaf5325c239c09a1fcfa4.jpeg' },
    { id: 7, status: 1, created_date: '2016-07-20', sort_order: 0, image: 'c52b525094a3fc102405d89d24189a13.Ranbu' },
    { id: 8, status: 1, created_date: '2016-07-20', sort_order: 0, image: '9b7413901931c6abc26e298257adb86b.jpg' },
    { id: 9, status: 1, created_date: '2016-07-20', sort_order: 0, image: 'c2955540e34a19887190ba676c9bbdfd.jpg' },
    { id: 10, status: 1, created_date: '2016-07-20', sort_order: 0, image: 'd4afbbf47757d8019472bc0bf69e5686.png' },
    { id: 11, status: 1, created_date: '2016-07-20', sort_order: 0, image: 'd86d5c9351e944e267593b4c74282265.jpg' },
    { id: 12, status: 1, created_date: '2016-07-20', sort_order: 0, image: '26eee1e916489bd510a9410cf3138c55.jpg' },
    { id: 13, status: 1, created_date: '2016-07-20', sort_order: 0, image: '95595e97728ccc7c37cd2091bd4dd78b.jpg' },
    { id: 14, status: 1, created_date: '2016-07-20', sort_order: 0, image: '2d97be69bab8ec078c1235936890d9b7.jpg' },
    { id: 15, status: 1, created_date: '2016-07-21', sort_order: 0, image: 'adc94ade15ed12f9f2caf56883f78e90.jpg' },
    { id: 16, status: 1, created_date: '2016-07-21', sort_order: 0, image: '4df3cf2c8e796ee72043183269d9fc22.jpg' },
    { id: 17, status: 1, created_date: '2016-07-21', sort_order: 0, image: 'e31db531a0ce43f00c4e4e1ec5e1ffce.jpg' },
    { id: 18, status: 1, created_date: '2016-07-21', sort_order: 0, image: 'c62fe68b8d44a4ba955ff6a160512d78.jpg' },
    { id: 19, status: 1, created_date: '2016-07-21', sort_order: 0, image: 'a383ba4d9eb3579120dc58f22c95fc41.jpg' }
  ],

  // Static pages from `static_pages` table
  staticPages: [
    { id: 1, page_key: 'about_us', created_date: '2016-04-12' },
    { id: 2, page_key: 'why', created_date: '2016-05-14' }
  ],

  staticPagesLabels: [
    { id: 66, static_pages_id: 1, language_id: 1, title: 'about us', value: '<p>Educated Society NGO is a non-governmental organization established to set up a stable and easy-to-obtain education system for people of all social categories.</p>' },
    { id: 51, static_pages_id: 2, language_id: 1, title: 'WHY english.am ?', value: '<p>English.am provides comprehensive English learning resources including TOEFL, IELTS preparation, and general English proficiency courses.</p>' },
    { id: 67, static_pages_id: 1, language_id: 2, title: 'О нас', value: '<p>Educated Society NGO - некоммерческая организация.</p>' },
    { id: 68, static_pages_id: 1, language_id: 3, title: 'Մdelays մdelays', value: '<p>Educated Society NGO</p>' },
    { id: 52, static_pages_id: 2, language_id: 2, title: 'Почему english.am ?', value: '<p>English.am предоставляет комплексные ресурсы для изучения английского языка.</p>' },
    { id: 53, static_pages_id: 2, language_id: 3, title: 'Ինdelays english.am ?', value: '<p>English.am</p>' }
  ],

  // Page images from `page_images` table
  pageImages: [
    { id: 6, key: 'home_page_about_us', image: 'a0344601b3e3e65b1e96fe4ed5078f87.png' },
    { id: 7, key: 'home_page_why_section', image: 'b6ab8eb92ae127713e8bcf1513075279.jpg' },
    { id: 8, key: 'home_page_review', image: '6c92010537a713561f6e26fe1997ade2.jpg' },
    { id: 9, key: 'about_us_page', image: 'aed085edafae23add790b517fb8b9a53.jpg' },
    { id: 10, key: 'home_page_why_section_girl', image: '70edd18aef4722417b8a802d016a3e1c.png' },
    { id: 11, key: 'about_us_page_girl', image: 'ff6b7d95866a618c9937b752e7b82101.gif' },
    { id: 12, key: 'toefl_reading', image: 'b438040f751bedee525eec9049db5899.jpg' },
    { id: 13, key: 'toefl_listening', image: '5e4bbd01811d3562a341b830cfd4e656.jpg' },
    { id: 14, key: 'toefl_speaking', image: 'db445e4b86daed5f2adafd06da0aafb0.jpg' },
    { id: 15, key: 'toefl_writing', image: 'd59b320d25bc10fe710724cf96c6918f.jpg' },
    { id: 16, key: 'toefl_complete', image: '6572f202452f7955f8ec3ce4cb140084.jpg' },
    { id: 21, key: 'overall_reading', image: '86ed49245abd36bf879f72c81972b00d.jpg' },
    { id: 22, key: 'overall_listening', image: 'fccf7f4199ce292521a22db205c22301.jpg' },
    { id: 23, key: 'overall_speaking', image: '26287fa4cc9a0dc7fe07afb3011fb879.jpg' },
    { id: 24, key: 'overall_writing', image: '5dffa2ff77e7d5923a6007eba2313df4.jpg' },
    { id: 25, key: 'overall_complete', image: '8050aa02672b9700ba448163d2d510b2.jpg' },
    { id: 26, key: 'ielts_reading', image: '67a693416bf3c9248d822834fd8473a0.jpg' },
    { id: 27, key: 'ielts_listening', image: '2c137b49854fd56acc535b2b71e43f2c.jpg' },
    { id: 28, key: 'ielts_speaking', image: '994c5bef23268eb750bc2ce0b3b9eaff.jpg' },
    { id: 29, key: 'ielts_writing', image: '608199b1d8e30126dc8a30ccb0277cc7.jpg' }
  ],

  // Contact info from `contact_info` table
  contactInfo: [
    { id: 1, email: 'english@gmail.com', phone: '+374 10' }
  ],

  contactInfoLabels: [
    { id: 9, contact_info_id: 1, language_id: 1, address: 'qochar 1' },
    { id: 10, contact_info_id: 1, language_id: 2, address: 'qochar 2' },
    { id: 11, contact_info_id: 1, language_id: 3, address: 'qochar 3' }
  ],

  // Users from `users` table (sample)
  users: [
    { id: 24, block: 0, user_name: 'guest', password: '084e0343a0486ff05530df6c705c8bb4', email: 'guest@guest.am', first_name: 'guest', last_name: 'guest', gender: 1, dob: null, avatar: null, auth_key: 'b44c240f088e42783485f1c392ab3022' },
    { id: 25, block: 0, user_name: 'Tigran', password: '1a71d4ed4db0979f6f1efe563799a61c', email: 'Syuzanna@Syuzanna.am', first_name: '', last_name: '', gender: 1, dob: null, avatar: null, auth_key: 'ee61b14679245f31c803dfad90cdb5f9' },
    { id: 28, block: 0, user_name: 'Vahag', password: '5ad6183a43a6ac64dbf5360564527f94', email: 'Vahag@Vahag.com', first_name: '', last_name: '', gender: 1, dob: null, avatar: null, auth_key: 'a5d845edd337ec4888498690687a898f' },
    { id: 29, block: 0, user_name: 'Levon', password: '8fb43783c01bdd830a449fdf9e02426e', email: 'Levon@Levon.com', first_name: '', last_name: '', gender: 1, dob: null, avatar: null, auth_key: '6e2bacead694d4a455eb1b1070f6a62b' },
    { id: 40, block: 0, user_name: 'test@example.com', password: '5f4dcc3b5aa765d61d8327deb882cf99', email: 'test@example.com', first_name: 'Test', last_name: 'User', gender: 1, dob: null, avatar: null, auth_key: 'testkey123' }
  ],

  // Admins from `admins` table
  admins: [
    { id: 2, group_id: 2, status: 1, email: 'r@r.r', password: '202cb962ac59075b964b07152d234b70', name: '', avatar: null },
    { id: 3, group_id: 2, status: 1, email: 'admin@admin.com', password: '21232f297a57a5a743894a0e4a801fc3', name: 'Admin', avatar: null }
  ],

  adminsGroups: [
    { id: 2, title: 'admin', accesses: '{}' }
  ],

  // Settings from `settings` table
  settings: {
    menu_control: { about_us: '1', tests: '1', toefl: '1', overall_english: '1', ielts: '1', trainings: '1', dictionary: '1', lessons: '1', news: '1', gallery: '0', faq: '1', contact_us: '1' },
    site_settings: { email: 'Tigran.Pepanyan@usa.com', phone_number: '' }
  },

  // Socials from `socials` table
  socials: [
    { id: 1, status: 1, sort_order: 0, favicon: 'fa-facebook', href: '#' },
    { id: 3, status: 1, sort_order: 0, favicon: 'fa-twitter', href: '#' },
    { id: 4, status: 1, sort_order: 0, favicon: 'fa-pinterest', href: '#' }
  ],

  // FAQ from `faq` table
  faq: [
    { id: 1, status: 1, sort_order: 0 },
    { id: 2, status: 1, sort_order: 0 },
    { id: 3, status: 1, sort_order: 0 },
    { id: 7, status: 1, sort_order: 0 },
    { id: 10, status: 1, sort_order: 0 },
    { id: 12, status: 1, sort_order: 0 }
  ],

  faqLabels: [
    { id: 94, faq_id: 1, language_id: 1, question: 'Who should access English.am?', answer: '<p>People join us for many reasons. With English.am, you can take a variety of English-related tests, prepare for TOEFL and IELTS exams, and improve your general English skills.</p>' },
    { id: 95, faq_id: 1, language_id: 2, question: 'Кто должен использовать English.am?', answer: '<p>Люди присоединяются к нам по множеству причин.</p>' },
    { id: 96, faq_id: 1, language_id: 3, question: '', answer: '' },
    { id: 97, faq_id: 2, language_id: 1, question: 'How do I gain access to the exceptional services?', answer: '<p>Try browsing our catalog and find the course that best suits your needs.</p>' },
    { id: 98, faq_id: 2, language_id: 2, question: '', answer: '' },
    { id: 99, faq_id: 2, language_id: 3, question: '', answer: '' },
    { id: 100, faq_id: 3, language_id: 1, question: 'What makes English.am unique?', answer: '<p>English.am provides a comprehensive platform that combines testing, learning, and practice in one place.</p>' },
    { id: 101, faq_id: 7, language_id: 1, question: 'Can I use English.am on mobile devices?', answer: '<p>Yes, English.am is fully responsive and works on all modern devices.</p>' },
    { id: 102, faq_id: 10, language_id: 1, question: 'How do I track my progress?', answer: '<p>Your account dashboard shows your test history, scores, and statistics.</p>' },
    { id: 103, faq_id: 12, language_id: 1, question: 'Is there a free trial?', answer: '<p>Yes, basic access is free. Premium features require a membership.</p>' }
  ],

  // Translations from `translation` table
  translations: [
    { id: 1, key: 'email_or_username' },
    { id: 2, key: 'password' },
    { id: 3, key: 'sign_in' },
    { id: 4, key: 'login_to_your' },
    { id: 5, key: 'account!' },
    { id: 6, key: 'login' },
    { id: 7, key: 'register' },
    { id: 8, key: 'user_name' },
    { id: 9, key: 'email' },
    { id: 10, key: 'confirm_password' },
    { id: 11, key: 'first_name' },
    { id: 12, key: 'last_name' },
    { id: 13, key: 'create_your_account_and_join_with us!' },
    { id: 14, key: 'create_account' },
    { id: 15, key: 'hello' },
    { id: 16, key: 'log_out' },
    { id: 17, key: 'my_acaunt' },
    { id: 18, key: 'Start_learning_now' },
    { id: 19, key: 'CHOOSE_YOUR_CATEGORY' },
    { id: 20, key: 'LEARN_ENGLISH_WITH_US' }
  ],

  translationLabels: [
    { id: 1, translation_id: 1, language_id: 1, value: 'Email/User name' },
    { id: 2, translation_id: 1, language_id: 2, value: 'Эл.почта/Имя пользователя' },
    { id: 3, translation_id: 1, language_id: 3, value: 'Էdelays/delays delays' },
    { id: 4, translation_id: 2, language_id: 1, value: 'password' },
    { id: 5, translation_id: 2, language_id: 2, value: 'пароль' },
    { id: 6, translation_id: 2, language_id: 3, value: 'delays' },
    { id: 7, translation_id: 3, language_id: 1, value: 'sign in' },
    { id: 8, translation_id: 3, language_id: 2, value: 'войти' },
    { id: 9, translation_id: 3, language_id: 3, value: 'delays delays' },
    { id: 10, translation_id: 4, language_id: 1, value: 'login to your' },
    { id: 11, translation_id: 4, language_id: 2, value: 'вход в ваш' },
    { id: 12, translation_id: 4, language_id: 3, value: 'delays delays delays' },
    { id: 13, translation_id: 5, language_id: 1, value: 'account' },
    { id: 14, translation_id: 5, language_id: 2, value: 'аккаунт' },
    { id: 15, translation_id: 5, language_id: 3, value: 'delays' },
    { id: 16, translation_id: 6, language_id: 1, value: 'login' },
    { id: 17, translation_id: 6, language_id: 2, value: 'авторизоваться' },
    { id: 18, translation_id: 6, language_id: 3, value: 'delays' },
    { id: 19, translation_id: 7, language_id: 1, value: 'register' },
    { id: 20, translation_id: 7, language_id: 2, value: 'зарегистрироваться' },
    { id: 21, translation_id: 7, language_id: 3, value: 'delays' },
    { id: 22, translation_id: 8, language_id: 1, value: 'user name' },
    { id: 23, translation_id: 9, language_id: 1, value: 'email' },
    { id: 24, translation_id: 10, language_id: 1, value: 'confirm password' },
    { id: 25, translation_id: 11, language_id: 1, value: 'first name' },
    { id: 26, translation_id: 12, language_id: 1, value: 'last name' },
    { id: 27, translation_id: 13, language_id: 1, value: 'create your account and join with us!' },
    { id: 28, translation_id: 14, language_id: 1, value: 'create account' },
    { id: 29, translation_id: 15, language_id: 1, value: 'hello' },
    { id: 30, translation_id: 15, language_id: 2, value: 'здравствуйте' },
    { id: 31, translation_id: 15, language_id: 3, value: 'delays' },
    { id: 32, translation_id: 16, language_id: 1, value: 'log out' },
    { id: 33, translation_id: 17, language_id: 1, value: 'my account' },
    { id: 34, translation_id: 18, language_id: 1, value: 'Start learning now' },
    { id: 35, translation_id: 19, language_id: 1, value: 'CHOOSE YOUR CATEGORY' },
    { id: 36, translation_id: 20, language_id: 1, value: 'LEARN ENGLISH WITH US' }
  ],

  // TOEFL Reading from `toefl_reading` table
  toeflReading: [
    { id: 36, sort_order: 1, status: 1, trainings: 0, image: '7cc29c94ffd03ecd3a8272c6aed17de3.jpg', time: '01:00:00' },
    { id: 37, sort_order: 2, status: 1, trainings: 0, image: '7a32702cea809e37e234186d45a9a99b.jpg', time: '01:00:00' },
    { id: 38, sort_order: 3, status: 1, trainings: 0, image: '996cd2ce67627ad10a476e174f5983bc.jpg', time: '01:00:00' },
    { id: 39, sort_order: 4, status: 1, trainings: 0, image: '17ed103e6c1e885abae1ad1e1a398f42.jpg', time: '01:00:00' },
    { id: 41, sort_order: 5, status: 1, trainings: 0, image: '1d5ea92e482cf22b5e353052cce0e45a.jpg', time: '01:00:00' },
    { id: 23, sort_order: 6, status: 1, trainings: 0, image: '567450cb7ce1fd1687805ef104a7513a.jpg', time: '01:00:00' },
    { id: 25, sort_order: 7, status: 1, trainings: 0, image: '4ccbe058537fc86fd779a75403e17672.jpg', time: '01:00:00' },
    { id: 26, sort_order: 8, status: 1, trainings: 0, image: 'ec94a9703814af885552b213e93d4137.jpg', time: '01:00:00' },
    { id: 27, sort_order: 9, status: 1, trainings: 0, image: 'e741587b1067cf75b91fbb7529df9903.jpg', time: '01:00:00' },
    { id: 29, sort_order: 10, status: 1, trainings: 0, image: '7f3f4f3c72916aa6944812c23c694ae1.jpg', time: '01:00:00' },
    { id: 34, sort_order: 12, status: 1, trainings: 0, image: '8f6f27bf46e562050552fa6f9f9ecce6.jpg', time: '01:00:00' }
  ],

  toeflReadingLabels: [
    { id: 1, toefl_reading_id: 36, language_id: 1, name: 'Reading Passage I' },
    { id: 2, toefl_reading_id: 37, language_id: 1, name: 'Reading Passage II' },
    { id: 3, toefl_reading_id: 38, language_id: 1, name: 'Reading Passage III' },
    { id: 4, toefl_reading_id: 39, language_id: 1, name: 'Reading Passage IV' },
    { id: 5, toefl_reading_id: 41, language_id: 1, name: 'Reading Passage V' },
    { id: 6, toefl_reading_id: 23, language_id: 1, name: 'Reading Passage VI' },
    { id: 7, toefl_reading_id: 25, language_id: 1, name: 'Reading Passage VII' },
    { id: 8, toefl_reading_id: 26, language_id: 1, name: 'Reading Passage VIII' },
    { id: 9, toefl_reading_id: 27, language_id: 1, name: 'Reading Passage IX' },
    { id: 10, toefl_reading_id: 29, language_id: 1, name: 'Reading Passage X' },
    { id: 11, toefl_reading_id: 34, language_id: 1, name: 'Reading Passage XI' }
  ],

  // TOEFL Listening
  toeflListening: [
    { id: 3, status: 1, sort_order: 1, time: '01:30:00', image: '05364815967c2c5d195b408020cf752c.jpg', trainings: 0 },
    { id: 4, status: 1, sort_order: 2, time: '01:30:00', image: '4c0d7227e05f213de483a2018451dfed.jpg', trainings: 0 },
    { id: 5, status: 1, sort_order: 3, time: '01:30:00', image: '04dffb6b8497bf26c0b0135eca7fae63.jpg', trainings: 0 },
    { id: 6, status: 1, sort_order: 4, time: '01:30:00', image: '675f61aa11bb5c5f78896c7c03b52776.jpg', trainings: 0 },
    { id: 7, status: 1, sort_order: 5, time: '01:30:00', image: 'c179b678ded8db695200f861c7164190.jpg', trainings: 0 },
    { id: 8, status: 1, sort_order: 6, time: '01:30:00', image: '37cf0f41d176a24fd93156620d92434f.jpg', trainings: 0 },
    { id: 9, status: 1, sort_order: 7, time: '01:30:00', image: 'f2dcf41236639ac606cf6adecf61c325.jpg', trainings: 0 },
    { id: 10, status: 1, sort_order: 8, time: '01:30:00', image: '4478f45ffce9cb699989fa5200679a89.jpg', trainings: 0 },
    { id: 14, status: 1, sort_order: 11, time: '01:30:00', image: '5abf584c89c23644a815569bf9b385e7.jpg', trainings: 0 },
    { id: 15, status: 1, sort_order: 12, time: '01:30:00', image: 'a22ca770e3ed2c79aa0c05b06960c460.jpg', trainings: 0 }
  ],

  toeflListeningLabels: [
    { id: 1, toefl_listening_id: 3, language_id: 1, name: 'Listening Test I' },
    { id: 2, toefl_listening_id: 4, language_id: 1, name: 'Listening Test II' },
    { id: 3, toefl_listening_id: 5, language_id: 1, name: 'Listening Test III' },
    { id: 4, toefl_listening_id: 6, language_id: 1, name: 'Listening Test IV' },
    { id: 5, toefl_listening_id: 7, language_id: 1, name: 'Listening Test V' },
    { id: 6, toefl_listening_id: 8, language_id: 1, name: 'Listening Test VI' },
    { id: 7, toefl_listening_id: 9, language_id: 1, name: 'Listening Test VII' },
    { id: 8, toefl_listening_id: 10, language_id: 1, name: 'Listening Test VIII' },
    { id: 9, toefl_listening_id: 14, language_id: 1, name: 'Listening Test IX' },
    { id: 10, toefl_listening_id: 15, language_id: 1, name: 'Listening Test X' }
  ],

  // TOEFL Speaking
  toeflSpeaking: [
    { id: 4, status: 1, sort_order: 1, image: 'a39455997bdbe23652d960becc3746c8.jpg', trainings: 0 },
    { id: 5, status: 1, sort_order: 2, image: 'fd0d84f5d348991ab7947bdd8e55af27.jpg', trainings: 0 },
    { id: 6, status: 1, sort_order: 3, image: '06c8f6c846c0a94e2f043ebde40ece79.jpg', trainings: 0 },
    { id: 7, status: 1, sort_order: 4, image: '0ca671b94fc8210b071ed6f1d615c88f.jpg', trainings: 0 },
    { id: 8, status: 1, sort_order: 5, image: '3e894ffadd391c7b7e373fe301c61791.jpg', trainings: 0 },
    { id: 9, status: 1, sort_order: 6, image: '9f1ff6424cd00588aac502a11a5c84b9.jpg', trainings: 0 },
    { id: 10, status: 1, sort_order: 7, image: '7a06c781b8e093fa66ec8a21407eca64.jpg', trainings: 0 }
  ],

  toeflSpeakingLabels: [
    { id: 1, toefl_speaking_id: 4, language_id: 1, name: 'Speaking Test I' },
    { id: 2, toefl_speaking_id: 5, language_id: 1, name: 'Speaking Test II' },
    { id: 3, toefl_speaking_id: 6, language_id: 1, name: 'Speaking Test III' },
    { id: 4, toefl_speaking_id: 7, language_id: 1, name: 'Speaking Test IV' },
    { id: 5, toefl_speaking_id: 8, language_id: 1, name: 'Speaking Test V' },
    { id: 6, toefl_speaking_id: 9, language_id: 1, name: 'Speaking Test VI' },
    { id: 7, toefl_speaking_id: 10, language_id: 1, name: 'Speaking Test VII' }
  ],

  // TOEFL Writing
  toeflWriting: [
    { id: 34, status: 1, sort_order: 1, type: 1, image: '884bf4bf002a167449610f87f7f8d1ef.jpg', trainings: 0 },
    { id: 36, status: 1, sort_order: 2, type: 1, image: null, trainings: 0 },
    { id: 37, status: 1, sort_order: 3, type: 1, image: null, trainings: 0 },
    { id: 38, status: 1, sort_order: 4, type: 2, image: null, trainings: 0 },
    { id: 39, status: 1, sort_order: 5, type: 2, image: null, trainings: 0 }
  ],

  toeflWritingLabels: [
    { id: 1, toefl_writing_id: 34, language_id: 1, name: 'Integrated Writing I' },
    { id: 2, toefl_writing_id: 36, language_id: 1, name: 'Integrated Writing II' },
    { id: 3, toefl_writing_id: 37, language_id: 1, name: 'Integrated Writing III' },
    { id: 4, toefl_writing_id: 38, language_id: 1, name: 'Independent Writing I' },
    { id: 5, toefl_writing_id: 39, language_id: 1, name: 'Independent Writing II' }
  ],

  // TOEFL Complete
  toeflComplete: [
    { id: 8, status: 0, sort_order: 0, image: 'bd178daec708313aab8c51a9db443301.gif', trainings: 0 }
  ],

  toeflCompleteLabels: [
    { id: 1, toefl_complete_id: 8, language_id: 1, name: 'TOEFL Complete Test' }
  ],

  // IELTS Reading
  ieltsReading: [
    { id: 6, status: 1, ielts_type: 0, sort_order: 1, image: '94f0104bdf2e7bf7b7a686c006e3f009.jpg', trainings: 0 },
    { id: 7, status: 1, ielts_type: 0, sort_order: 2, image: null, trainings: 0 },
    { id: 8, status: 1, ielts_type: 0, sort_order: 3, image: null, trainings: 0 },
    { id: 9, status: 1, ielts_type: 0, sort_order: 4, image: null, trainings: 0 },
    { id: 10, status: 1, ielts_type: 1, sort_order: 5, image: null, trainings: 0 },
    { id: 11, status: 1, ielts_type: 1, sort_order: 6, image: null, trainings: 0 }
  ],

  ieltsReadingLabels: [
    { id: 1, ielts_reading_id: 6, language_id: 1, name: 'Reading Test I' },
    { id: 2, ielts_reading_id: 7, language_id: 1, name: 'Reading Test II' },
    { id: 3, ielts_reading_id: 8, language_id: 1, name: 'Reading Test III' },
    { id: 4, ielts_reading_id: 9, language_id: 1, name: 'Reading Test IV' },
    { id: 5, ielts_reading_id: 10, language_id: 1, name: 'Academic Reading I' },
    { id: 6, ielts_reading_id: 11, language_id: 1, name: 'Academic Reading II' }
  ],

  // IELTS Listening
  ieltsListening: [
    { id: 15, status: 1, ielts_type: 0, sort_order: 3, image: 'e834924721a10f97b4dfd2caff2e062c.jpg', trainings: 0 },
    { id: 16, status: 1, ielts_type: 0, sort_order: 3, image: 'd78b93b1cb0e76effa796aa6e0159120.jpg', trainings: 0 },
    { id: 17, status: 1, ielts_type: 0, sort_order: 3, image: 'b7b87eed7060b65897502d905e1a9a22.jpg', trainings: 0 },
    { id: 18, status: 1, ielts_type: 0, sort_order: 3, image: '1ac0077bd63250c66dd4cd87bf9dd23b.jpg', trainings: 0 }
  ],

  ieltsListeningLabels: [
    { id: 1, ielts_listening_id: 15, language_id: 1, name: 'Listening Test I' },
    { id: 2, ielts_listening_id: 16, language_id: 1, name: 'Listening Test II' },
    { id: 3, ielts_listening_id: 17, language_id: 1, name: 'Listening Test III' },
    { id: 4, ielts_listening_id: 18, language_id: 1, name: 'Listening Test IV' }
  ],

  // IELTS Speaking
  ieltsSpeaking: [
    { id: 1, status: 1, sort_order: 1, image: null, trainings: 0 },
    { id: 5, status: 1, sort_order: 2, image: null, trainings: 0 },
    { id: 6, status: 1, sort_order: 3, image: null, trainings: 0 },
    { id: 8, status: 1, sort_order: 4, image: null, trainings: 0 }
  ],

  ieltsSpeakingLabels: [
    { id: 1, ielts_speaking_id: 1, language_id: 1, name: 'Speaking Test I' },
    { id: 2, ielts_speaking_id: 5, language_id: 1, name: 'Speaking Test II' },
    { id: 3, ielts_speaking_id: 6, language_id: 1, name: 'Speaking Test III' },
    { id: 4, ielts_speaking_id: 8, language_id: 1, name: 'Speaking Test IV' }
  ],

  // IELTS Writing
  ieltsWriting: [
    { id: 1, status: 1, ielts_type: 0, sort_order: 1, image: null, trainings: 0 },
    { id: 2, status: 1, ielts_type: 1, sort_order: 2, image: null, trainings: 0 },
    { id: 3, status: 1, ielts_type: 0, sort_order: 3, image: null, trainings: 0 }
  ],

  ieltsWritingLabels: [
    { id: 1, ielts_writing_id: 1, language_id: 1, name: 'Writing Task I' },
    { id: 2, ielts_writing_id: 2, language_id: 1, name: 'Academic Writing I' },
    { id: 3, ielts_writing_id: 3, language_id: 1, name: 'Writing Task II' }
  ],

  // IELTS Complete
  ieltsComplete: [
    { id: 1, status: 1, ielts_type: 0, sort_order: 0, image: '57a8f099c8cbc6c97a414038fd8e9f17.jpg', trainings: 0 }
  ],

  ieltsCompleteLabels: [
    { id: 1, ielts_complete_id: 1, language_id: 1, name: 'IELTS Complete Test' }
  ],

  // Lessons levels
  lessonsLevels: [
    { id: 8, status: 1, sort_order: 2 },
    { id: 10, status: 1, sort_order: 1 },
    { id: 11, status: 1, sort_order: 3 },
    { id: 12, status: 1, sort_order: 4 },
    { id: 13, status: 1, sort_order: 5 },
    { id: 14, status: 1, sort_order: 6 },
    { id: 15, status: 1, sort_order: 7 },
    { id: 16, status: 1, sort_order: 8 },
    { id: 17, status: 1, sort_order: 9 }
  ],

  // Lessons filters
  lessonsFilters: [
    { id: 1, status: 1, sort_order: 7 },
    { id: 3, status: 1, sort_order: 1 },
    { id: 5, status: 1, sort_order: 5 },
    { id: 6, status: 1, sort_order: 6 },
    { id: 7, status: 1, sort_order: 8 },
    { id: 8, status: 1, sort_order: 2 },
    { id: 9, status: 1, sort_order: 3 },
    { id: 10, status: 1, sort_order: 4 }
  ],

  // Lessons (sample)
  lessons: [
    { id: 23, level_id: 8, filter_id: 1, test_id: 0, status: 1, sort_order: 96, view_counter: 0, lesson: null },
    { id: 24, level_id: 8, filter_id: 1, test_id: 0, status: 1, sort_order: 95, view_counter: 0, lesson: null },
    { id: 25, level_id: 8, filter_id: 1, test_id: 0, status: 1, sort_order: 94, view_counter: 0, lesson: null },
    { id: 39, level_id: 8, filter_id: 3, test_id: 0, status: 1, sort_order: 1, view_counter: 0, lesson: null },
    { id: 40, level_id: 8, filter_id: 3, test_id: 0, status: 1, sort_order: 3, view_counter: 0, lesson: null }
  ],

  // Trainings groups
  trainingsGroups: [
    { id: 4, status: 1, sort_order: 0 },
    { id: 5, status: 1, sort_order: 0 },
    { id: 6, status: 1, sort_order: 0 },
    { id: 7, status: 1, sort_order: 0 },
    { id: 8, status: 1, sort_order: 0 },
    { id: 9, status: 1, sort_order: 0 },
    { id: 10, status: 1, sort_order: 0 },
    { id: 11, status: 1, sort_order: 0 },
    { id: 12, status: 1, sort_order: 0 },
    { id: 13, status: 1, sort_order: 0 }
  ],

  trainingsGroupLabels: [
    { id: 19, trainings_group_id: 4, language_id: 1, name: 'Reading I (TOEFL iBT)' },
    { id: 20, trainings_group_id: 4, language_id: 2, name: 'Чтение (TOEFL iBT)' },
    { id: 21, trainings_group_id: 4, language_id: 3, name: ' Delays (TOEFL iBT)' },
    { id: 16, trainings_group_id: 5, language_id: 1, name: 'Reading II (TOEFL iBT)' },
    { id: 17, trainings_group_id: 5, language_id: 2, name: 'Чтение II (TOEFL iBT)' },
    { id: 22, trainings_group_id: 6, language_id: 1, name: 'Reading III (TOEFL iBT)' },
    { id: 25, trainings_group_id: 7, language_id: 1, name: 'Reading IV (TOEFL iBT)' },
    { id: 28, trainings_group_id: 8, language_id: 1, name: 'Reading V (TOEFL iBT)' },
    { id: 31, trainings_group_id: 9, language_id: 1, name: 'Reading VI (TOEFL iBT)' },
    { id: 34, trainings_group_id: 10, language_id: 1, name: 'Reading VII (TOEFL iBT)' },
    { id: 37, trainings_group_id: 11, language_id: 1, name: 'Reading VIII (TOEFL iBT)' },
    { id: 40, trainings_group_id: 12, language_id: 1, name: 'Reading IX (TOEFL iBT)' },
    { id: 43, trainings_group_id: 13, language_id: 1, name: 'Reading X (TOEFL iBT)' }
  ],

  // Trainings
  trainings: [
    { id: 5, trainings_group_id: 4, test_id: 32, status: 1, type_seccond: 0, sort_order: 0, type: 1 },
    { id: 6, trainings_group_id: 4, test_id: 33, status: 1, type_seccond: 0, sort_order: 0, type: 1 }
  ],

  // Currency
  currency: [
    { id: 2, sign: '12dccee34cd64c0b70d578389ff001d7.png', code: 'RUB', status: 1, default: 1, sort_order: 0, value: 8.6 },
    { id: 3, sign: '9fad38269486af22076179b5a0ce83ea.png', code: 'AMD', status: 1, default: 0, sort_order: 0, value: 1.0 }
  ],

  // Choose your category
  chooseYourCategory: [
    { id: 31, category_id: 3 },
    { id: 32, category_id: 4 },
    { id: 33, category_id: 19 }
  ],

  // In-memory stores for mock mutations
  contactMessages: [],
  testHistory: [],
  testStatistics: {}
};

module.exports = mockData;
