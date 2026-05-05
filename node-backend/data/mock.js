// In-memory mock data. Shape mirrors the SQL schema (table-by-table) but
// keeps only what the public API needs. The repository layer reads/writes
// these arrays so the same controllers work against the real DB.

const now = () => new Date().toISOString();

const languages = [
  { id: 1, name: 'English', iso: 'en', status: 1, sort_order: 1, image: '' },
  { id: 2, name: 'Հայերեն', iso: 'hy', status: 1, sort_order: 2, image: '' },
  { id: 3, name: 'Русский', iso: 'ru', status: 1, sort_order: 3, image: '' },
];

const translation = [
  { id: 1, key: 'home' },
  { id: 2, key: 'about' },
  { id: 3, key: 'contact' },
  { id: 4, key: 'news' },
  { id: 5, key: 'tests' },
  { id: 6, key: 'login' },
  { id: 7, key: 'register' },
  { id: 8, key: 'logout' },
  { id: 9, key: 'membership' },
  { id: 10, key: 'lessons' },
  { id: 11, key: 'faq' },
  { id: 12, key: 'gallery' },
  { id: 13, key: 'submit' },
  { id: 14, key: 'cancel' },
];

const translation_label = [
  { id: 1, translation_id: 1, language_id: 1, value: 'Home' },
  { id: 2, translation_id: 1, language_id: 2, value: 'Գլխավոր' },
  { id: 3, translation_id: 1, language_id: 3, value: 'Главная' },
  { id: 4, translation_id: 2, language_id: 1, value: 'About' },
  { id: 5, translation_id: 2, language_id: 2, value: 'Մեր մասին' },
  { id: 6, translation_id: 2, language_id: 3, value: 'О нас' },
  { id: 7, translation_id: 3, language_id: 1, value: 'Contact' },
  { id: 8, translation_id: 3, language_id: 2, value: 'Կապ' },
  { id: 9, translation_id: 3, language_id: 3, value: 'Контакт' },
  { id: 10, translation_id: 4, language_id: 1, value: 'News' },
  { id: 11, translation_id: 4, language_id: 2, value: 'Նորություններ' },
  { id: 12, translation_id: 4, language_id: 3, value: 'Новости' },
  { id: 13, translation_id: 5, language_id: 1, value: 'Tests' },
  { id: 14, translation_id: 6, language_id: 1, value: 'Login' },
  { id: 15, translation_id: 7, language_id: 1, value: 'Register' },
  { id: 16, translation_id: 8, language_id: 1, value: 'Logout' },
  { id: 17, translation_id: 9, language_id: 1, value: 'Membership' },
  { id: 18, translation_id: 10, language_id: 1, value: 'Lessons' },
  { id: 19, translation_id: 11, language_id: 1, value: 'FAQ' },
  { id: 20, translation_id: 12, language_id: 1, value: 'Gallery' },
  { id: 21, translation_id: 13, language_id: 1, value: 'Submit' },
  { id: 22, translation_id: 14, language_id: 1, value: 'Cancel' },
];

// Top-level public categories used by Tests menu.
const category = [
  { id: 1, parent_id: 0, status: 1, sort_order: 1, key: 'audio', has_level: 1, image: '' },
  { id: 2, parent_id: 0, status: 1, sort_order: 2, key: 'synonyms', has_level: 1, image: '' },
  { id: 3, parent_id: 0, status: 1, sort_order: 3, key: 'antonyms', has_level: 1, image: '' },
  { id: 4, parent_id: 0, status: 1, sort_order: 4, key: 'general', has_level: 1, image: '' },
  { id: 5, parent_id: 0, status: 1, sort_order: 5, key: 'professional', has_level: 0, image: '' },
  { id: 6, parent_id: 0, status: 1, sort_order: 6, key: 'photo', has_level: 0, image: '' },
];

const category_label = [
  { id: 1, category_id: 1, language_id: 1, value: 'Audio Tests' },
  { id: 2, category_id: 2, language_id: 1, value: 'Synonyms' },
  { id: 3, category_id: 3, language_id: 1, value: 'Antonyms' },
  { id: 4, category_id: 4, language_id: 1, value: 'General English' },
  { id: 5, category_id: 5, language_id: 1, value: 'Professional English' },
  { id: 6, category_id: 6, language_id: 1, value: 'Photo Tests' },
];

