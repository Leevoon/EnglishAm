# Table Naming Analysis

**183 legacy tables** analyzed. Suggested class names below, grouped by relationship pattern.

| Pattern | Count | Rule |
|---|---|---|
| legacy | 4 | `Old_xxx` prefix → `LegacyXxx` |
| translation | 27 | `xxx_label` + FK to `languages` → `XxxTranslation` |
| explanation | 8 | `xxx_explain` → `XxxExplanation` |
| reply | 1 | `xxx_reply` → `XxxReply` |
| junction | 16 | `xxx_has_yyy` → M2M; collapse into a `ManyToManyField` |
| question | 7 | `xxx_question` → `XxxQuestion` |
| answer | 2 | `xxx_question_answer` → `XxxAnswer` |
| subtest | 7 | `xxx_test` (child) → `XxxTest` |
| completion | 2 | `xxx_complete` → `XxxComplete` (a full assembled test) |
| entity | 109 | Standalone entity — PascalCase singular |

## Legacy (4)

| Current `db_table` | Suggested class | Notes |
|---|---|---|
| `Old_training_reading` | **`LegacyTrainingReading`** | Old_ prefix → legacy/deprecated table |
| `Old_training_reading_explain` | **`LegacyTrainingReadingExplain`** | Old_ prefix → legacy/deprecated table |
| `Old_training_reading_label` | **`LegacyTrainingReadingLabel`** | Old_ prefix → legacy/deprecated table |
| `Old_training_reading_test` | **`LegacyTrainingReadingTest`** | Old_ prefix → legacy/deprecated table |

## Translation (27)

| Current `db_table` | Suggested class | Notes |
|---|---|---|
| `all_certificates_label` | **`AllCertificateTranslation`** | _label suffix + FK to languages + FK to all_certificates |
| `category_label` | **`CategoryTranslation`** | _label suffix + FK to languages + FK to category |
| `contact_info_label` | **`ContactInfoTranslation`** | _label suffix + FK to languages + FK to contact_info |
| `demo_videos_label` | **`DemoVideoTranslation`** | _label suffix + FK to languages + FK to demo_videos |
| `faq_label` | **`FaqTranslation`** | _label suffix + FK to languages + FK to faq |
| `ielts_writing_label` | **`IeltsWritingTranslation`** | _label suffix + FK to languages + FK to ielts_writing |
| `lessons_filters_label` | **`LessonsFilterTranslation`** | _label suffix + FK to languages + FK to lessons_filters |
| `lessons_label` | **`LessonTranslation`** | _label suffix + FK to languages + FK to lessons |
| `lessons_levels_filters_label` | **`LessonsLevelsFilterTranslation`** | _label suffix + FK to languages + FK to lessons_levels_filters |
| `lessons_levels_label` | **`LessonsLevelTranslation`** | _label suffix + FK to languages + FK to lessons_levels |
| `membership_label` | **`MembershipTranslation`** | _label suffix + FK to languages + FK to membership |
| `news_label` | **`NewTranslation`** | _label suffix + FK to languages + FK to news |
| `slideshow_label` | **`SlideshowTranslation`** | _label suffix + FK to languages + FK to slideshow |
| `static_pages_label` | **`StaticPageTranslation`** | _label suffix + FK to languages + FK to static_pages |
| `test_category_label` | **`TestCategoryTranslation`** | _label suffix + FK to languages + FK to test_category |
| `test_label` | **`TestTranslation`** | _label suffix + FK to languages + FK to test |
| `toefl_complete_label` | **`ToeflCompleteTranslation`** | _label suffix + FK to languages + FK to toefl_complete |
| `toefl_listening_label` | **`ToeflListeningTranslation`** | _label suffix + FK to languages + FK to toefl_listening |
| `toefl_reading_label` | **`ToeflReadingTranslation`** | _label suffix + FK to languages + FK to toefl_reading |
| `toefl_speaking_label` | **`ToeflSpeakingTranslation`** | _label suffix + FK to languages + FK to toefl_speaking |
| `toefl_writing_label` | **`ToeflWritingTranslation`** | _label suffix + FK to languages + FK to toefl_writing |
| `training_listening_test_label` | **`TrainingListeningTestTranslation`** | _label suffix + FK to languages + FK to training_listening_test |
| `training_listening_test_question_label` | **`TrainingListeningTestQuestionTranslation`** | _label suffix + FK to languages + FK to training_listening_test_question |
| `training_reading_label` | **`TrainingReadingTranslation`** | _label suffix + FK to languages + FK to training_reading |
| `training_speaking_label` | **`TrainingSpeakingTranslation`** | _label suffix + FK to languages + FK to training_speaking |
| `training_writing_label` | **`TrainingWritingTranslation`** | _label suffix + FK to languages + FK to training_writing |
| `translation_label` | **`TranslationTranslation`** | _label suffix + FK to languages + FK to translation |

