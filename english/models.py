# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class LegacyTrainingReading(models.Model):
    status = models.IntegerField()
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    image = models.CharField(max_length=255, blank=True, null=True)
    trainings = models.IntegerField()
    training_type = models.IntegerField(db_comment='0 = training,1 =overall english')

    class Meta:
        managed = False
        db_table = 'Old_training_reading'


class LegacyTrainingReadingExplain(models.Model):
    text = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)
    preparation_audio = models.CharField(max_length=255, blank=True, null=True)
    recording_audio = models.CharField(max_length=255, blank=True, null=True)
    test_1_preparation_time = models.TimeField()
    test_1_recording_time = models.TimeField()
    test_1_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_1_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_2_preparation_time = models.TimeField()
    test_2_recording_time = models.TimeField()
    test_2_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_2_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_3_preparation_time = models.TimeField()
    test_3_recording_time = models.TimeField()
    test_3_reading_time = models.TimeField()
    test_3_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_3_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_4_preparation_time = models.TimeField()
    test_4_recording_time = models.TimeField()
    test_4_reading_time = models.TimeField()
    test_4_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_4_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_5_preparation_time = models.TimeField()
    test_5_recording_time = models.TimeField()
    test_5_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_5_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_6_preparation_time = models.TimeField(blank=True, null=True)
    test_6_recording_time = models.TimeField(blank=True, null=True)
    test_6_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_6_headphone_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Old_training_reading_explain'