const test_level = [
  { id: 1, status: 1, sort_order: 1 },
  { id: 2, status: 1, sort_order: 2 },
  { id: 3, status: 1, sort_order: 3 },
  { id: 4, status: 1, sort_order: 4 },
];

const test_level_label = [
  { id: 1, test_level_id: 1, language_id: 1, name: 'Beginner', seo_name: 'beginner' },
  { id: 2, test_level_id: 2, language_id: 1, name: 'Elementary', seo_name: 'elementary' },
  { id: 3, test_level_id: 3, language_id: 1, name: 'Intermediate', seo_name: 'intermediate' },
  { id: 4, test_level_id: 4, language_id: 1, name: 'Advanced', seo_name: 'advanced' },
];

// test_category = a single playable test (collection of questions).
const test_category = [
  { id: 101, category_id: 1, parent_id: 0, level_id: 1, status: 1, sort_order: 1, time: '00:10:00', image: '', tier: 'free', name: 'Audio Test — Daily Routines', subcategory: 'both' },
  { id: 102, category_id: 1, parent_id: 0, level_id: 2, status: 1, sort_order: 2, time: '00:10:00', image: '', tier: 'silver', name: 'Audio Test — News Briefing', subcategory: 'american' },
  { id: 103, category_id: 1, parent_id: 0, level_id: 3, status: 1, sort_order: 3, time: '00:10:00', image: '', tier: 'gold', name: 'Audio Test — BBC Style', subcategory: 'british' },
  { id: 201, category_id: 2, parent_id: 0, level_id: 1, status: 1, sort_order: 1, time: '00:10:00', image: '', tier: 'free', name: 'Synonyms Pack 1' },
  { id: 202, category_id: 2, parent_id: 0, level_id: 2, status: 1, sort_order: 2, time: '00:10:00', image: '', tier: 'free', name: 'Synonyms Pack 2' },
  { id: 203, category_id: 2, parent_id: 0, level_id: 3, status: 1, sort_order: 3, time: '00:10:00', image: '', tier: 'silver', name: 'Synonyms Pack 3' },
  { id: 301, category_id: 3, parent_id: 0, level_id: 1, status: 1, sort_order: 1, time: '00:10:00', image: '', tier: 'free', name: 'Antonyms Pack 1' },
  { id: 302, category_id: 3, parent_id: 0, level_id: 3, status: 1, sort_order: 2, time: '00:10:00', image: '', tier: 'silver', name: 'Antonyms Pack 2' },
  { id: 401, category_id: 4, parent_id: 0, level_id: 1, status: 1, sort_order: 1, time: '00:15:00', image: '', tier: 'free', name: 'General — Tenses' },
  { id: 402, category_id: 4, parent_id: 0, level_id: 2, status: 1, sort_order: 2, time: '00:15:00', image: '', tier: 'free', name: 'General — Articles' },
  { id: 403, category_id: 4, parent_id: 0, level_id: 4, status: 1, sort_order: 3, time: '00:15:00', image: '', tier: 'gold', name: 'General — Conditionals' },
  { id: 501, category_id: 5, parent_id: 0, level_id: 0, status: 1, sort_order: 1, time: '00:15:00', image: '', tier: 'silver', name: 'Business English' },
  { id: 502, category_id: 5, parent_id: 0, level_id: 0, status: 1, sort_order: 2, time: '00:15:00', image: '', tier: 'gold', name: 'Legal English' },
  { id: 601, category_id: 6, parent_id: 0, level_id: 0, status: 1, sort_order: 1, time: '00:10:00', image: '', tier: 'free', name: 'Photo Test — Vocabulary' },
];

const test_category_label = test_category.map((tc, i) => ({
  id: i + 1,
  test_category_id: tc.id,
  language_id: 1,
  name: tc.name,
  description: 'Practice test — pick the correct answer for each question.',
  seo_name: tc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
}));