## Explanation (8)

| Current `db_table` | Suggested class | Notes |
|---|---|---|
| `ielts_speaking_explain` | **`IeltsSpeakingExplanation`** | _explain suffix → explanation/intro row for parent |
| `toefl_listening_explain` | **`ToeflListeningExplanation`** | _explain suffix → explanation/intro row for parent |
| `toefl_reading_explain` | **`ToeflReadingExplanation`** | _explain suffix → explanation/intro row for parent |
| `toefl_speaking_explain` | **`ToeflSpeakingExplanation`** | _explain suffix → explanation/intro row for parent |
| `toefl_writing_explain` | **`ToeflWritingExplanation`** | _explain suffix → explanation/intro row for parent |
| `training_reading_explain` | **`TrainingReadingExplanation`** | _explain suffix → explanation/intro row for parent |
| `training_speaking_explain` | **`TrainingSpeakingExplanation`** | _explain suffix → explanation/intro row for parent |
| `training_writing_explain` | **`TrainingWritingExplanation`** | _explain suffix → explanation/intro row for parent |

## Reply (1)

| Current `db_table` | Suggested class | Notes |
|---|---|---|
| `conversation_reply` | **`ConversationReply`** | _reply suffix → reply to parent |

## Junction (16)

| Current `db_table` | Suggested class | Notes |
|---|---|---|
| `category_has_tests` | **`CategoryTest`** | _has_ infix → M2M between category and tests; suggest ManyToManyField on Category |
| `ielts_complete_has_listening` | **`IeltsCompleteListening`** | _has_ infix → M2M between ielts_complete and listening; suggest ManyToManyField on IeltsComplete |
| `ielts_complete_has_reading` | **`IeltsCompleteReading`** | _has_ infix → M2M between ielts_complete and reading; suggest ManyToManyField on IeltsComplete |
| `ielts_complete_has_speaking` | **`IeltsCompleteSpeaking`** | _has_ infix → M2M between ielts_complete and speaking; suggest ManyToManyField on IeltsComplete |
| `ielts_complete_has_writing` | **`IeltsCompleteWriting`** | _has_ infix → M2M between ielts_complete and writing; suggest ManyToManyField on IeltsComplete |
| `ielts_writing_user_answer_item_has_wrong` | **`IeltsWritingUserAnswerItemWrong`** | _has_ infix → M2M between ielts_writing_user_answer_item and wrong; suggest ManyToManyField on IeltsWritingUserAnswerItem |
| `lessons_levels_has_filters` | **`LessonsLevelFilter`** | _has_ infix → M2M between lessons_levels and filters; suggest ManyToManyField on LessonsLevel |
| `membership_has_test` | **`MembershipTest`** | _has_ infix → M2M between membership and test; suggest ManyToManyField on Membership |
| `school_template_has_tests` | **`SchoolTemplateTest`** | _has_ infix → M2M between school_template and tests; suggest ManyToManyField on SchoolTemplate |
| `toefl_complete_has_listening` | **`ToeflCompleteListening`** | _has_ infix → M2M between toefl_complete and listening; suggest ManyToManyField on ToeflComplete |
| `toefl_complete_has_reading` | **`ToeflCompleteReading`** | _has_ infix → M2M between toefl_complete and reading; suggest ManyToManyField on ToeflComplete |
| `toefl_complete_has_speaking` | **`ToeflCompleteSpeaking`** | _has_ infix → M2M between toefl_complete and speaking; suggest ManyToManyField on ToeflComplete |
| `toefl_complete_has_writing` | **`ToeflCompleteWriting`** | _has_ infix → M2M between toefl_complete and writing; suggest ManyToManyField on ToeflComplete |
| `user_has_membership` | **`UserMembership`** | _has_ infix → M2M between user and membership; suggest ManyToManyField on User |
| `user_writing_history_has_wrong` | **`UserWritingHistoryWrong`** | _has_ infix → M2M between user_writing_history and wrong; suggest ManyToManyField on UserWritingHistory |
| `writing_has_wrong_answer` | **`WritingWrongAnswer`** | _has_ infix → M2M between writing and wrong_answer; suggest ManyToManyField on Writing |

