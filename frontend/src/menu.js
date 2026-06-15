// Menu structure mirrors the legacy admin sidebar.
// `path` is the React route, `table` is the Django API endpoint name (db_table).

export const menu = [
  { type: 'header', label: 'MAIN NAVIGATION' },

  { type: 'item', icon: 'fa-envelope', label: 'Contact email', path: '/contactMessages', table: 'contact_messages' },

  {
    type: 'tree', icon: 'fa-tags', label: 'Catalog', children: [
      { label: 'Headers', path: '/category', table: 'category' },
      { label: 'Choose Home Page Categories', path: '/chooseYourCategory', table: 'choose_your_category' },
      { label: 'Test Filters', path: '/testCategory', table: 'test_category' },
      { label: 'Test Level', path: '/testLevel', table: 'test_level' },
    ],
  },

  { type: 'tree', icon: 'fa-tags', label: 'Tests', dynamic: 'tests' },

  { type: 'item', icon: 'fa-video-camera', label: 'Demo videos', path: '/demoVideos', table: 'demo_videos' },

  {
    type: 'tree', icon: 'fa-tags', label: 'Subject matter', children: [
      { label: 'Levels', path: '/lessonsLevels', table: 'lessons_levels' },
      { label: 'Category', path: '/lessonsFilters', table: 'lessons_filters' },
      { label: 'Subject matter', path: '/lessons', table: 'lessons' },
    ],
  },

  { type: 'item', icon: 'fa-cc-amex', label: 'Membership', path: '/membership', table: 'membership' },
  { type: 'item', icon: 'fa-id-card-o', label: 'CV', path: '/cv', table: 'cv' },
  { type: 'item', icon: 'fa-envelope', label: 'Inbox', path: '/inbox', table: 'inbox' },
  { type: 'item', icon: 'fa-television', label: 'Wrong Answers', path: '/wrongAnswers', table: 'wrong_answers' },
  { type: 'item', icon: 'fa-graduation-cap', label: 'Schools Template', path: '/schoolTemplate', table: 'school_template' },
  { type: 'item', icon: 'fa-book', label: 'Dictionary', path: '/dictionary', table: 'dictionary' },
  { type: 'item', icon: 'fa-television', label: 'Gallery', path: '/gallery', table: 'gallery' },
  { type: 'item', icon: 'fa-television', label: 'News', path: '/news', table: 'news' },
  { type: 'item', icon: 'fa-television', label: 'Slide Show', path: '/slideshow', table: 'slideshow' },
  { type: 'item', icon: 'fa-circle-o', label: 'Information', path: '/staticPages', table: 'static_pages' },
  { type: 'item', icon: 'fa-certificate', label: 'All Certificates', path: '/AllCertificates', table: 'all_certificates' },
  { type: 'item', icon: 'fa-certificate', label: 'Certificates', path: '/certificate', table: 'certificate' },
  { type: 'item', icon: 'fa-comments', label: 'FAQ', path: '/faq', table: 'faq' },
  { type: 'item', icon: 'fa-eye', label: 'Review', path: '/Review', table: 'review' },
  { type: 'item', icon: 'fa-eye', label: 'Downloadable Content', path: '/Download', table: 'downloadable_content' },
  { type: 'item', icon: 'fa-share-alt', label: 'Socials', path: '/socials', table: 'socials' },

  {
    type: 'tree', icon: 'fa-user-secret', label: 'Admins', children: [
      { label: 'Admins', path: '/admins', table: 'admins' },
      { label: 'User Groups', path: '/adminsGroups', table: 'admins_groups' },
    ],
  },

  { type: 'item', icon: 'fa-user', label: 'Users', path: '/users', table: 'users' },
  { type: 'item', icon: 'fa-link', label: 'Seo Urls', path: '/seoUrls', table: 'seo_urls' },

  {
    type: 'tree', icon: 'fa-wrench', label: 'Settings', children: [
      { label: 'Translations', path: '/translation', table: 'translation' },
      { label: 'Menu control', path: '/menuControl', table: null },
      { label: 'Page images', path: '/pageImages', table: 'page_images' },
      { label: 'Languages', path: '/languages', table: 'languages' },
      { label: 'Currency', path: '/currency', table: 'currency' },
      { label: 'Site Contacts', path: '/siteContacts', table: null },
    ],
  },
];

// Flatten to all routable leaves (excludes nav-only items and dynamic trees).
export function allRoutes() {
  const out = [];
  for (const node of menu) {
    if (node.type === 'item' && !node.nav) out.push(node);
    else if (node.type === 'tree' && node.children) {
      for (const c of node.children) if (!c.nav) out.push(c);
    }
  }
  return out;
}