// Each test_category has questions. We store them inline as `test` rows.
function genQuestions(testCatId, prefix, count = 5) {
  const out = [];
  for (let i = 1; i <= count; i++) {
    const id = testCatId * 100 + i;
    out.push({
      id,
      parent_id: testCatId,
      status: 1,
      question_type: 1,
      answer_type: 1,
      image: '',
      audio: '',
      question: `${prefix} — question ${i}: choose the best answer.`,
      sort_order: i,
    });
  }
  return out;
}

const test = [
  ...genQuestions(101, 'Daily Routines'),
  ...genQuestions(102, 'News Briefing'),
  ...genQuestions(103, 'BBC Style'),
  ...genQuestions(201, 'Synonyms 1'),
  ...genQuestions(202, 'Synonyms 2'),
  ...genQuestions(203, 'Synonyms 3'),
  ...genQuestions(301, 'Antonyms 1'),
  ...genQuestions(302, 'Antonyms 2'),
  ...genQuestions(401, 'Tenses'),
  ...genQuestions(402, 'Articles'),
  ...genQuestions(403, 'Conditionals'),
  ...genQuestions(501, 'Business'),
  ...genQuestions(502, 'Legal'),
  ...genQuestions(601, 'Photo Vocabulary'),
];

const test_label = test.map((t, i) => ({
  id: i + 1,
  test_id: t.id,
  language_id: 1,
  value: t.question,
}));

// Each test row has 4 answers; the first one is correct.
const test_answer = [];
let answerId = 1;
for (const t of test) {
  ['Option A (correct)', 'Option B', 'Option C', 'Option D'].forEach((value, idx) => {
    test_answer.push({
      id: answerId++,
      test_id: t.id,
      true_false: idx === 0 ? 1 : 0,
      value,
    });
  });
}

const news = [
  { id: 1, status: 1, created_date: now(), sort_order: 1, image: '/uploads/news1.jpg', video: '', type: 1, view_count: 12 },
  { id: 2, status: 1, created_date: now(), sort_order: 2, image: '/uploads/news2.jpg', video: '', type: 1, view_count: 8 },
  { id: 3, status: 1, created_date: now(), sort_order: 3, image: '/uploads/news3.jpg', video: '', type: 1, view_count: 5 },
];

const news_label = [
  { id: 1, news_id: 1, language_id: 1, title: 'Welcome to English.am', value: '<p>We are excited to launch a redesigned learning experience with new TOEFL and IELTS practice modes.</p>' },
  { id: 2, news_id: 2, language_id: 1, title: 'New Lessons Added', value: '<p>Twenty new grammar lessons covering conditionals and reported speech are now available to all silver members.</p>' },
  { id: 3, news_id: 3, language_id: 1, title: 'Speaking Practice Beta', value: '<p>Try the upcoming speaking practice mode and send us feedback through the contact form.</p>' },
];

const gallery = [
  { id: 1, status: 1, created_date: now(), sort_order: 1, image: '/uploads/gallery1.jpg' },
  { id: 2, status: 1, created_date: now(), sort_order: 2, image: '/uploads/gallery2.jpg' },
  { id: 3, status: 1, created_date: now(), sort_order: 3, image: '/uploads/gallery3.jpg' },
  { id: 4, status: 1, created_date: now(), sort_order: 4, image: '/uploads/gallery4.jpg' },
];

const faq = [
  { id: 1, status: 1, created_date: now(), sort_order: 1 },
  { id: 2, status: 1, created_date: now(), sort_order: 2 },
  { id: 3, status: 1, created_date: now(), sort_order: 3 },
  { id: 4, status: 1, created_date: now(), sort_order: 4 },
];

const faq_label = [
  { id: 1, faq_id: 1, language_id: 1, question: 'How do I create an account?', answer: 'Click Register at the top of the page and fill in the form. You can also explore as a guest.' },
  { id: 2, faq_id: 2, language_id: 1, question: 'What is the difference between Silver and Gold?', answer: 'Silver unlocks premium tests; Gold adds full TOEFL/IELTS, downloadable books, and private tutoring.' },
  { id: 3, faq_id: 3, language_id: 1, question: 'Can I cancel my membership?', answer: 'Yes — open your Account → Subscription page and contact us through the form.' },
  { id: 4, faq_id: 4, language_id: 1, question: 'Are there mobile apps?', answer: 'The site is fully responsive. Native apps are on the roadmap.' },
];