## Question (7)

| Current `db_table` | Suggested class | Notes |
|---|---|---|
| `ielts_listening_question` | **`IeltsListeningQuestion`** | _question / _test_question → question row in a test; plural→singular: ielts_listening_question → ielts_listening_question |
| `ielts_reading_question` | **`IeltsReadingQuestion`** | _question / _test_question → question row in a test; plural→singular: ielts_reading_question → ielts_reading_question |
| `listening_question` | **`ListeningQuestion`** | _question / _test_question → question row in a test; plural→singular: listening_question → listening_question |
| `toefl_listening_test_question` | **`ToeflListeningTestQuestion`** | _question / _test_question → question row in a test; plural→singular: toefl_listening_test_question → toefl_listening_test_question |
| `toefl_reading_test_question` | **`ToeflReadingTestQuestion`** | _question / _test_question → question row in a test; plural→singular: toefl_reading_test_question → toefl_reading_test_question |
| `training_listening_test_question` | **`TrainingListeningTestQuestion`** | _question / _test_question → question row in a test; plural→singular: training_listening_test_question → training_listening_test_question |
| `training_writing_question` | **`TrainingWritingQuestion`** | _question / _test_question → question row in a test; plural→singular: training_writing_question → training_writing_question |

## Answer (2)

| Current `db_table` | Suggested class | Notes |
|---|---|---|
| `ielts_listening_question_answer` | **`IeltsListeningQuestionAnswer`** | _question_answer → answer row of a question in a test; plural→singular: ielts_listening_question_answer → ielts_listening_question_answer |
| `ielts_reading_question_answer` | **`IeltsReadingQuestionAnswer`** | _question_answer → answer row of a question in a test; plural→singular: ielts_reading_question_answer → ielts_reading_question_answer |

## Subtest (7)

| Current `db_table` | Suggested class | Notes |
|---|---|---|
| `ielts_speaking_test` | **`IeltsSpeakingTest`** | _test suffix with parent FK → subtest/child test; plural→singular: ielts_speaking_test → ielts_speaking_test |
| `toefl_listening_test` | **`ToeflListeningTest`** | _test suffix with parent FK → subtest/child test; plural→singular: toefl_listening_test → toefl_listening_test |
| `toefl_reading_test` | **`ToeflReadingTest`** | _test suffix with parent FK → subtest/child test; plural→singular: toefl_reading_test → toefl_reading_test |
| `toefl_speaking_test` | **`ToeflSpeakingTest`** | _test suffix with parent FK → subtest/child test; plural→singular: toefl_speaking_test → toefl_speaking_test |
| `training_listening_test` | **`TrainingListeningTest`** | _test suffix with parent FK → subtest/child test; plural→singular: training_listening_test → training_listening_test |
| `training_reading_test` | **`TrainingReadingTest`** | _test suffix with parent FK → subtest/child test; plural→singular: training_reading_test → training_reading_test |
| `training_speaking_test` | **`TrainingSpeakingTest`** | _test suffix with parent FK → subtest/child test; plural→singular: training_speaking_test → training_speaking_test |

## Completion (2)

| Current `db_table` | Suggested class | Notes |
|---|---|---|
| `ielts_complete` | **`IeltsComplete`** | _complete suffix → full / completed assembly of parts; plural→singular: ielts_complete → ielts_complete |
| `toefl_complete` | **`ToeflComplete`** | _complete suffix → full / completed assembly of parts; plural→singular: toefl_complete → toefl_complete |

## Entity (109)