class LegacyTrainingReadingLabel(models.Model):
    training_reading = models.ForeignKey(LegacyTrainingReading, models.DO_NOTHING)
    language = models.ForeignKey('Language', models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Old_training_reading_label'


class LegacyTrainingReadingTest(models.Model):
    training_reading = models.ForeignKey(LegacyTrainingReading, models.DO_NOTHING)
    status = models.IntegerField()
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    type = models.IntegerField()
    preparation_time = models.TimeField()
    recording_time = models.TimeField()
    reading_time = models.TimeField()
    main_image = models.CharField(max_length=255, blank=True, null=True)
    main_audio = models.CharField(max_length=255, blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    text_audio = models.CharField(max_length=255, blank=True, null=True)
    reading_text = models.TextField(blank=True, null=True)
    conversation_image = models.CharField(max_length=255, blank=True, null=True)
    conversation_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Old_training_reading_test'


class Admin(models.Model):
    group_id = models.PositiveIntegerField()
    status = models.IntegerField()
    created_date = models.DateTimeField()
    email = models.CharField(max_length=65)
    password = models.CharField(max_length=265)
    name = models.CharField(max_length=128, blank=True, null=True)
    avatar = models.CharField(max_length=265, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admins'


class AdminAction(models.Model):
    controler = models.ForeignKey('AdminController', models.DO_NOTHING)
    action = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'admins_action'


class AdminController(models.Model):
    controler = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admins_controler'


class AdminGroup(models.Model):
    title = models.CharField(max_length=255)
    accesses = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admins_groups'


class AllCertificate(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    decription = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'all_certificates'


class AllCertificateTranslation(models.Model):
    all_certificates = models.ForeignKey(AllCertificate, models.DO_NOTHING)
    language = models.ForeignKey('Language', models.DO_NOTHING)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'all_certificates_label'


class Category(models.Model):
    parent_id = models.PositiveIntegerField()
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    key = models.CharField(max_length=16, blank=True, null=True)
    show_scool_part = models.IntegerField(blank=True, null=True)
    show_scool_level_or_filter = models.IntegerField(blank=True, null=True, db_comment='0 = level, 1 = filter')
    has_level = models.IntegerField(db_comment='0= no, 1 = yes')
    image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'category'


class CategoryTest(models.Model):
    category = models.ForeignKey(Category, models.DO_NOTHING)
    test = models.ForeignKey('Test', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'category_has_tests'


class CategoryTranslation(models.Model):
    category = models.ForeignKey(Category, models.DO_NOTHING)
    language = models.ForeignKey('Language', models.DO_NOTHING)
    value = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'category_label'


class Certificate(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING)
    status = models.IntegerField()
    created_date = models.DateTimeField()
    image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'certificate'


class ChooseYourCategory(models.Model):
    category = models.ForeignKey(Category, models.DO_NOTHING, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    link = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'choose_your_category'


class ContactInfo(models.Model):
    email = models.CharField(max_length=65, blank=True, null=True)
    phone = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'contact_info'


class ContactInfoTranslation(models.Model):
    contact_info = models.ForeignKey(ContactInfo, models.DO_NOTHING)
    language = models.ForeignKey('Language', models.DO_NOTHING)
    address = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'contact_info_label'


class ContactMessage(models.Model):
    created_date = models.DateTimeField()
    status = models.IntegerField(blank=True, null=True, db_comment='1=read,0=unread')
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    subject = models.CharField(max_length=255, blank=True, null=True)
    body = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'contact_messages'


class Conversation(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING)
    admin = models.ForeignKey(Admin, models.DO_NOTHING, blank=True, null=True)
    read_status = models.IntegerField(db_comment='1=read, 0 =unread')
    created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'conversation'


class ConversationReply(models.Model):
    user_id = models.PositiveIntegerField()
    admin_id = models.IntegerField()
    conversation = models.ForeignKey(Conversation, models.DO_NOTHING)
    reply = models.TextField(blank=True, null=True)
    created_date = models.DateTimeField()
    is_admin = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'conversation_reply'


class Currency(models.Model):
    sign = models.CharField(max_length=255, blank=True, null=True)
    code = models.CharField(max_length=3, blank=True, null=True)
    status = models.IntegerField()
    default = models.IntegerField()
    sort_order = models.IntegerField()
    value = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'currency'


class CV(models.Model):
    status = models.IntegerField()
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    cv_name = models.CharField(max_length=255, blank=True, null=True)
    html_code = models.TextField(blank=True, null=True)
    thumb = models.CharField(max_length=255, blank=True, null=True)
    key = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cv'


class DemoVideo(models.Model):
    type = models.CharField(max_length=25, blank=True, null=True)
    video = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'demo_videos'


class DemoVideoTranslation(models.Model):
    demo_videos = models.ForeignKey(DemoVideo, models.DO_NOTHING)
    language = models.ForeignKey('Language', models.DO_NOTHING)
    text = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'demo_videos_label'


class Dictionary(models.Model):
    status = models.IntegerField()
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'dictionary'


class DictionaryLabel(models.Model):
    dictionary = models.ForeignKey(Dictionary, models.DO_NOTHING)
    language_id = models.PositiveIntegerField()
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dictionary_label'


class DownloadableContent(models.Model):
    file = models.CharField(max_length=255, blank=True, null=True)
    membership = models.ForeignKey('Membership', models.DO_NOTHING)
    title = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'downloadable_content'


class DownloadableContentFile(models.Model):
    file = models.CharField(max_length=255, blank=True, null=True)
    parent = models.ForeignKey(DownloadableContent, models.DO_NOTHING)
    title = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'downloadable_content_file'


class Faq(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'faq'


class FaqTranslation(models.Model):
    faq = models.ForeignKey(Faq, models.DO_NOTHING)
    language = models.ForeignKey('Language', models.DO_NOTHING)
    question = models.TextField(blank=True, null=True)
    answer = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'faq_label'


class Gallery(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    image = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'gallery'


class IeltsComplete(models.Model):
    status = models.IntegerField()
    ielts_type = models.IntegerField(db_comment='0 = general, 1 = academy')
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    image = models.CharField(max_length=255, blank=True, null=True)
    trainings = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ielts_complete'


class IeltsCompleteListening(models.Model):
    ielts_complete = models.ForeignKey(IeltsComplete, models.DO_NOTHING)
    ielts_listening = models.ForeignKey('IeltsListening', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ielts_complete_has_listening'


class IeltsCompleteReading(models.Model):
    ielts_complete = models.ForeignKey(IeltsComplete, models.DO_NOTHING)
    ielts_reading = models.ForeignKey('IeltsReading', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ielts_complete_has_reading'


class IeltsCompleteSpeaking(models.Model):
    ielts_complete = models.ForeignKey(IeltsComplete, models.DO_NOTHING)
    ielts_speaking = models.ForeignKey('IeltsSpeaking', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ielts_complete_has_speaking'


class IeltsCompleteWriting(models.Model):
    ielts_complete = models.ForeignKey(IeltsComplete, models.DO_NOTHING)
    ielts_writing = models.ForeignKey('IeltsWriting', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ielts_complete_has_writing'


class IeltsCompleteHistory(models.Model):
    ielts_complete = models.ForeignKey(IeltsComplete, models.DO_NOTHING)
    user = models.ForeignKey('User', models.DO_NOTHING)
    status = models.IntegerField()
    created_date = models.DateTimeField()
    score = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_complete_history'


class IeltsCompleteLabel(models.Model):
    ielts_complete = models.ForeignKey(IeltsComplete, models.DO_NOTHING)
    language_id = models.PositiveIntegerField()
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_complete_label'


class IeltsListening(models.Model):
    status = models.PositiveIntegerField()
    ielts_type = models.IntegerField(db_comment='0 = genaral, 1 = academy')
    type = models.IntegerField(db_comment='0 = typing , 1 = drag, 2 = dropdown')
    sort_order = models.PositiveIntegerField(blank=True, null=True)
    created_date = models.DateTimeField()
    image = models.CharField(max_length=255, blank=True, null=True)
    preperation_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    explain_audio = models.CharField(max_length=255, blank=True, null=True)
    explain_text = models.TextField(blank=True, null=True)
    listening_audio = models.CharField(max_length=255, blank=True, null=True)
    trainings = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ielts_listening'


class IeltsListeningLabel(models.Model):
    ielts_listening = models.ForeignKey(IeltsListening, models.DO_NOTHING)
    language_id = models.PositiveIntegerField()
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_listening_label'


class IeltsListeningQuestion(models.Model):
    ielts_listening = models.ForeignKey(IeltsListening, models.DO_NOTHING)
    sort_order = models.IntegerField()
    question = models.TextField(blank=True, null=True)
    sentences = models.TextField(blank=True, null=True)
    listening_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_listening_question'


class IeltsListeningQuestionAnswer(models.Model):
    ielts_reading_question = models.ForeignKey(IeltsListeningQuestion, models.DO_NOTHING)
    answer = models.CharField(max_length=255)
    true_false = models.IntegerField(db_comment='0 = false, 1 = true')

    class Meta:
        managed = False
        db_table = 'ielts_listening_question_answer'


class IeltsListeningUserAnswer(models.Model):
    ielts_listening_id = models.PositiveIntegerField()
    user = models.ForeignKey('User', models.DO_NOTHING)
    complete_id = models.PositiveIntegerField()
    complete_history_id = models.PositiveIntegerField()
    correct = models.IntegerField()
    incorrect = models.IntegerField()
    answers = models.TextField(blank=True, null=True)
    created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'ielts_listening_user_answer'


class IeltsReading(models.Model):
    status = models.IntegerField()
    ielts_type = models.IntegerField(db_comment='0 = genaral, 1 = academy')
    type = models.IntegerField(db_comment='0 = write, 1 = choose, 2 = table, 3 = Complete the sentences')
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    image = models.CharField(max_length=255, blank=True, null=True)
    reading_text = models.TextField(blank=True, null=True)
    explain_text = models.TextField(blank=True, null=True)
    trainings = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ielts_reading'


class IeltsReadingLabel(models.Model):
    ielts_reading = models.ForeignKey(IeltsReading, models.DO_NOTHING)
    language_id = models.PositiveIntegerField()
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_reading_label'


class IeltsReadingQuestion(models.Model):
    ielts_reading = models.ForeignKey(IeltsReading, models.DO_NOTHING)
    sort_order = models.IntegerField()
    question = models.TextField(blank=True, null=True)
    sentences = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_reading_question'


class IeltsReadingQuestionAnswer(models.Model):
    ielts_reading_question = models.ForeignKey(IeltsReadingQuestion, models.DO_NOTHING)
    answer = models.CharField(max_length=255, blank=True, null=True)
    true_false = models.IntegerField(blank=True, null=True, db_comment='0 = false, 1 = true')

    class Meta:
        managed = False
        db_table = 'ielts_reading_question_answer'


class IeltsReadingUserAnswer(models.Model):
    ielts_reading = models.ForeignKey(IeltsReading, models.DO_NOTHING)
    user = models.ForeignKey('User', models.DO_NOTHING)
    complete_id = models.IntegerField()
    complete_history_id = models.PositiveIntegerField()
    correct = models.IntegerField()
    incorrect = models.IntegerField()
    answers = models.TextField(blank=True, null=True)
    created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'ielts_reading_user_answer'


class IeltsSpeaking(models.Model):
    status = models.IntegerField()
    ielts_type = models.IntegerField(db_comment='0 = genaral, 1 = academy')
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    image = models.CharField(max_length=255, blank=True, null=True)
    trainings = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ielts_speaking'


class IeltsSpeakingExplanation(models.Model):
    text = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)
    preparation_audio = models.CharField(max_length=255, blank=True, null=True)
    recording_audio = models.CharField(max_length=255, blank=True, null=True)
    test_1_preparation_time = models.TimeField()
    test_1_recording_time = models.TimeField()
    test_1_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_1_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_2_preparation_time = models.TimeField()
    test_2_recording_time = models.TimeField()
    test_2_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_2_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_3_preparation_time = models.TimeField()
    test_3_recording_time = models.TimeField()
    test_3_reading_time = models.TimeField()
    test_3_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_3_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_4_preparation_time = models.TimeField()
    test_4_recording_time = models.TimeField()
    test_4_reading_time = models.TimeField()
    test_4_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_4_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_5_preparation_time = models.TimeField()
    test_5_recording_time = models.TimeField()
    test_5_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_5_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_6_preparation_time = models.TimeField(blank=True, null=True)
    test_6_recording_time = models.TimeField(blank=True, null=True)
    test_6_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_6_headphone_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_speaking_explain'


class IeltsSpeakingHistory(models.Model):
    ielts_speaking_test_answer_id = models.PositiveIntegerField()
    error_id = models.PositiveIntegerField()
    count = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ielts_speaking_history'


class IeltsSpeakingLabel(models.Model):
    ielts_speaking_id = models.PositiveIntegerField()
    language_id = models.PositiveIntegerField()
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_speaking_label'


class IeltsSpeakingTest(models.Model):
    ielts_speaking_id = models.PositiveIntegerField()
    status = models.IntegerField()
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    type = models.IntegerField()
    preparation_time = models.TimeField()
    recording_time = models.TimeField()
    reading_time = models.TimeField()
    main_image = models.CharField(max_length=255, blank=True, null=True)
    main_audio = models.CharField(max_length=255, blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    text_audio = models.CharField(max_length=255, blank=True, null=True)
    reading_text = models.TextField(blank=True, null=True)
    conversation_image = models.CharField(max_length=255, blank=True, null=True)
    conversation_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_speaking_test'


class IeltsSpeakingTestAnswer(models.Model):
    ielts_speaking_test_users_answer_id = models.PositiveIntegerField()
    ielts_speaking_test_id = models.PositiveIntegerField()
    value = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'ielts_speaking_test_answer'


class IeltsSpeakingTestUsersAnswer(models.Model):
    user_id = models.PositiveIntegerField()
    ielts_speaking = models.PositiveIntegerField()
    complete_id = models.PositiveIntegerField()
    complete_history_id = models.PositiveIntegerField()
    status = models.IntegerField(db_comment='0=unread, 1=read')
    created_date = models.DateTimeField()
    score = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_speaking_test_users_answer'


class IeltsWriting(models.Model):
    status = models.IntegerField()
    ielts_type = models.IntegerField(db_comment='0 = genaral, 1 = academy')
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    reading_time = models.TimeField()
    text = models.TextField(blank=True, null=True)
    profesor_audio = models.CharField(max_length=255, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    profesor_text = models.TextField(blank=True, null=True)
    show_profesor_text = models.IntegerField()
    trainings = models.IntegerField()
    ielts_test_type = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_writing'


class IeltsWritingTranslation(models.Model):
    ielts_writing = models.ForeignKey(IeltsWriting, models.DO_NOTHING)
    language = models.ForeignKey('Language', models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_writing_label'


class IeltsWritingQuestion(models.Model):
    ielts_writing = models.ForeignKey(IeltsWriting, models.DO_NOTHING)
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    type = models.IntegerField(db_comment='1-integrated, 2-independent')
    time = models.TimeField()
    directions = models.TextField(blank=True, null=True)
    question = models.TextField(blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    type_text = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_writing_questions'


class IeltsWritingUserAnswer(models.Model):
    ielts_writing_id = models.PositiveIntegerField()
    user = models.ForeignKey('User', models.DO_NOTHING)
    complete_id = models.PositiveIntegerField()
    complete_history_id = models.PositiveIntegerField()
    created_date = models.DateTimeField()
    status = models.IntegerField()
    answer = models.TextField(blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_writing_user_answer'


class IeltsWritingUserAnswerItem(models.Model):
    ielts_writing_user_answer = models.ForeignKey(IeltsWritingUserAnswer, models.DO_NOTHING)
    ielts_writing_question = models.ForeignKey(IeltsWritingQuestion, models.DO_NOTHING)
    answer = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ielts_writing_user_answer_item'


class IeltsWritingUserAnswerItemWrong(models.Model):
    ielts_writing_user_answer_item = models.ForeignKey(IeltsWritingUserAnswerItem, models.DO_NOTHING)
    wrong = models.ForeignKey('WrongAnswer', models.DO_NOTHING)
    count = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ielts_writing_user_answer_item_has_wrong'


class Inbox(models.Model):
    parent_id = models.PositiveIntegerField()
    user = models.ForeignKey('User', models.DO_NOTHING)
    admin_id = models.PositiveIntegerField()
    read_status = models.IntegerField()
    admin_read_status = models.IntegerField()
    created_date = models.DateTimeField()
    subject = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    file = models.CharField(max_length=255, blank=True, null=True)
    file_hash = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'inbox'


class Language(models.Model):
    name = models.CharField(max_length=25)
    iso = models.CharField(max_length=5)
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    image = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'languages'


class LessonItem(models.Model):
    lessons = models.ForeignKey('Lesson', models.DO_NOTHING, related_name='lesson_items')
    image = models.CharField(max_length=255, blank=True, null=True)
    value = models.CharField(max_length=255, blank=True, null=True)
    explanation = models.CharField(max_length=255, blank=True, null=True)
    href = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lesson'


class Lesson(models.Model):
    level = models.ForeignKey('LessonsLevel', models.DO_NOTHING)
    filter = models.ForeignKey('LessonsFilter', models.DO_NOTHING)
    test_id = models.IntegerField()
    status = models.IntegerField()
    crated_date = models.DateTimeField()
    sort_order = models.IntegerField()
    view_counter = models.IntegerField()
    lesson = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lessons'


class LessonsFilter(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lessons_filters'


class LessonsFilterTranslation(models.Model):
    lessons_filters = models.ForeignKey(LessonsFilter, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    seo_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lessons_filters_label'


class LessonTranslation(models.Model):
    lessons = models.ForeignKey(Lesson, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    lesson = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lessons_label'


class LessonsLevel(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lessons_levels'


class LessonsLevelsFilter(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lessons_levels_filters'


class LessonsLevelsFilterTranslation(models.Model):
    filters = models.ForeignKey(LessonsLevelsFilter, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    value = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lessons_levels_filters_label'


class LessonsLevelFilter(models.Model):
    lessons = models.ForeignKey(LessonsLevel, models.DO_NOTHING)
    filters = models.ForeignKey(LessonsLevelsFilter, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'lessons_levels_has_filters'


class LessonsLevelTranslation(models.Model):
    lessons_levels = models.ForeignKey(LessonsLevel, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    seo_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lessons_levels_label'


class Listening(models.Model):
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    image = models.CharField(max_length=255, blank=True, null=True)
    sound = models.CharField(max_length=255, blank=True, null=True)
    text = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'listening'


class ListeningAnswer(models.Model):
    listening = models.ForeignKey(Listening, models.DO_NOTHING)
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    answer_value = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'listening_answer'


class ListeningItem(models.Model):
    listening = models.ForeignKey(Listening, models.DO_NOTHING)
    image = models.CharField(max_length=255)
    audio = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'listening_items'


class ListeningQuestion(models.Model):
    listening_items = models.ForeignKey(ListeningItem, models.DO_NOTHING)
    created_date = models.DateTimeField()
    status = models.IntegerField()
    question_type = models.IntegerField(db_comment='1=with audio, 0=without audio')
    audio = models.CharField(max_length=255, blank=True, null=True)
    value = models.TextField()

    class Meta:
        managed = False
        db_table = 'listening_question'


class Membership(models.Model):
    status = models.IntegerField()
    sort_ortder = models.IntegerField()
    price = models.FloatField(blank=True, null=True)
    vip = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'membership'


class MembershipTest(models.Model):
    membership = models.ForeignKey(Membership, models.DO_NOTHING)
    test_id = models.PositiveIntegerField()
    type = models.IntegerField(db_comment='0=test, 1=toefl reading, 2 toefl listening, 3 toefl speking, 4 toefl writing, 5 toefl comple, 6 ielts reading, 7 ielts listening, 8 ielts spaking, 9 ielts writing, 10 ielts complete, 11 lesson')

    class Meta:
        managed = False
        db_table = 'membership_has_test'


class MembershipTranslation(models.Model):
    membership = models.ForeignKey(Membership, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    short_description = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'membership_label'


class News(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    view_count = models.IntegerField()
    image = models.CharField(max_length=255, blank=True, null=True)
    video = models.CharField(max_length=255, blank=True, null=True)
    type = models.IntegerField(db_comment='1=iamge, 2 = video')

    class Meta:
        managed = False
        db_table = 'news'


class NewTranslation(models.Model):
    news = models.ForeignKey(News, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    title = models.TextField(blank=True, null=True)
    value = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'news_label'


class PageImage(models.Model):
    key = models.CharField(max_length=64)
    image = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'page_images'


class ProfileAdvertising(models.Model):
    image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'profile_advertising'


class Review(models.Model):
    user_id = models.PositiveIntegerField()
    status = models.IntegerField()
    profession = models.CharField(max_length=255, blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'review'


class SchoolTemplate(models.Model):
    lesson = models.ForeignKey(Lesson, models.DO_NOTHING)
    level_id = models.PositiveIntegerField(blank=True, null=True)
    status = models.IntegerField()
    sort_order = models.IntegerField()
    type = models.IntegerField(db_comment='0 = test, 1 = toefl, 2 = ielts')
    sub_type = models.CharField(max_length=16, blank=True, null=True, db_comment='int( test -id) , varchar (reading, listening, ...)')
    ielts_type = models.IntegerField(db_comment='0 = general, 1 = academic')

    class Meta:
        managed = False
        db_table = 'school_template'


class SchoolTemplateTest(models.Model):
    school_template = models.ForeignKey(SchoolTemplate, models.DO_NOTHING)
    test_id = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'school_template_has_tests'


class SchoolTemplateLabel(models.Model):
    school_template = models.ForeignKey(SchoolTemplate, models.DO_NOTHING)
    language_id = models.PositiveIntegerField()
    name = models.CharField(max_length=255, blank=True, null=True)
    text = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'school_template_label'


class SeoUrl(models.Model):
    no_lang = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    seo_url = models.CharField(max_length=255)
    show = models.IntegerField()
    params = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seo_urls'


class Setting(models.Model):
    key = models.CharField(primary_key=True, max_length=128)
    value = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'settings'


class Slideshow(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    image = models.CharField(max_length=255)
    href = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'slideshow'


class SlideshowTranslation(models.Model):
    slideshow = models.ForeignKey(Slideshow, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    value = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'slideshow_label'


class Social(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    favicon = models.CharField(max_length=65, blank=True, null=True)
    href = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'socials'


class StaticPage(models.Model):
    page_key = models.CharField(max_length=32)
    created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'static_pages'


class StaticPageTranslation(models.Model):
    static_pages = models.ForeignKey(StaticPage, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    title = models.CharField(max_length=255, blank=True, null=True)
    value = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'static_pages_label'


class Test(models.Model):
    parent_id = models.PositiveIntegerField()
    status = models.IntegerField()
    created_date = models.DateTimeField()
    question_type = models.IntegerField(blank=True, null=True, db_comment='1-text, 2-image, 3 = video')
    answer_type = models.IntegerField(blank=True, null=True, db_comment='1-text, 2-image')
    image = models.CharField(max_length=255, blank=True, null=True)
    question = models.TextField(blank=True, null=True)
    sort_order = models.IntegerField()
    view_count = models.IntegerField()
    audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'test'


class TestAnswer(models.Model):
    test = models.ForeignKey(Test, models.DO_NOTHING)
    true_false = models.IntegerField(db_comment='0-false, 1-true')
    value = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'test_answer'


class TestCategory(models.Model):
    category_id = models.PositiveIntegerField()
    parent_id = models.PositiveIntegerField()
    level_id = models.PositiveIntegerField()
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.FloatField()
    time = models.TimeField()
    view_count = models.IntegerField()
    image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'test_category'


class TestCategoryTranslation(models.Model):
    test_category = models.ForeignKey(TestCategory, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    seo_name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'test_category_label'


class TestTranslation(models.Model):
    test = models.ForeignKey(Test, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    value = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'test_label'


class TestLevel(models.Model):
    status = models.IntegerField()
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'test_level'


class TestLevelLabel(models.Model):
    test_level = models.ForeignKey(TestLevel, models.DO_NOTHING)
    language_id = models.PositiveIntegerField()
    name = models.CharField(max_length=255, blank=True, null=True)
    seo_name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'test_level_label'


class Toefl(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    audio = models.CharField(max_length=255)
    text = models.TextField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl'


class ToeflComplete(models.Model):
    status = models.IntegerField()
    sort_order = models.IntegerField()
    image = models.CharField(max_length=255, blank=True, null=True)
    created_date = models.DateTimeField()
    reading_time = models.TimeField()
    listening_time = models.TimeField()
    speaking_time = models.TimeField()
    writing_time = models.TimeField()
    trainings = models.IntegerField()
    toefl_type = models.IntegerField(db_comment='0 = toefl,1 =overall english')

    class Meta:
        managed = False
        db_table = 'toefl_complete'


class ToeflCompleteListening(models.Model):
    toefl_complete = models.ForeignKey(ToeflComplete, models.DO_NOTHING)
    listening = models.ForeignKey('ToeflListening', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'toefl_complete_has_listening'


class ToeflCompleteReading(models.Model):
    toefl_complete = models.ForeignKey(ToeflComplete, models.DO_NOTHING)
    reading = models.ForeignKey('ToeflReading', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'toefl_complete_has_reading'


class ToeflCompleteSpeaking(models.Model):
    toefl_complete = models.ForeignKey(ToeflComplete, models.DO_NOTHING)
    spaking = models.ForeignKey('ToeflSpeaking', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'toefl_complete_has_speaking'


class ToeflCompleteWriting(models.Model):
    toefl_complete = models.ForeignKey(ToeflComplete, models.DO_NOTHING)
    writing = models.ForeignKey('ToeflWriting', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'toefl_complete_has_writing'


class ToeflCompleteHistory(models.Model):
    toefl_complete = models.ForeignKey(ToeflComplete, models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('User', models.DO_NOTHING)
    status = models.IntegerField()
    created_date = models.DateTimeField()
    score = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_complete_history'


class ToeflCompleteTranslation(models.Model):
    toefl_complete = models.ForeignKey(ToeflComplete, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_complete_label'


class ToeflListening(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    time = models.TimeField()
    image = models.CharField(max_length=255, blank=True, null=True)
    toefl_type = models.IntegerField(db_comment='0 = toefl,1 =overall english')
    trainings = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'toefl_listening'


class ToeflListeningExplanation(models.Model):
    text = models.TextField()
    audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_listening_explain'


class ToeflListeningTranslation(models.Model):
    toefl_listening = models.ForeignKey(ToeflListening, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_listening_label'


class ToeflListeningTest(models.Model):
    toefl_listening = models.ForeignKey(ToeflListening, models.DO_NOTHING)
    status = models.IntegerField()
    created_date = models.DateTimeField()
    image = models.CharField(max_length=255, blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_listening_test'


class ToeflListeningTestQuestion(models.Model):
    toefl_listening_test = models.ForeignKey(ToeflListeningTest, models.DO_NOTHING)
    status = models.IntegerField()
    type = models.IntegerField(db_comment='2=with audio, 1= without audio')
    question = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)
    audio_type_2 = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_listening_test_question'


class ToeflListeningTestQuestionAnswer(models.Model):
    toefl_listening_test_question = models.ForeignKey(ToeflListeningTestQuestion, models.DO_NOTHING)
    sort_order = models.IntegerField()
    true_false = models.IntegerField(db_comment='0=false, 1 = true')
    value = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_listening_test_question_answers'


class ToeflListeningUserAnswer(models.Model):
    listening_id = models.PositiveIntegerField()
    user_id = models.PositiveIntegerField()
    complete_id = models.PositiveIntegerField()
    complete_history_id = models.IntegerField()
    correct = models.IntegerField()
    incorrect = models.IntegerField()
    status = models.IntegerField()
    answer = models.TextField(blank=True, null=True)
    created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'toefl_listening_user_answer'


class ToeflReading(models.Model):
    sort_order = models.IntegerField()
    status = models.IntegerField()
    trainings = models.IntegerField()
    created_date = models.DateTimeField()
    time = models.TimeField()
    image = models.CharField(max_length=255, blank=True, null=True)
    toefl_type = models.IntegerField(db_comment='0 = toefl,1 =overall english')

    class Meta:
        managed = False
        db_table = 'toefl_reading'


class ToeflReadingExplanation(models.Model):
    text = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_reading_explain'


class ToeflReadingTranslation(models.Model):
    toefl_reading = models.ForeignKey(ToeflReading, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'toefl_reading_label'


class ToeflReadingTest(models.Model):
    toefl_reding = models.ForeignKey(ToeflReading, models.DO_NOTHING)
    sort_order = models.IntegerField()
    status = models.IntegerField()
    created_date = models.DateTimeField()
    text = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_reading_test'


class ToeflReadingTestAnswer(models.Model):
    toefl_reading_test_question = models.ForeignKey('ToeflReadingTestQuestion', models.DO_NOTHING)
    true_false = models.IntegerField()
    text = models.TextField(blank=True, null=True)
    question = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_reading_test_answer'


class ToeflReadingTestQuestion(models.Model):
    toefl_reading_test = models.ForeignKey(ToeflReadingTest, models.DO_NOTHING)
    sort_order = models.IntegerField()
    status = models.IntegerField()
    type = models.IntegerField(db_comment='1=4 answer,2=place answers, 3=sort order ansewrs')
    created_date = models.DateTimeField()
    text = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_reading_test_question'


class ToeflReadingUserAnswer(models.Model):
    reading = models.ForeignKey(ToeflReading, models.DO_NOTHING)
    user = models.ForeignKey('User', models.DO_NOTHING)
    complete_id = models.PositiveIntegerField()
    complete_history_id = models.PositiveIntegerField()
    correct = models.IntegerField()
    incorrect = models.IntegerField()
    status = models.IntegerField()
    answers = models.TextField(blank=True, null=True)
    created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'toefl_reading_user_answer'


class ToeflSpeaking(models.Model):
    status = models.IntegerField()
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    image = models.CharField(max_length=255, blank=True, null=True)
    trainings = models.IntegerField()
    toefl_type = models.IntegerField(db_comment='0 = toefl,1 =overall english')

    class Meta:
        managed = False
        db_table = 'toefl_speaking'


class ToeflSpeakingExplanation(models.Model):
    text = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)
    preparation_audio = models.CharField(max_length=255, blank=True, null=True)
    recording_audio = models.CharField(max_length=255, blank=True, null=True)
    test_1_preparation_time = models.TimeField()
    test_1_recording_time = models.TimeField()
    test_1_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_1_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_2_preparation_time = models.TimeField()
    test_2_recording_time = models.TimeField()
    test_2_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_2_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_3_preparation_time = models.TimeField()
    test_3_recording_time = models.TimeField()
    test_3_reading_time = models.TimeField()
    test_3_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_3_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_4_preparation_time = models.TimeField()
    test_4_recording_time = models.TimeField()
    test_4_reading_time = models.TimeField()
    test_4_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_4_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_5_preparation_time = models.TimeField()
    test_5_recording_time = models.TimeField()
    test_5_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_5_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_6_preparation_time = models.TimeField(blank=True, null=True)
    test_6_recording_time = models.TimeField(blank=True, null=True)
    test_6_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_6_headphone_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_speaking_explain'


class ToeflSpeakingHistory(models.Model):
    toefl_speaking_test_answer = models.ForeignKey('ToeflSpeakingTestAnswer', models.DO_NOTHING)
    error = models.ForeignKey('WrongAnswer', models.DO_NOTHING)
    count = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'toefl_speaking_history'


class ToeflSpeakingTranslation(models.Model):
    toefl_speaking = models.ForeignKey(ToeflSpeaking, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_speaking_label'


class ToeflSpeakingTest(models.Model):
    toefl_speaking = models.ForeignKey(ToeflSpeaking, models.DO_NOTHING)
    status = models.IntegerField()
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    type = models.IntegerField()
    preparation_time = models.TimeField()
    recording_time = models.TimeField()
    reading_time = models.TimeField()
    main_image = models.CharField(max_length=255, blank=True, null=True)
    main_audio = models.CharField(max_length=255, blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    text_audio = models.CharField(max_length=255, blank=True, null=True)
    reading_text = models.TextField(blank=True, null=True)
    conversation_image = models.CharField(max_length=255, blank=True, null=True)
    conversation_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_speaking_test'


class ToeflSpeakingTestAnswer(models.Model):
    toefl_speaking_test_users_answer = models.ForeignKey('ToeflSpeakingTestUsersAnswer', models.DO_NOTHING)
    toefel_speaking_test = models.ForeignKey(ToeflSpeakingTest, models.DO_NOTHING)
    value = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'toefl_speaking_test_answer'


class ToeflSpeakingTestUsersAnswer(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING)
    toefl_speaking = models.ForeignKey(ToeflSpeaking, models.DO_NOTHING, db_column='toefl_speaking')
    complete_id = models.PositiveIntegerField()
    complete_history_id = models.PositiveIntegerField()
    status = models.IntegerField(db_comment='0=unread, 1=read')
    created_date = models.DateTimeField()
    score = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_speaking_test_users_answer'


class ToeflWriting(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    reading_time = models.TimeField()
    text = models.TextField(blank=True, null=True)
    profesor_audio = models.CharField(max_length=255, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    profesor_text = models.TextField(blank=True, null=True)
    show_profesor_text = models.IntegerField()
    trainings = models.IntegerField()
    type = models.IntegerField(db_comment='1-integrated, 2-independent')
    toefl_type = models.IntegerField(db_comment='0 = toefl,1 =overall english')
    audio_image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_writing'


class ToeflWritingExplanation(models.Model):
    text = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)
    text_independent = models.TextField(db_column='text_Independent', blank=True, null=True)  # Field name made lowercase.
    audio_independent = models.CharField(db_column='audio_Independent', max_length=255, blank=True, null=True)  # Field name made lowercase.
    general_text = models.TextField(blank=True, null=True)
    general_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_writing_explain'


class ToeflWritingTranslation(models.Model):
    toefl_writing = models.ForeignKey(ToeflWriting, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_writing_label'


class ToeflWritingQuestion(models.Model):
    toefl_writing = models.ForeignKey(ToeflWriting, models.DO_NOTHING)
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()
    type = models.IntegerField(db_comment='1-integrated, 2-independent')
    time = models.TimeField()
    directions = models.TextField(blank=True, null=True)
    question = models.TextField(blank=True, null=True)
    text = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'toefl_writing_questions'


class TrainingListeningAnswer(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING)
    training_listening_test = models.ForeignKey('TrainingListeningTest', models.DO_NOTHING)
    created_date = models.DateTimeField()
    checked = models.IntegerField(blank=True, null=True)
    looked = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_listening_answer'


class TrainingListeningAnswerGroup(models.Model):
    training_listening_answer = models.ForeignKey(TrainingListeningAnswer, models.DO_NOTHING)
    answer = models.CharField(max_length=255, blank=True, null=True)
    training_listening_question = models.ForeignKey('TrainingListeningTestQuestion', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'training_listening_answer_group'


class TrainingListeningCheckAnswer(models.Model):
    training_listening_test_answer = models.ForeignKey(TrainingListeningAnswer, models.DO_NOTHING)
    training_listening_answer_group = models.ForeignKey(TrainingListeningAnswerGroup, models.DO_NOTHING)
    right_answer = models.TextField(blank=True, null=True)
    percent = models.IntegerField(blank=True, null=True)
    wrong_answer = models.ForeignKey('WrongAnswer', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'training_listening_check_answer'


class TrainingListeningRightAnswer(models.Model):
    training_listening_question = models.ForeignKey('TrainingListeningTestQuestion', models.DO_NOTHING)
    right_answer = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_listening_right_answers'


class TrainingListeningTest(models.Model):
    status = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField()
    order = models.IntegerField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    membership = models.ForeignKey(Membership, models.DO_NOTHING)
    profesor_text = models.TextField(blank=True, null=True)
    show_profesor_text = models.IntegerField(blank=True, null=True)
    text = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_listening_test'


class TrainingListeningTestTranslation(models.Model):
    training_listening_test = models.ForeignKey(TrainingListeningTest, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    seo_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_listening_test_label'


class TrainingListeningTestQuestion(models.Model):
    training_listening_test = models.ForeignKey(TrainingListeningTest, models.DO_NOTHING)
    audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_listening_test_question'


class TrainingListeningTestQuestionTranslation(models.Model):
    training_listening_test_question = models.ForeignKey(TrainingListeningTestQuestion, models.DO_NOTHING)
    question = models.CharField(max_length=255, blank=True, null=True)
    language = models.ForeignKey(Language, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'training_listening_test_question_label'


class TrainingReading(models.Model):
    status = models.IntegerField(blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField()
    image = models.CharField(max_length=255, blank=True, null=True)
    training_type = models.IntegerField(blank=True, null=True)
    profesor_text = models.TextField(blank=True, null=True)
    show_profesor_text = models.IntegerField(blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    membership = models.ForeignKey(Membership, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_reading'


class TrainingReadingAnswer(models.Model):
    training_reading = models.ForeignKey(TrainingReading, models.DO_NOTHING)
    user = models.ForeignKey('User', models.DO_NOTHING)
    checked = models.IntegerField(blank=True, null=True)
    looked = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'training_reading_answer'


class TrainingReadingCheckAnswer(models.Model):
    training_reading_test_answer = models.ForeignKey(TrainingReadingAnswer, models.DO_NOTHING)
    training_reading_answer_group = models.ForeignKey('TrainingReadingQuestionAnswer', models.DO_NOTHING)
    right_answer = models.TextField(blank=True, null=True)
    percent = models.IntegerField(blank=True, null=True)
    wrong_answer = models.ForeignKey('WrongAnswer', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'training_reading_check_answer'


class TrainingReadingExplanation(models.Model):
    text = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)
    preparation_audio = models.CharField(max_length=255, blank=True, null=True)
    recording_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_reading_explain'


class TrainingReadingTranslation(models.Model):
    training_reading = models.ForeignKey(TrainingReading, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_reading_label'


class TrainingReadingQuestionAnswer(models.Model):
    training_reading_answer = models.ForeignKey(TrainingReadingAnswer, models.DO_NOTHING)
    training_reading_test = models.ForeignKey('TrainingReadingTest', models.DO_NOTHING)
    audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_reading_question_answers'


class TrainingReadingTest(models.Model):
    training_reading = models.ForeignKey(TrainingReading, models.DO_NOTHING)
    status = models.IntegerField(blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField()
    main_image = models.CharField(max_length=255, blank=True, null=True)
    main_audio = models.CharField(max_length=255, blank=True, null=True)
    text = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_reading_test'


class TrainingReadingTestUsersAnswer(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING)
    training_reading = models.ForeignKey(LegacyTrainingReading, models.DO_NOTHING, db_column='training_reading')
    complete_id = models.PositiveIntegerField()
    complete_history_id = models.PositiveIntegerField()
    status = models.IntegerField(db_comment='0=unread, 1=read')
    created_date = models.DateTimeField()
    score = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_reading_test_users_answer'


class TrainingSpeaking(models.Model):
    status = models.IntegerField(blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField()
    image = models.CharField(max_length=255, blank=True, null=True)
    profesor_text = models.TextField(blank=True, null=True)
    show_profesor_text = models.IntegerField(blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    membership = models.ForeignKey(Membership, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_speaking'


class TrainingSpeakingAnswer(models.Model):
    training_speaking = models.ForeignKey(TrainingSpeaking, models.DO_NOTHING)
    user = models.ForeignKey('User', models.DO_NOTHING)
    checked = models.IntegerField(blank=True, null=True)
    looked = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'training_speaking_answer'


class TrainingSpeakingCheckAnswer(models.Model):
    training_speaking_test_answer = models.ForeignKey(TrainingSpeakingAnswer, models.DO_NOTHING)
    training_speaking_answer_group = models.ForeignKey('TrainingSpeakingQuestionAnswer', models.DO_NOTHING)
    right_answer = models.TextField(blank=True, null=True)
    percent = models.IntegerField(blank=True, null=True)
    wrong_answer = models.ForeignKey('WrongAnswer', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'training_speaking_check_answer'


class TrainingSpeakingExplanation(models.Model):
    text = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)
    preparation_audio = models.CharField(max_length=255, blank=True, null=True)
    recording_audio = models.CharField(max_length=255, blank=True, null=True)
    test_1_preparation_time = models.TimeField(blank=True, null=True)
    test_1_recording_time = models.TimeField(blank=True, null=True)
    test_1_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_1_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_2_preparation_time = models.TimeField(blank=True, null=True)
    test_2_recording_time = models.TimeField(blank=True, null=True)
    test_2_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_2_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_3_preparation_time = models.TimeField(blank=True, null=True)
    test_3_recording_time = models.TimeField(blank=True, null=True)
    test_3_reading_time = models.TimeField(blank=True, null=True)
    test_3_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_3_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_4_preparation_time = models.TimeField(blank=True, null=True)
    test_4_recording_time = models.TimeField(blank=True, null=True)
    test_4_reading_time = models.TimeField(blank=True, null=True)
    test_4_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_4_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_5_preparation_time = models.TimeField(blank=True, null=True)
    test_5_recording_time = models.TimeField(blank=True, null=True)
    test_5_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_5_headphone_audio = models.CharField(max_length=255, blank=True, null=True)
    test_6_preparation_time = models.TimeField(blank=True, null=True)
    test_6_recording_time = models.TimeField(blank=True, null=True)
    test_6_headphone_image = models.CharField(max_length=255, blank=True, null=True)
    test_6_headphone_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_speaking_explain'


class TrainingSpeakingTranslation(models.Model):
    training_speaking = models.ForeignKey(TrainingSpeaking, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_speaking_label'


class TrainingSpeakingQuestionAnswer(models.Model):
    training_speaking_answer = models.ForeignKey(TrainingSpeakingAnswer, models.DO_NOTHING)
    training_speaking_test = models.ForeignKey('TrainingSpeakingTest', models.DO_NOTHING)
    audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_speaking_question_answers'


class TrainingSpeakingTest(models.Model):
    training_speaking = models.ForeignKey(TrainingSpeaking, models.DO_NOTHING)
    status = models.IntegerField()
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    type = models.IntegerField(blank=True, null=True)
    preparation_time = models.TimeField()
    recording_time = models.TimeField()
    reading_time = models.TimeField()
    main_image = models.CharField(max_length=255, blank=True, null=True)
    main_audio = models.CharField(max_length=255, blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    text_audio = models.CharField(max_length=255, blank=True, null=True)
    reading_text = models.TextField(blank=True, null=True)
    conversation_image = models.CharField(max_length=255, blank=True, null=True)
    conversation_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_speaking_test'


class TrainingWriting(models.Model):
    status = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField()
    sort_order = models.IntegerField(blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    profesor_audio = models.CharField(max_length=255, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    profesor_text = models.TextField(blank=True, null=True)
    show_profesor_text = models.IntegerField(blank=True, null=True)
    audio_image = models.CharField(max_length=255, blank=True, null=True)
    membership = models.ForeignKey(Membership, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_writing'


class TrainingWritingAnswer(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING)
    training_writing = models.ForeignKey(TrainingWriting, models.DO_NOTHING)
    created_date = models.DateTimeField()
    checked = models.IntegerField(blank=True, null=True)
    looked = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_writing_answer'


class TrainingWritingAnswerGroup(models.Model):
    training_writing_answer = models.ForeignKey(TrainingWritingAnswer, models.DO_NOTHING)
    answer = models.TextField(blank=True, null=True)
    training_question = models.ForeignKey('TrainingWritingQuestion', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'training_writing_answer_group'


class TrainingWritingCheckAnswer(models.Model):
    training_answer = models.ForeignKey(TrainingWritingAnswer, models.DO_NOTHING)
    training_answer_group = models.ForeignKey(TrainingWritingAnswerGroup, models.DO_NOTHING)
    right_answer = models.TextField(blank=True, null=True)
    percent = models.IntegerField(blank=True, null=True)
    wrong_answer = models.ForeignKey('WrongAnswer', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'training_writing_check_answer'


class TrainingWritingExplanation(models.Model):
    text = models.TextField(blank=True, null=True)
    audio = models.CharField(max_length=255, blank=True, null=True)
    text_independent = models.TextField(blank=True, null=True)
    audion_independent = models.CharField(max_length=255, blank=True, null=True)
    general_text = models.TextField(blank=True, null=True)
    general_audio = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_writing_explain'


class TrainingWritingTranslation(models.Model):
    training_writing = models.ForeignKey(TrainingWriting, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_writing_label'


class TrainingWritingQuestion(models.Model):
    training_writing = models.ForeignKey(TrainingWriting, models.DO_NOTHING)
    status = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField()
    sort_order = models.IntegerField(blank=True, null=True)
    type = models.IntegerField(blank=True, null=True)
    directions = models.TextField(blank=True, null=True)
    question = models.TextField(blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_writing_question'


class TrainingWritingRightAnswer(models.Model):
    training_writing_question = models.ForeignKey(TrainingWritingQuestion, models.DO_NOTHING)
    right_answer = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'training_writing_right_answers'


class Training(models.Model):
    trainings_group = models.ForeignKey('TrainingGroup', models.DO_NOTHING)
    test_id = models.PositiveIntegerField()
    status = models.IntegerField()
    type_seccond = models.IntegerField(db_comment='0 = toefl, 1 =ielts')
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    type = models.IntegerField(db_comment='1 =reading, 2 =listening, 3 = speaking, 4 = writing, 5 =complete')

    class Meta:
        managed = False
        db_table = 'trainings'


class TrainingGroup(models.Model):
    status = models.IntegerField()
    created_date = models.DateTimeField()
    sort_order = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'trainings_group'


class TrainingGroupTranslation(models.Model):
    trainings_group = models.ForeignKey(TrainingGroup, models.DO_NOTHING)
    language_id = models.PositiveIntegerField()
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'trainings_group_label'


class TrainingTranslation(models.Model):
    trainings = models.ForeignKey(Training, models.DO_NOTHING)
    language_id = models.PositiveIntegerField()
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'trainings_label'


class Translation(models.Model):
    key = models.CharField(max_length=65)

    class Meta:
        managed = False
        db_table = 'translation'


class TranslationTranslation(models.Model):
    translation = models.ForeignKey(Translation, models.DO_NOTHING)
    language = models.ForeignKey(Language, models.DO_NOTHING)
    value = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'translation_label'


class UserCv(models.Model):
    user_id = models.PositiveIntegerField()
    cv_id = models.PositiveIntegerField()
    created_date = models.DateTimeField()
    html_code = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_cv'


class UserMembership(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING)
    membership = models.ForeignKey(Membership, models.DO_NOTHING)
    price = models.FloatField(blank=True, null=True)
    transaction = models.TextField(blank=True, null=True)
    created_date = models.DateTimeField()
    from_admin = models.IntegerField(db_comment='0 = no, 1 = yes')

    class Meta:
        managed = False
        db_table = 'user_has_membership'


class UserHistory(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING)
    test = models.ForeignKey(TestCategory, models.DO_NOTHING)
    created_date = models.DateTimeField()
    duration = models.CharField(max_length=32)
    score = models.IntegerField()
    score_from = models.IntegerField()
    answers = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_history'


class UserWritingHistory(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING)
    writing = models.ForeignKey(ToeflWriting, models.DO_NOTHING)
    complete_id = models.PositiveIntegerField()
    complete_history_id = models.PositiveIntegerField()
    status = models.IntegerField(db_comment='1 = unread, 0 = read')
    created_date = models.DateTimeField()
    score = models.CharField(max_length=32, blank=True, null=True)
    chek_answer = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_writing_history'


class UserWritingHistoryWrong(models.Model):
    user_writing_history_itema = models.ForeignKey('UserWritingHistoryItem', models.DO_NOTHING)
    wrong = models.ForeignKey('WrongAnswer', models.DO_NOTHING)
    count = models.IntegerField()
    right_answer = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_writing_history_has_wrong'


class UserWritingHistoryItem(models.Model):
    user_writing_history = models.ForeignKey(UserWritingHistory, models.DO_NOTHING)
    writing_question_id = models.PositiveIntegerField()
    text = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_writing_history_itema'


class User(models.Model):
    block = models.IntegerField(db_comment='0-false, 1-true')
    user_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255, db_comment='md5')
    email = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    gender = models.IntegerField(db_comment='1=male,2=female')
    dob = models.DateField(blank=True, null=True)
    avatar = models.CharField(max_length=255, blank=True, null=True)
    created_date = models.DateTimeField()
    last_login_date = models.DateTimeField()
    fb = models.CharField(max_length=255, blank=True, null=True)
    instagram = models.CharField(max_length=255, blank=True, null=True)
    linkedin = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    reset_key = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=32, blank=True, null=True)
    auth_key = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'


class Writing(models.Model):
    sort_order = models.IntegerField()
    created_date = models.DateTimeField()
    status = models.IntegerField()
    type = models.IntegerField(blank=True, null=True, db_comment='1- integrated, 2- independent')
    text_time = models.TimeField()
    text = models.TextField(blank=True, null=True)
    listening_image = models.CharField(max_length=255, blank=True, null=True)
    listening_audio = models.CharField(max_length=255, blank=True, null=True)
    listening_time = models.TimeField()

    class Meta:
        managed = False
        db_table = 'writing'


class WritingAnswer(models.Model):
    user = models.ForeignKey(User, models.DO_NOTHING)
    writing = models.ForeignKey(Writing, models.DO_NOTHING)
    answer = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'writing_ansswer'


class WritingWrongAnswer(models.Model):
    writing = models.ForeignKey(WritingAnswer, models.DO_NOTHING)
    wrong_answer = models.ForeignKey('WrongAnswer', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'writing_has_wrong_answer'


class WrongAnswer(models.Model):
    training = models.ForeignKey(Training, models.DO_NOTHING, blank=True, null=True)
    sort_order = models.IntegerField()
    status = models.IntegerField()
    created_date = models.DateTimeField()
    color = models.CharField(max_length=8)
    value = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wrong_answers'