const membership = [
  { id: 1, status: 1, sort_ortder: 1, price: 0, vip: 0 },
  { id: 2, status: 1, sort_ortder: 2, price: 9.99, vip: 0 },
  { id: 3, status: 1, sort_ortder: 3, price: 19.99, vip: 1 },
];

const membership_label = [
  { id: 1, membership_id: 1, language_id: 1, title: 'Free', short_description: 'Start learning at no cost', description: '<ul><li>Limited tests</li><li>Account & basic statistics</li></ul>' },
  { id: 2, membership_id: 2, language_id: 1, title: 'Silver', short_description: 'Unlock premium practice', description: '<ul><li>All test categories</li><li>Lessons & CV templates</li><li>Limited TOEFL/IELTS</li></ul>' },
  { id: 3, membership_id: 3, language_id: 1, title: 'Gold', short_description: 'Everything, no limits', description: '<ul><li>Full TOEFL & IELTS</li><li>Downloadable books</li><li>Private tutoring</li></ul>' },
];

// TOEFL
const toefl_reading = [
  { id: 1, sort_order: 1, status: 1, trainings: 0, created_date: now(), time: '01:00:00', image: '', toefl_type: 0, title: 'TOEFL Reading — Set A', tier: 'silver' },
  { id: 2, sort_order: 2, status: 1, trainings: 0, created_date: now(), time: '01:00:00', image: '', toefl_type: 0, title: 'TOEFL Reading — Set B', tier: 'gold' },
];
const toefl_reading_label = [
  { id: 1, toefl_reading_id: 1, language_id: 1, title: 'TOEFL Reading — Set A', description: 'Standard 60-minute TOEFL reading practice.' },
  { id: 2, toefl_reading_id: 2, language_id: 1, title: 'TOEFL Reading — Set B', description: 'Advanced TOEFL reading practice.' },
];
const toefl_reading_test = [
  { id: 1, toefl_reding_id: 1, sort_order: 1, status: 1, text: 'Modern cities face a paradox: the more efficient transit becomes, the more residents move outward, recreating the very congestion the system was meant to relieve. Researchers have long studied this phenomenon, often termed induced demand. The pattern repeats across most metropolitan regions.' },
  { id: 2, toefl_reding_id: 1, sort_order: 2, status: 1, text: 'The migration patterns of monarch butterflies span thousands of kilometers and require multiple generations to complete. Each generation contributes only a leg of the journey. The genetic encoding of the route remains an active area of research.' },
];
const toefl_reading_test_question = [
  { id: 1, toefl_reading_test_id: 1, sort_order: 1, status: 1, type: 1, text: 'According to the passage, what is "induced demand"?' },
  { id: 2, toefl_reading_test_id: 1, sort_order: 2, status: 1, type: 1, text: 'The author suggests transit improvements often:' },
  { id: 3, toefl_reading_test_id: 2, sort_order: 1, status: 1, type: 1, text: 'How long does a single butterfly contribute to the journey?' },
];
const toefl_reading_test_answer = [
  { id: 1, toefl_reading_test_question_id: 1, true_false: 1, text: 'New capacity attracts new usage, offsetting gains.' },
  { id: 2, toefl_reading_test_question_id: 1, true_false: 0, text: 'A drop in housing costs.' },
  { id: 3, toefl_reading_test_question_id: 1, true_false: 0, text: 'A reduction in fuel taxes.' },
  { id: 4, toefl_reading_test_question_id: 1, true_false: 0, text: 'A change in air quality.' },
  { id: 5, toefl_reading_test_question_id: 2, true_false: 1, text: 'Increase outward migration.' },
  { id: 6, toefl_reading_test_question_id: 2, true_false: 0, text: 'Eliminate congestion.' },
  { id: 7, toefl_reading_test_question_id: 2, true_false: 0, text: 'Reduce population.' },
  { id: 8, toefl_reading_test_question_id: 2, true_false: 0, text: 'Lower property taxes.' },
  { id: 9, toefl_reading_test_question_id: 3, true_false: 1, text: 'Only a portion of the route.' },
  { id: 10, toefl_reading_test_question_id: 3, true_false: 0, text: 'The entire route.' },
  { id: 11, toefl_reading_test_question_id: 3, true_false: 0, text: 'Two full migrations.' },
  { id: 12, toefl_reading_test_question_id: 3, true_false: 0, text: 'Random sections.' },
];