| Current `db_table` | Suggested class | Notes |
|---|---|---|
| `admins` | **`Admin`** | 0 FK out, 1 FK in |
| `admins_action` | **`AdminsAction`** | 1 FK out, 0 FK in |
| `admins_controler` | **`AdminsControler`** | 0 FK out, 1 FK in |
| `admins_groups` | **`AdminsGroup`** | 0 FK out, 0 FK in |
| `all_certificates` | **`AllCertificate`** | 0 FK out, 1 FK in |
| `category` | **`Category`** | 0 FK out, 3 FK in |
| `certificate` | **`Certificate`** | 1 FK out, 0 FK in |
| `choose_your_category` | **`ChooseYourCategory`** | 1 FK out, 0 FK in |
| `contact_info` | **`ContactInfo`** | 0 FK out, 1 FK in |
| `contact_messages` | **`ContactMessage`** | 0 FK out, 0 FK in |
| `conversation` | **`Conversation`** | 2 FK out, 1 FK in |
| `currency` | **`Currency`** | 0 FK out, 0 FK in |
| `cv` | **`Cv`** | 0 FK out, 0 FK in |
| `demo_videos` | **`DemoVideo`** | 0 FK out, 1 FK in |
| `dictionary` | **`Dictionary`** | 0 FK out, 1 FK in |
| `dictionary_label` | **`DictionaryLabel`** | 1 FK out, 0 FK in |
| `downloadable_content` | **`DownloadableContent`** | 1 FK out, 1 FK in |
| `downloadable_content_file` | **`DownloadableContentFile`** | 1 FK out, 0 FK in |
| `faq` | **`Faq`** | 0 FK out, 1 FK in |
| `gallery` | **`Gallery`** | 0 FK out, 0 FK in |
| `ielts_complete_history` | **`IeltsCompleteHistory`** | 2 FK out, 0 FK in |
| `ielts_complete_label` | **`IeltsCompleteLabel`** | 1 FK out, 0 FK in |
| `ielts_listening` | **`IeltsListening`** | 0 FK out, 3 FK in |
| `ielts_listening_label` | **`IeltsListeningLabel`** | 1 FK out, 0 FK in |
| `ielts_listening_user_answer` | **`IeltsListeningUserAnswer`** | 1 FK out, 0 FK in |
| `ielts_reading` | **`IeltsReading`** | 0 FK out, 4 FK in |
| `ielts_reading_label` | **`IeltsReadingLabel`** | 1 FK out, 0 FK in |
| `ielts_reading_user_answer` | **`IeltsReadingUserAnswer`** | 2 FK out, 0 FK in |
| `ielts_speaking` | **`IeltsSpeaking`** | 0 FK out, 1 FK in |
| `ielts_speaking_history` | **`IeltsSpeakingHistory`** | 0 FK out, 0 FK in |
| `ielts_speaking_label` | **`IeltsSpeakingLabel`** | 0 FK out, 0 FK in |
| `ielts_speaking_test_answer` | **`IeltsSpeakingTestAnswer`** | 0 FK out, 0 FK in |
| `ielts_speaking_test_users_answer` | **`IeltsSpeakingTestUsersAnswer`** | 0 FK out, 0 FK in |
| `ielts_writing` | **`IeltsWriting`** | 0 FK out, 3 FK in |
| `ielts_writing_questions` | **`IeltsWritingQuestion`** | 1 FK out, 1 FK in |
| `ielts_writing_user_answer` | **`IeltsWritingUserAnswer`** | 1 FK out, 1 FK in |
| `ielts_writing_user_answer_item` | **`IeltsWritingUserAnswerItem`** | 2 FK out, 1 FK in |
| `inbox` | **`Inbox`** | 1 FK out, 0 FK in |
| `languages` | **`Language`** | 0 FK out, 28 FK in |
| `lesson` | **`Lesson`** | 1 FK out, 0 FK in |
| `lessons` | **`Lesson`** | 2 FK out, 3 FK in |
| `lessons_filters` | **`LessonsFilter`** | 0 FK out, 2 FK in |
| `lessons_levels` | **`LessonsLevel`** | 0 FK out, 3 FK in |
| `lessons_levels_filters` | **`LessonsLevelsFilter`** | 0 FK out, 2 FK in |
| `listening` | **`Listening`** | 0 FK out, 2 FK in |
| `listening_answer` | **`ListeningAnswer`** | 1 FK out, 0 FK in |
| `listening_items` | **`ListeningItem`** | 1 FK out, 1 FK in |
| `membership` | **`Membership`** | 0 FK out, 8 FK in |
| `news` | **`New`** | 0 FK out, 1 FK in |
| `page_images` | **`PageImage`** | 0 FK out, 0 FK in |
| `profile_advertising` | **`ProfileAdvertising`** | 0 FK out, 0 FK in |
| `review` | **`Review`** | 0 FK out, 0 FK in |
| `school_template` | **`SchoolTemplate`** | 1 FK out, 2 FK in |
| `school_template_label` | **`SchoolTemplateLabel`** | 1 FK out, 0 FK in |
| `seo_urls` | **`SeoUrl`** | 0 FK out, 0 FK in |
| `settings` | **`Setting`** | 0 FK out, 0 FK in |
| `slideshow` | **`Slideshow`** | 0 FK out, 1 FK in |
| `socials` | **`Social`** | 0 FK out, 0 FK in |
| `static_pages` | **`StaticPage`** | 0 FK out, 1 FK in |
| `test` | **`Test`** | 0 FK out, 3 FK in |
| `test_answer` | **`TestAnswer`** | 1 FK out, 0 FK in |
| `test_category` | **`TestCategory`** | 0 FK out, 2 FK in |
| `test_level` | **`TestLevel`** | 0 FK out, 1 FK in |
| `test_level_label` | **`TestLevelLabel`** | 1 FK out, 0 FK in |
| `toefl` | **`Toefl`** | 0 FK out, 0 FK in |
| `toefl_complete_history` | **`ToeflCompleteHistory`** | 2 FK out, 0 FK in |
| `toefl_listening` | **`ToeflListening`** | 0 FK out, 3 FK in |
| `toefl_listening_test_question_answers` | **`ToeflListeningTestQuestionAnswer`** | 1 FK out, 0 FK in |
| `toefl_listening_user_answer` | **`ToeflListeningUserAnswer`** | 0 FK out, 0 FK in |
| `toefl_reading` | **`ToeflReading`** | 0 FK out, 4 FK in |
| `toefl_reading_test_answer` | **`ToeflReadingTestAnswer`** | 1 FK out, 0 FK in |
| `toefl_reading_user_answer` | **`ToeflReadingUserAnswer`** | 2 FK out, 0 FK in |
| `toefl_speaking` | **`ToeflSpeaking`** | 0 FK out, 4 FK in |
| `toefl_speaking_history` | **`ToeflSpeakingHistory`** | 2 FK out, 0 FK in |
| `toefl_speaking_test_answer` | **`ToeflSpeakingTestAnswer`** | 2 FK out, 1 FK in |
| `toefl_speaking_test_users_answer` | **`ToeflSpeakingTestUsersAnswer`** | 2 FK out, 1 FK in |
| `toefl_writing` | **`ToeflWriting`** | 0 FK out, 4 FK in |
| `toefl_writing_questions` | **`ToeflWritingQuestion`** | 1 FK out, 0 FK in |
| `training_listening_answer` | **`TrainingListeningAnswer`** | 2 FK out, 2 FK in |
| `training_listening_answer_group` | **`TrainingListeningAnswerGroup`** | 2 FK out, 1 FK in |
| `training_listening_check_answer` | **`TrainingListeningCheckAnswer`** | 3 FK out, 0 FK in |
| `training_listening_right_answers` | **`TrainingListeningRightAnswer`** | 1 FK out, 0 FK in |
| `training_reading` | **`TrainingReading`** | 1 FK out, 3 FK in |
| `training_reading_answer` | **`TrainingReadingAnswer`** | 2 FK out, 2 FK in |
| `training_reading_check_answer` | **`TrainingReadingCheckAnswer`** | 3 FK out, 0 FK in |
| `training_reading_question_answers` | **`TrainingReadingQuestionAnswer`** | 2 FK out, 1 FK in |
| `training_reading_test_users_answer` | **`TrainingReadingTestUsersAnswer`** | 2 FK out, 0 FK in |
| `training_speaking` | **`TrainingSpeaking`** | 1 FK out, 3 FK in |
| `training_speaking_answer` | **`TrainingSpeakingAnswer`** | 2 FK out, 2 FK in |
| `training_speaking_check_answer` | **`TrainingSpeakingCheckAnswer`** | 3 FK out, 0 FK in |
| `training_speaking_question_answers` | **`TrainingSpeakingQuestionAnswer`** | 2 FK out, 1 FK in |
| `training_writing` | **`TrainingWriting`** | 1 FK out, 3 FK in |
| `training_writing_answer` | **`TrainingWritingAnswer`** | 2 FK out, 2 FK in |
| `training_writing_answer_group` | **`TrainingWritingAnswerGroup`** | 2 FK out, 1 FK in |
| `training_writing_check_answer` | **`TrainingWritingCheckAnswer`** | 3 FK out, 0 FK in |
| `training_writing_right_answers` | **`TrainingWritingRightAnswer`** | 1 FK out, 0 FK in |
| `trainings` | **`Training`** | 1 FK out, 2 FK in |
| `trainings_group` | **`TrainingsGroup`** | 0 FK out, 2 FK in |
| `trainings_group_label` | **`TrainingsGroupLabel`** | 1 FK out, 0 FK in |
| `trainings_label` | **`TrainingsLabel`** | 1 FK out, 0 FK in |
| `translation` | **`Translation`** | 0 FK out, 1 FK in |
| `user_cv` | **`UserCv`** | 0 FK out, 0 FK in |
| `user_history` | **`UserHistory`** | 2 FK out, 0 FK in |
| `user_writing_history` | **`UserWritingHistory`** | 2 FK out, 1 FK in |
| `user_writing_history_itema` | **`UserWritingHistoryItema`** | 1 FK out, 1 FK in |
| `users` | **`User`** | 0 FK out, 19 FK in |
| `writing` | **`Writing`** | 0 FK out, 1 FK in |
| `writing_ansswer` | **`WritingAnsswer`** | 2 FK out, 1 FK in |
| `wrong_answers` | **`WrongAnswer`** | 1 FK out, 8 FK in |

