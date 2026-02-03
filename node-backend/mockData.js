// Mock data for testing without database

const mockData = {
  languages: [
    { id: 1, code: 'en', name: 'English' },
    { id: 2, code: 'hy', name: 'Armenian' },
    { id: 3, code: 'ru', name: 'Russian' }
  ],

  categories: [
    { id: 1, parent_id: 0, sort_order: 1, key: 'tests', label: 'Tests', children: [
      { id: 2, parent_id: 1, sort_order: 1, key: 'audio', label: 'Audio Tests', children: [] },
      { id: 3, parent_id: 1, sort_order: 2, key: 'synonyms', label: 'Synonyms', children: [] },
      { id: 4, parent_id: 1, sort_order: 3, key: 'antonyms', label: 'Antonyms', children: [] },
      { id: 5, parent_id: 1, sort_order: 4, key: 'grammar', label: 'Grammar', children: [] }
    ]},
    { id: 6, parent_id: 0, sort_order: 2, key: 'toefl', label: 'TOEFL', children: [] },
    { id: 7, parent_id: 0, sort_order: 3, key: 'ielts', label: 'IELTS', children: [] },
    { id: 8, parent_id: 0, sort_order: 4, key: 'lessons', label: 'Lessons', children: [] }
  ],

  testCategories: [
    { id: 1, category_id: 2, parent_id: 0, name: 'Audio Comprehension', description: 'Test your listening skills', sortOrder: 1 },
    { id: 2, category_id: 3, parent_id: 0, name: 'Word Synonyms', description: 'Find the synonym', sortOrder: 1 },
    { id: 3, category_id: 4, parent_id: 0, name: 'Word Antonyms', description: 'Find the antonym', sortOrder: 1 },
    { id: 4, category_id: 5, parent_id: 0, name: 'Grammar Basics', description: 'Test your grammar', sortOrder: 1 }
  ],

  testLevels: [
    { id: 1, name: 'Beginner', sortOrder: 1 },
    { id: 2, name: 'Elementary', sortOrder: 2 },
    { id: 3, name: 'Intermediate', sortOrder: 3 },
    { id: 4, name: 'Upper Intermediate', sortOrder: 4 },
    { id: 5, name: 'Advanced', sortOrder: 5 }
  ],

  tests: [
    {
      id: 1,
      testCategoryId: 2,
      title: 'Common Synonyms Test 1',
      description: 'Find the correct synonym for each word',
      levelId: 1,
      questions: [
        {
          id: 1,
          question: 'What is a synonym for "happy"?',
          answers: [
            { id: 1, text: 'Sad', isCorrect: false },
            { id: 2, text: 'Joyful', isCorrect: true },
            { id: 3, text: 'Angry', isCorrect: false },
            { id: 4, text: 'Tired', isCorrect: false }
          ]
        },
        {
          id: 2,
          question: 'What is a synonym for "big"?',
          answers: [
            { id: 5, text: 'Small', isCorrect: false },
            { id: 6, text: 'Tiny', isCorrect: false },
            { id: 7, text: 'Large', isCorrect: true },
            { id: 8, text: 'Short', isCorrect: false }
          ]
        },
        {
          id: 3,
          question: 'What is a synonym for "fast"?',
          answers: [
            { id: 9, text: 'Quick', isCorrect: true },
            { id: 10, text: 'Slow', isCorrect: false },
            { id: 11, text: 'Heavy', isCorrect: false },
            { id: 12, text: 'Light', isCorrect: false }
          ]
        }
      ]
    },
    {
      id: 2,
      testCategoryId: 3,
      title: 'Common Antonyms Test 1',
      description: 'Find the correct antonym for each word',
      levelId: 1,
      questions: [
        {
          id: 4,
          question: 'What is an antonym for "hot"?',
          answers: [
            { id: 13, text: 'Warm', isCorrect: false },
            { id: 14, text: 'Cold', isCorrect: true },
            { id: 15, text: 'Burning', isCorrect: false },
            { id: 16, text: 'Heated', isCorrect: false }
          ]
        },
        {
          id: 5,
          question: 'What is an antonym for "light"?',
          answers: [
            { id: 17, text: 'Bright', isCorrect: false },
            { id: 18, text: 'Dark', isCorrect: true },
            { id: 19, text: 'Shiny', isCorrect: false },
            { id: 20, text: 'Glowing', isCorrect: false }
          ]
        }
      ]
    },
    {
      id: 3,
      testCategoryId: 4,
      title: 'Basic Grammar Test 1',
      description: 'Test your basic grammar knowledge',
      levelId: 2,
      questions: [
        {
          id: 6,
          question: 'Choose the correct sentence:',
          answers: [
            { id: 21, text: 'She go to school every day.', isCorrect: false },
            { id: 22, text: 'She goes to school every day.', isCorrect: true },
            { id: 23, text: 'She going to school every day.', isCorrect: false },
            { id: 24, text: 'She gone to school every day.', isCorrect: false }
          ]
        }
      ]
    }
  ],

  slideshows: [
    {
      id: 1,
      image: '/images/slide1.jpg',
      status: 1,
      sort_order: 1,
      title: 'Welcome to English.am',
      value: 'Your gateway to mastering English'
    },
    {
      id: 2,
      image: '/images/slide2.jpg',
      status: 1,
      sort_order: 2,
      title: 'TOEFL Preparation',
      value: 'Prepare for your TOEFL exam with our comprehensive courses'
    },
    {
      id: 3,
      image: '/images/slide3.jpg',
      status: 1,
      sort_order: 3,
      title: 'IELTS Training',
      value: 'Achieve your target band score with expert guidance'
    }
  ],

  news: [
    {
      id: 1,
      image: '/images/news1.jpg',
      status: 1,
      created_date: '2024-01-15',
      title: 'New TOEFL Practice Tests Available',
      value: 'We have added 50 new practice tests for TOEFL preparation. Start practicing today!'
    },
    {
      id: 2,
      image: '/images/news2.jpg',
      status: 1,
      created_date: '2024-01-10',
      title: 'IELTS Speaking Workshop',
      value: 'Join our free online workshop on IELTS Speaking strategies this weekend.'
    },
    {
      id: 3,
      image: '/images/news3.jpg',
      status: 1,
      created_date: '2024-01-05',
      title: 'Holiday Special Discount',
      value: 'Get 30% off on all premium memberships until the end of January!'
    }
  ],

  memberships: [
    {
      id: 1,
      price: 0,
      duration: 0,
      status: 1,
      sort_order: 1,
      title: 'Free',
      value: 'Access to basic tests and limited content'
    },
    {
      id: 2,
      price: 9.99,
      duration: 30,
      status: 1,
      sort_order: 2,
      title: 'Monthly',
      value: 'Full access to all tests and content for 30 days'
    },
    {
      id: 3,
      price: 49.99,
      duration: 180,
      status: 1,
      sort_order: 3,
      title: 'Semi-Annual',
      value: 'Best value! 6 months of unlimited access'
    },
    {
      id: 4,
      price: 89.99,
      duration: 365,
      status: 1,
      sort_order: 4,
      title: 'Annual',
      value: 'Full year access with premium support'
    }
  ],

  testimonials: [
    {
      id: 1,
      status: 1,
      text: 'English.am helped me improve my TOEFL score by 20 points! The practice tests are excellent.',
      user: { id: 1, first_name: 'Anna', last_name: 'M.', avatar: null }
    },
    {
      id: 2,
      status: 1,
      text: 'I achieved my target IELTS band score thanks to the comprehensive materials here.',
      user: { id: 2, first_name: 'David', last_name: 'K.', avatar: null }
    },
    {
      id: 3,
      status: 1,
      text: 'The audio tests really helped improve my listening comprehension skills.',
      user: { id: 3, first_name: 'Maria', last_name: 'S.', avatar: null }
    }
  ],

  gallery: [
    { id: 1, image: '/images/gallery1.jpg', status: 1, created_date: '2024-01-01' },
    { id: 2, image: '/images/gallery2.jpg', status: 1, created_date: '2024-01-02' },
    { id: 3, image: '/images/gallery3.jpg', status: 1, created_date: '2024-01-03' },
    { id: 4, image: '/images/gallery4.jpg', status: 1, created_date: '2024-01-04' },
    { id: 5, image: '/images/gallery5.jpg', status: 1, created_date: '2024-01-05' },
    { id: 6, image: '/images/gallery6.jpg', status: 1, created_date: '2024-01-06' }
  ],

  pageImages: {
    home_page_review: '/images/review-bg.jpg',
    home_page_about_us: '/images/about-us.jpg',
    home_page_why_section: '/images/why-section.jpg',
    home_page_why_section_girl: '/images/why-girl.jpg'
  },

  aboutContent: {
    id: 1,
    page_key: 'about_us',
    status: 1,
    title: 'About English.am',
    value: 'English.am is a comprehensive online platform for learning English. We provide high-quality resources for TOEFL, IELTS, and general English proficiency. Our mission is to make English learning accessible and effective for everyone.'
  },

  whyChooseContent: {
    id: 2,
    page_key: 'why',
    status: 1,
    title: 'Why Choose Us',
    value: 'Expert instructors, comprehensive materials, flexible learning, and proven results. Join thousands of successful learners who have achieved their English goals with us.'
  },

  users: [
    { id: 1, email: 'test@example.com', password: '$2b$10$test', first_name: 'Test', last_name: 'User', block: 0 }
  ]
};

module.exports = mockData;