const toefl_listening = [
  { id: 1, sort_order: 1, status: 1, created_date: now(), time: '00:40:00', tier: 'silver', title: 'TOEFL Listening — Set A' },
  { id: 2, sort_order: 2, status: 1, created_date: now(), time: '00:40:00', tier: 'gold', title: 'TOEFL Listening — Set B' },
];
const toefl_listening_label = [
  { id: 1, toefl_listening_id: 1, language_id: 1, title: 'TOEFL Listening — Set A', description: 'Lecture and conversation practice.' },
  { id: 2, toefl_listening_id: 2, language_id: 1, title: 'TOEFL Listening — Set B', description: 'Advanced TOEFL listening.' },
];
const toefl_listening_test = [
  { id: 1, toefl_listening_id: 1, status: 1, audio: '/uploads/listening1.mp3', image: '' },
];
const toefl_listening_test_question = [
  { id: 1, toefl_listening_test_id: 1, status: 1, type: 1, question: 'What is the lecture mostly about?' },
];
const toefl_listening_test_question_answers = [
  { id: 1, toefl_listening_test_question_id: 1, true_false: 1, value: 'Climate adaptation.' },
  { id: 2, toefl_listening_test_question_id: 1, true_false: 0, value: 'Economic policy.' },
  { id: 3, toefl_listening_test_question_id: 1, true_false: 0, value: 'Folk music.' },
  { id: 4, toefl_listening_test_question_id: 1, true_false: 0, value: 'Maritime trade.' },
];

const toefl_speaking = [
  { id: 1, sort_order: 1, status: 1, tier: 'silver', title: 'Speaking Prompt — Personal Choice' },
  { id: 2, sort_order: 2, status: 1, tier: 'gold', title: 'Speaking Prompt — Campus Issue' },
];
const toefl_writing = [
  { id: 1, sort_order: 1, status: 1, tier: 'silver', kind: 'integrated', title: 'Integrated — Lecture vs Reading' },
  { id: 2, sort_order: 2, status: 1, tier: 'gold', kind: 'independent', title: 'Independent — Agree/Disagree' },
];

// IELTS
const ielts_reading = [
  { id: 1, status: 1, ielts_type: 0, type: 0, sort_order: 1, created_date: now(), reading_text: 'Coastal erosion has accelerated in many regions, prompting infrastructure changes. Engineers have begun integrating natural defenses such as oyster reefs alongside seawalls.', tier: 'silver', title: 'IELTS GT Reading — Coastal Defense' },
  { id: 2, status: 1, ielts_type: 1, type: 0, sort_order: 1, created_date: now(), reading_text: 'A long-term study of urban tree canopies found measurable cooling effects in dense neighborhoods, with implications for public health policy.', tier: 'gold', title: 'IELTS Academic Reading — Urban Canopy' },
];
const ielts_reading_question = [
  { id: 1, ielts_reading_id: 1, sort_order: 1, question: 'What is one natural defense mentioned?', sentences: '' },
  { id: 2, ielts_reading_id: 2, sort_order: 1, question: 'What did the canopy study measure?', sentences: '' },
];
const ielts_reading_question_answer = [
  { id: 1, ielts_reading_question_id: 1, answer: 'Oyster reefs', true_false: 1 },
  { id: 2, ielts_reading_question_id: 1, answer: 'Coral platforms', true_false: 0 },
  { id: 3, ielts_reading_question_id: 1, answer: 'Sand dunes', true_false: 0 },
  { id: 4, ielts_reading_question_id: 1, answer: 'Mangrove planting', true_false: 0 },
  { id: 5, ielts_reading_question_id: 2, answer: 'Cooling effects', true_false: 1 },
  { id: 6, ielts_reading_question_id: 2, answer: 'Bird migration', true_false: 0 },
  { id: 7, ielts_reading_question_id: 2, answer: 'Soil acidity', true_false: 0 },
  { id: 8, ielts_reading_question_id: 2, answer: 'Wind speed', true_false: 0 },
];