## Top inbound hubs (most-referenced tables)

| Table | Inbound FKs | Referenced by |
|---|---|---|
| `languages` | 28 | `Old_training_reading_label`, `all_certificates_label`, `category_label`, `contact_info_label`, `demo_videos_label`, `faq_label` +22 |
| `users` | 19 | `certificate`, `conversation`, `ielts_complete_history`, `ielts_listening_user_answer`, `ielts_reading_user_answer`, `ielts_writing_user_answer` +13 |
| `membership` | 8 | `downloadable_content`, `membership_has_test`, `membership_label`, `training_listening_test`, `training_reading`, `training_speaking` +2 |
| `wrong_answers` | 8 | `ielts_writing_user_answer_item_has_wrong`, `toefl_speaking_history`, `training_listening_check_answer`, `training_reading_check_answer`, `training_speaking_check_answer`, `training_writing_check_answer` +2 |
| `ielts_complete` | 6 | `ielts_complete_has_listening`, `ielts_complete_has_reading`, `ielts_complete_has_speaking`, `ielts_complete_has_writing`, `ielts_complete_history`, `ielts_complete_label` |
| `toefl_complete` | 6 | `toefl_complete_has_listening`, `toefl_complete_has_reading`, `toefl_complete_has_speaking`, `toefl_complete_has_writing`, `toefl_complete_history`, `toefl_complete_label` |
| `ielts_reading` | 4 | `ielts_complete_has_reading`, `ielts_reading_label`, `ielts_reading_question`, `ielts_reading_user_answer` |
| `toefl_reading` | 4 | `toefl_complete_has_reading`, `toefl_reading_label`, `toefl_reading_test`, `toefl_reading_user_answer` |
| `toefl_speaking` | 4 | `toefl_complete_has_speaking`, `toefl_speaking_label`, `toefl_speaking_test`, `toefl_speaking_test_users_answer` |
| `toefl_writing` | 4 | `toefl_complete_has_writing`, `toefl_writing_label`, `toefl_writing_questions`, `user_writing_history` |
| `Old_training_reading` | 3 | `Old_training_reading_label`, `Old_training_reading_test`, `training_reading_test_users_answer` |
| `category` | 3 | `category_has_tests`, `category_label`, `choose_your_category` |
| `test` | 3 | `category_has_tests`, `test_answer`, `test_label` |
| `ielts_listening` | 3 | `ielts_complete_has_listening`, `ielts_listening_label`, `ielts_listening_question` |
| `ielts_writing` | 3 | `ielts_complete_has_writing`, `ielts_writing_label`, `ielts_writing_questions` |