const ielts_listening = [
  { id: 1, status: 1, ielts_type: 0, sort_order: 1, created_date: now(), audio: '/uploads/ielts-listen-1.mp3', tier: 'silver', title: 'IELTS GT Listening — Set A' },
];
const ielts_speaking = [
  { id: 1, status: 1, ielts_type: 0, sort_order: 1, tier: 'silver', title: 'IELTS GT Speaking — Part 1' },
];
const ielts_writing = [
  { id: 1, status: 1, ielts_type: 0, sort_order: 1, tier: 'silver', title: 'IELTS GT Writing — Letter' },
  { id: 2, status: 1, ielts_type: 1, sort_order: 1, tier: 'gold', title: 'IELTS Academic Writing — Task 2' },
];

// Lessons
const lessons_levels = [
  { id: 1, status: 1, sort_order: 1, name: 'Beginner' },
  { id: 2, status: 1, sort_order: 2, name: 'Intermediate' },
  { id: 3, status: 1, sort_order: 3, name: 'Advanced' },
];
const lessons_filters = [
  { id: 1, status: 1, sort_order: 1, name: 'Vocabulary' },
  { id: 2, status: 1, sort_order: 2, name: 'Grammar' },
  { id: 3, status: 1, sort_order: 3, name: 'Pronunciation' },
  { id: 4, status: 1, sort_order: 4, name: 'Idioms & Phrases' },
];
const lessons = [
  { id: 1, level_id: 1, filter_id: 1, status: 1, sort_order: 1, image: '', name: 'Everyday Vocabulary', description: 'Common words for daily situations.', duration: '15 min', lesson: '<p>Greetings, shopping, asking for directions.</p>' },
  { id: 2, level_id: 1, filter_id: 2, status: 1, sort_order: 2, image: '', name: 'Present Simple', description: 'When and how to use it.', duration: '20 min', lesson: '<p>Form, usage, and exceptions.</p>' },
  { id: 3, level_id: 2, filter_id: 2, status: 1, sort_order: 3, image: '', name: 'Conditionals', description: 'Zero, first, second, third.', duration: '25 min', lesson: '<p>Patterns and meaning.</p>' },
  { id: 4, level_id: 2, filter_id: 3, status: 1, sort_order: 4, image: '', name: 'Word Stress', description: 'Why stress matters in English.', duration: '15 min', lesson: '<p>Patterns and exceptions.</p>' },
  { id: 5, level_id: 3, filter_id: 4, status: 1, sort_order: 5, image: '', name: 'Business Idioms', description: 'For meetings and emails.', duration: '20 min', lesson: '<p>Common idioms with examples.</p>' },
];

// Slideshow / hero
const slideshow = [
  { id: 1, status: 1, sort_order: 1, image: '/uploads/hero1.jpg', href: '/tests/audio' },
  { id: 2, status: 1, sort_order: 2, image: '/uploads/hero2.jpg', href: '/toefl/reading' },
  { id: 3, status: 1, sort_order: 3, image: '/uploads/hero3.jpg', href: '/ielts/general/reading' },
];
const slideshow_label = [
  { id: 1, slideshow_id: 1, language_id: 1, value: '<h2>Practice Every Day</h2><p>Hundreds of timed tests across six categories.</p>' },
  { id: 2, slideshow_id: 2, language_id: 1, value: '<h2>Prepare for TOEFL</h2><p>Real exam conditions, full review screens.</p>' },
  { id: 3, slideshow_id: 3, language_id: 1, value: '<h2>IELTS — General & Academic</h2><p>Both tracks, every section.</p>' },
];

// Site config and people
const contact_info = [
  { id: 1, email: 'info@english.am', phone: '+374 10 000 000', address: 'Yerevan, Armenia' },
];
const socials = [
  { id: 1, status: 1, sort_order: 1, favicon: 'fab fa-facebook', href: 'https://facebook.com/' },
  { id: 2, status: 1, sort_order: 2, favicon: 'fab fa-instagram', href: 'https://instagram.com/' },
  { id: 3, status: 1, sort_order: 3, favicon: 'fab fa-youtube', href: 'https://youtube.com/' },
];

const cv = [
  { id: 1, status: 1, sort_order: 1, cv_name: 'Modern Resume', html_code: '<h1>Modern</h1>', thumb: '/uploads/cv1.jpg', key: 'modern' },
  { id: 2, status: 1, sort_order: 2, cv_name: 'Classic Letter', html_code: '<h1>Classic</h1>', thumb: '/uploads/cv2.jpg', key: 'classic' },
];

const static_pages = [
  { id: 1, page_key: 'about', created_date: now(), title: 'About Us', body: '<p>English.am is a learning platform run by an NGO. We make English accessible.</p>' },
  { id: 2, page_key: 'privacy', created_date: now(), title: 'Privacy Policy', body: '<p>We respect your privacy.</p>' },
  { id: 3, page_key: 'terms', created_date: now(), title: 'Terms of Service', body: '<p>By using this site you agree to these terms.</p>' },
];

const downloadable_content = [
  { id: 1, status: 1, sort_order: 1, name: 'TOEFL Vocabulary List', tier: 'gold', file: '/uploads/toefl-vocab.pdf' },
  { id: 2, status: 1, sort_order: 2, name: 'IELTS Writing Templates', tier: 'gold', file: '/uploads/ielts-writing.pdf' },
];

// Users (md5 hash for legacy parity, but auth supports bcrypt for new accounts)
const users = [
  { id: 1, block: 0, user_name: 'demo', password: 'fe01ce2a7fbac8fafaed7c982a04e229', email: 'demo@english.am', first_name: 'Demo', last_name: 'User', gender: 1, dob: null, avatar: '', created_date: now(), last_login_date: now(), phone: '', address: '', auth_kind: 'md5' },
];

const admins_groups = [
  { id: 1, title: 'Super Admin', accesses: 'all' },
  { id: 2, title: 'Editor', accesses: 'news,gallery,faq,slideshow' },
];
const admins = [
  { id: 1, group_id: 1, status: 1, created_date: now(), email: 'admin@english.am', password: 'fe01ce2a7fbac8fafaed7c982a04e229', name: 'Demo Admin', avatar: '', auth_kind: 'md5' },
];

const user_history = [];
const user_has_membership = [];
const contact_messages = [];

const settings = [
  { key: 'site_name', value: 'English.am' },
  { key: 'mailing_list_enabled', value: '1' },
];

const seo_urls = [];
const page_images = [
  { id: 1, key: 'home_page_about_us', image: '/uploads/about-home.jpg' },
  { id: 2, key: 'home_page_why_section', image: '/uploads/why-home.jpg' },
];
const dictionary = [];
const reviews = [
  { id: 1, status: 1, sort_order: 1, name: 'Anna', text: 'The TOEFL practice helped me reach 102.', avatar: '' },
  { id: 2, status: 1, sort_order: 2, name: 'Tigran', text: 'I love the lessons; they are short and useful.', avatar: '' },
];

module.exports = {
  languages,
  translation,
  translation_label,
  category,
  category_label,
  test_level,
  test_level_label,
  test_category,
  test_category_label,
  test,
  test_label,
  test_answer,
  news,
  news_label,
  gallery,
  faq,
  faq_label,
  membership,
  membership_label,
  toefl_reading,
  toefl_reading_label,
  toefl_reading_test,
  toefl_reading_test_question,
  toefl_reading_test_answer,
  toefl_listening,
  toefl_listening_label,
  toefl_listening_test,
  toefl_listening_test_question,
  toefl_listening_test_question_answers,
  toefl_speaking,
  toefl_writing,
  ielts_reading,
  ielts_reading_question,
  ielts_reading_question_answer,
  ielts_listening,
  ielts_speaking,
  ielts_writing,
  lessons_levels,
  lessons_filters,
  lessons,
  slideshow,
  slideshow_label,
  contact_info,
  socials,
  cv,
  static_pages,
  downloadable_content,
  users,
  admins,
  admins_groups,
  user_history,
  user_has_membership,
  contact_messages,
  settings,
  seo_urls,
  page_images,
  dictionary,
  reviews,
};
