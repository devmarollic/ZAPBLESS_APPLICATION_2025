drop table if exists "public"."USER_GENDER";

create table if not exists "public"."USER_GENDER"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."LANGUAGE";

create table if not exists "public"."LANGUAGE"(
    "code" TEXT not null primary key,
    "number" DOUBLE PRECISION null,
    "name" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."CONTINENT";

create table if not exists "public"."CONTINENT"(
    "code" TEXT not null primary key,
    "name" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."COUNTRY";

create table if not exists "public"."COUNTRY"(
    "code" TEXT not null primary key,
    "number" DOUBLE PRECISION null,
    "name" TEXT null,
    "fullName" TEXT null,
    "continentCode" TEXT null,
    "iconImagePath" TEXT null,
    "phonePrefix" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

create table if not exists "public"."DOCUMENT_TYPE"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "validatePattern" TEXT null,
    "maskPattern" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."CITY";

create table if not exists "public"."CITY"(
    "code" TEXT not null primary key,
    "countryCode" TEXT null,
    "name" TEXT null,
    "searchName" TEXT null,
    "provinceName" TEXT null,
    "countryName" TEXT null,
    "communityName" TEXT null,
    "position" TEXT null,
    constraint `constraint_city_country_1"
    foreign key( "countryCode" )
    references "public"."COUNTRY"( "code" )
        on delete set null
        on update no action
    );

drop table if exists "public"."CHURCH_STATUS";

create table if not exists "public"."CHURCH_STATUS"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."CHURCH";

create table if not exists "public"."CHURCH"(
    "id" VARCHAR(22) not null primary key,
    "name" TEXT null,
    "statusId" TEXT null,
    "addressLine1" TEXT null,
    "addressLine2" TEXT null,
    "cityCode" TEXT null,
    "cityName" TEXT null,
    "zipCode" TEXT null,
    "neighborhood" TEXT null,
    "stateCode" TEXT null,
    "stateName" TEXT null,
    "countryCode" TEXT null,
    "coordinates" TEXT null,
    "documentType" TEXT null,
    "documentNumber" TEXT null,
    "languageTag" TEXT null,
    "imagePath" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_church_church_status_1"
    foreign key( "statusId" )
    references "public"."CHURCH_STATUS"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_church_country_2"
    foreign key( "countryCode" )
    references "public"."COUNTRY"( "code" )
        on delete set null
        on update no action,
    constraint `constraint_church_document_type_3"
    foreign key( "documentType" )
    references "public"."DOCUMENT_TYPE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_church_language_4"
    foreign key( "languageTag" )
    references "public"."LANGUAGE"( "code" )
        on delete set null
        on update no action
    );

drop table if exists "public"."USER_STATUS";

create table if not exists "public"."USER_STATUS"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."PROFILE";

create table if not exists "public"."PROFILE"(
    "id" UUID not null primary key references auth.users on delete cascade,
    "firstName" TEXT null,
    "lastName" TEXT null,
    "legalName" TEXT null,
    "birthDate" TIMESTAMP null,
    "aboutDescription" TEXT null,
    "email" TEXT null,
    "phonePrefix" TEXT null,
    "phoneNumber" TEXT null,
    "genderId" TEXT null,
    "documentType" TEXT null,
    "documentNumber" TEXT null,
    "statusId" TEXT null,
    "countryCode" TEXT null,
    "imagePath" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_profile_user_gender_1"
    foreign key( "genderId" )
    references "public"."USER_GENDER"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_profile_document_type_2"
    foreign key( "documentType" )
    references "public"."DOCUMENT_TYPE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_profile_user_status_3"
    foreign key( "statusId" )
    references "public"."USER_STATUS"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_profile_country_4"
    foreign key( "countryCode" )
    references "public"."COUNTRY"( "code" )
        on delete set null
        on update no action
    );

drop table if exists "public"."CURRENCY";

create table if not exists "public"."CURRENCY"(
    "code" TEXT not null primary key,
    "pluralName" TEXT null,
    "singularName" TEXT null,
    "symbol" TEXT null
    );

drop table if exists "public"."PLAN";

create table if not exists "public"."PLAN"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "number" DOUBLE PRECISION null,
    "description" TEXT null,
    "monthlyPrice" DOUBLE PRECISION null,
    "annualPrice" DOUBLE PRECISION null,
    "isActive" BOOLEAN null,
    "isPromoted" BOOLEAN null,
    "color" TEXT null,
    "currencyCode" TEXT null,
    "whatsappLimit" DOUBLE PRECISION null,
    "userLimit" DOUBLE PRECISION null,
    "ministryLimit" DOUBLE PRECISION null,
    "featureArray" JSONB null,
    constraint `constraint_plan_currency_1"
    foreign key( "currencyCode" )
    references "public"."CURRENCY"( "code" )
        on delete set null
        on update no action
    );

drop table if exists "public"."SUBSCRIPTION_TYPE";

create table if not exists "public"."SUBSCRIPTION_TYPE"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "number" DOUBLE PRECISION null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."SUBSCRIPTION_PERIOD";

create table if not exists "public"."SUBSCRIPTION_PERIOD"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "number" DOUBLE PRECISION null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."SUBSCRIPTION_STATUS";

create table if not exists "public"."SUBSCRIPTION_STATUS"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "number" DOUBLE PRECISION null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."SUBSCRIPTION";

create table if not exists "public"."SUBSCRIPTION"(
    "id" VARCHAR(22) not null primary key,
    "churchId" VARCHAR(22) null,
    "planId" TEXT null,
    "typeId" TEXT null,
    "statusId" TEXT null,
    "periodId" TEXT null,
    "price" TEXT null,
    "startAtDateTimestamp" TIMESTAMP null,
    "expiresAtDateTimestamp" TIMESTAMP null,
    "paymentGatewayId" TEXT null,
    "paymentMethodId" TEXT null,
    "chargeInfo" JSONB null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_subscription_church_1"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_subscription_plan_2"
    foreign key( "planId" )
    references "public"."PLAN"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_subscription_subscription_type_3"
    foreign key( "typeId" )
    references "public"."SUBSCRIPTION_TYPE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_subscription_subscription_status_4"
    foreign key( "statusId" )
    references "public"."SUBSCRIPTION_STATUS"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_subscription_subscription_period_5"
    foreign key( "periodId" )
    references "public"."SUBSCRIPTION_PERIOD"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."VALIDATION_STATUS";

create table if not exists "public"."VALIDATION_STATUS"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."MINISTRY";

create table if not exists "public"."MINISTRY"(
    "id" VARCHAR(22) not null primary key,
    "churchId" VARCHAR(22) null,
    "name" TEXT null,
    "description" TEXT null,
    "color" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_ministry_church_1"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action
    );

create table if not exists "public"."MINISTRY_MEMBER_ROLE"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

create table if not exists "public"."MINISTRY_MEMBER"(
    "id" VARCHAR(22) not null primary key,
    "profileId" UUID null,
    "ministryId" VARCHAR(22) null,
    "roleSlug" TEXT null,
    "joinedAtTimestamp" TIMESTAMP null default now(),
    "leftAtTimestamp" TIMESTAMP null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_ministry_member_profile_1"
    foreign key( "profileId" )
    references "public"."PROFILE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_ministry_member_ministry_2"
    foreign key( "ministryId" )
    references "public"."MINISTRY"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_ministry_member_ministry_member_role_3"
    foreign key( "roleSlug" )
    references "public"."MINISTRY_MEMBER_ROLE"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."EVENT_STATUS";

create table if not exists "public"."EVENT_STATUS"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "description" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."EVENT_TYPE";

create table if not exists "public"."EVENT_TYPE"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "description" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."PERMISSION";

create table if not exists "public"."PERMISSION"(
    "id" TEXT not null primary key,
    "slug" TEXT null,
    "name" TEXT null,
    "description" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."ROLE";

create table if not exists "public"."ROLE"(
    "slug" TEXT not null primary key,
    "name" TEXT null,
    "description" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."ROLE_PERMISSION";

create table if not exists "public"."ROLE_PERMISSION"(
    "roleId" TEXT null,
    "permissionId" TEXT null,
    constraint `constraint_role_permission_role_1"
    foreign key( "roleId" )
    references "public"."ROLE"( "slug" )
        on delete set null
        on update no action,
    constraint `constraint_role_permission_permission_2"
    foreign key( "permissionId" )
    references "public"."PERMISSION"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."USER_CHURCH_ROLE";

create table if not exists "public"."USER_CHURCH_ROLE"(
    "profileId" UUID not null primary key,
    "churchId" VARCHAR(22) null,
    "roleSlug" TEXT null,
    constraint `constraint_user_church_role_profile_1"
    foreign key( "profileId" )
    references "public"."PROFILE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_user_church_role_church_2"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_user_church_role_role_3"
    foreign key( "roleSlug" )
    references "public"."ROLE"( "slug" )
        on delete set null
        on update no action
    );

drop table if exists "public"."SCHEDULE_STATUS";

create table if not exists "public"."SCHEDULE_STATUS"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "description" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."RECURRENCE_TYPE";

create table if not exists "public"."RECURRENCE_TYPE"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "description" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."RECURRENCE";

create table if not exists "public"."RECURRENCE"(
    "id" VARCHAR(22) not null primary key,
    "typeId" TEXT null,
    "interval" DOUBLE PRECISION null,
    "dayOfWeekArray" JSONB null,
    "dayOfMonthArray" JSONB null,
    "weekOfMonth" DOUBLE PRECISION null,
    "specificDay" DOUBLE PRECISION null,
    "month" DOUBLE PRECISION null,
    "timeOfDayTimestamp" TIME null,
    "endAtTimestamp" TIMESTAMP null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_recurrence_recurrence_type_1"
    foreign key( "typeId" )
    references "public"."RECURRENCE_TYPE"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."EVENT";

create table if not exists "public"."EVENT"(
    "id" VARCHAR(22) not null primary key,
    "churchId" VARCHAR(22) null,
    "ministryId" VARCHAR(22) null,
    "title" TEXT null,
    "description" TEXT null,
    "location" TEXT null,
    "statusId" TEXT null,
    "typeId" TEXT null,
    "otherTypeReason" TEXT null,
    "startAtTimestamp" TIMESTAMP null,
    "endAtTimestamp" TIMESTAMP null,
    "isPublic" BOOLEAN null,
    "recurrenceTypeId" TEXT null,
    "recurrenceId" VARCHAR(22) null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_event_church_1"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_event_ministry_2"
    foreign key( "ministryId" )
    references "public"."MINISTRY"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_event_event_status_3"
    foreign key( "statusId" )
    references "public"."EVENT_STATUS"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_event_event_type_4"
    foreign key( "typeId" )
    references "public"."EVENT_TYPE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_event_recurrence_type_5"
    foreign key( "recurrenceTypeId" )
    references "public"."RECURRENCE_TYPE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_event_recurrence_6"
    foreign key( "recurrenceId" )
    references "public"."RECURRENCE"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."NOTIFICATION_TYPE";

create table if not exists "public"."NOTIFICATION_TYPE"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."NOTIFICATION_MEDIUM";

create table if not exists "public"."NOTIFICATION_MEDIUM"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."SCHEDULE";

create table if not exists "public"."SCHEDULE"(
    "id" VARCHAR(22) not null primary key,
    "churchId" VARCHAR(22) null,
    "eventId" VARCHAR(22) null,
    "notificationTypeId" TEXT null,
    "notificationMediumId" TEXT null,
    "scheduleAtTimestamp" TIMESTAMP null,
    "payload" JSONB null,
    "statusId" TEXT null,
    "targetRoleArray" TEXT null,
    "recurrenceId" VARCHAR(22) null,
    "errorMessage" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_schedule_church_1"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_schedule_event_2"
    foreign key( "eventId" )
    references "public"."EVENT"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_schedule_notification_type_3"
    foreign key( "notificationTypeId" )
    references "public"."NOTIFICATION_TYPE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_schedule_schedule_status_4"
    foreign key( "statusId" )
    references "public"."SCHEDULE_STATUS"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_schedule_recurrence_5"
    foreign key( "recurrenceId" )
    references "public"."RECURRENCE"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."SCHEDULE_MINISTRY";

create table if not exists "public"."SCHEDULE_MINISTRY"(
    "id" VARCHAR(22) not null primary key,
    "scheduleId" VARCHAR(22) null,
    "ministryId" VARCHAR(22) null,
    constraint `constraint_schedule_ministry_schedule_1"
    foreign key( "scheduleId" )
    references "public"."SCHEDULE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_schedule_ministry_ministry_2"
    foreign key( "ministryId" )
    references "public"."MINISTRY"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."SCHEDULE_PROFILE";

create table if not exists "public"."SCHEDULE_PROFILE"(
    "id" VARCHAR(22) not null primary key,
    "scheduleId" VARCHAR(22) null,
    "profileId" UUID null,
    constraint `constraint_schedule_profile_schedule_1"
    foreign key( "scheduleId" )
    references "public"."SCHEDULE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_schedule_profile_profile_2"
    foreign key( "profileId" )
    references "public"."PROFILE"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."NOTIFICATION_PERMISSION";

create table if not exists "public"."NOTIFICATION_PERMISSION"(
    "id" TEXT not null primary key,
    "profileId" UUID null,
    "notificationTypeId" TEXT null,
    "notificationMediumId" TEXT null,
    "isGranted" BOOLEAN null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_notification_permission_profile_1"
    foreign key( "profileId" )
    references "public"."PROFILE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_notification_permission_notification_type_2"
    foreign key( "notificationTypeId" )
    references "public"."NOTIFICATION_TYPE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_notification_permission_notification_medium_3"
    foreign key( "notificationMediumId" )
    references "public"."NOTIFICATION_MEDIUM"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."NOTIFICATION_CENTER_SEVERITY";

create table if not exists "public"."NOTIFICATION_CENTER_SEVERITY"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "description" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."NOTIFICATION_CENTER";

create table if not exists "public"."NOTIFICATION_CENTER"(
    "id" VARCHAR(22) not null primary key,
    "notificationTypeId" TEXT null,
    "message" TEXT null,
    "churchId" VARCHAR(22) null,
    "isReaded" BOOLEAN null,
    "source" TEXT null,
    "severityId" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_notification_center_notification_type_1"
    foreign key( "notificationTypeId" )
    references "public"."NOTIFICATION_TYPE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_notification_center_church_2"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_notification_center_notification_center_severity_3"
    foreign key( "severityId" )
    references "public"."NOTIFICATION_CENTER_SEVERITY"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."PRESENCE_STATUS";

create table if not exists "public"."PRESENCE_STATUS"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "description" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."EVENT_PARTICIPATION";

create table if not exists "public"."EVENT_PARTICIPATION"(
    "id" VARCHAR(22) not null primary key,
    "profileId" UUID null,
    "eventId" VARCHAR(22) null,
    "presenceStatusId" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_event_participation_profile_1"
    foreign key( "profileId" )
    references "public"."PROFILE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_event_participation_event_2"
    foreign key( "eventId" )
    references "public"."EVENT"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_event_participation_presence_status_3"
    foreign key( "presenceStatusId" )
    references "public"."PRESENCE_STATUS"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."AUDIT_LOG";

create table if not exists "public"."AUDIT_LOG"(
    "id" VARCHAR(22) not null primary key,
    "profileId" UUID null,
    "churchId" VARCHAR(22) null,
    "action" TEXT null,
    "entity" TEXT null,
    "entityId" TEXT null,
    "differenceJson" JSONB null,
    "creationTimestamp" TIMESTAMP null default now(),
    constraint `constraint_audit_log_profile_1"
    foreign key( "profileId" )
    references "public"."PROFILE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_audit_log_church_2"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."MEDIA_STORAGE_TYPE";

create table if not exists "public"."MEDIA_STORAGE_TYPE"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "description" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."MEDIA_STORAGE";

create table if not exists "public"."MEDIA_STORAGE"(
    "id" TEXT not null primary key,
    "churchId" VARCHAR(22) null,
    "path" TEXT null,
    "typeId" TEXT null,
    "label" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_media_storage_church_1"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_media_storage_media_storage_type_2"
    foreign key( "typeId" )
    references "public"."MEDIA_STORAGE_TYPE"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."TAG_TYPE";

create table if not exists "public"."TAG_TYPE"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "description" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

drop table if exists "public"."TAG";

create table if not exists "public"."TAG"(
    "id" TEXT not null primary key,
    "churchId" VARCHAR(22) null,
    "name" TEXT null,
    "typeId" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_tag_church_1"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_tag_tag_type_2"
    foreign key( "typeId" )
    references "public"."TAG_TYPE"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."PROFILE_TAG";

create table if not exists "public"."PROFILE_TAG"(
    "profileId" UUID null,
    "tagId" TEXT null,
    constraint `constraint_profile_tag_profile_1"
    foreign key( "profileId" )
    references "public"."PROFILE"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_profile_tag_tag_2"
    foreign key( "tagId" )
    references "public"."TAG"( "id" )
        on delete set null
        on update no action
    );

drop table if exists "public"."PLAN_NOTIFICATION_CHANNEL";

create table if not exists "public"."PLAN_NOTIFICATION_CHANNEL"(
    "id" VARCHAR(22) not null primary key,
    "planId" TEXT null,
    "notificationMediumId" TEXT null,
    constraint `constraint_plan_notification_channel_plan_1"
    foreign key( "planId" )
    references "public"."PLAN"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_plan_notification_channel_notification_medium_2"
    foreign key( "notificationMediumId" )
    references "public"."NOTIFICATION_MEDIUM"( "id" )
        on delete set null
        on update no action
    );

create table if not exists "public"."WHATSAPP"(
    "id" VARCHAR(22) not null primary key,
    "churchId" VARCHAR(22) null,
    "name" TEXT null,
    "status" TEXT null,
    "qrcode" TEXT null,
    "retries" DOUBLE PRECISION null,
    "battery" DOUBLE PRECISION null,
    "isPlugged" BOOLEAN null,
    "greetingMessage" TEXT null,
    "farewellsMessage" TEXT null,
    "isDefault" BOOLEAN null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_whatsapp_church_1"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action
    );

create table if not exists "public"."PAYMENT_EVENT_TYPE"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "number" DOUBLE PRECISION null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

create table if not exists "public"."PAYMENT_EVENT"(
    "id" VARCHAR(22) not null primary key,
    "typeId" TEXT null,
    "chargeInfo" JSONB null,
    "processed" BOOLEAN null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_payment_event_payment_event_type_1"
    foreign key( "typeId" )
    references "public"."PAYMENT_EVENT_TYPE"( "id" )
        on delete set null
        on update no action
    );

create table if not exists "public"."PAYMENT_METHOD"(
    "id" VARCHAR(22) not null primary key,
    "churchId" VARCHAR(22) null,
    "isDefault" TEXT null,
    "gatewayCardId" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_payment_method_church_1"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action
    );

create table if not exists "public"."CONTACT"(
    "id" VARCHAR(22) not null primary key,
    "churchId" VARCHAR(22) null,
    "ecclesiasticalTitle" TEXT null,
    "number" TEXT null,
    "isMe" BOOLEAN null,
    "isUser" BOOLEAN null,
    "isGroup" BOOLEAN null,
    "isWAContact" BOOLEAN null,
    "isMyContact" BOOLEAN null,
    "isBlocked" BOOLEAN null,
    "isBusiness" BOOLEAN null,
    "isEnterprise" BOOLEAN null,
    "shortName" TEXT null,
    "name" TEXT null,
    "pushname" TEXT null,
    "sectionHeader" TEXT null,
    "statusMute" TEXT null,
    "type" TEXT null,
    "verifiedLevel" TEXT null,
    "verifiedName" TEXT null,
    constraint `constraint_contact_church_1"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action
    );

create table if not exists "public"."CONTACT_MINISTRY"(
    "contactId" VARCHAR(22) null,
    "churchId" VARCHAR(22) null,
    "roleSlug" TEXT null,
    "joinedAtTimestamp" TIMESTAMP null default now(),
    "leftAtTimestamp" TIMESTAMP null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_contact_ministry_contact_1"
    foreign key( "contactId" )
    references "public"."CONTACT"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_contact_ministry_church_2"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_contact_ministry_ministry_member_role_3"
    foreign key( "roleSlug" )
    references "public"."MINISTRY_MEMBER_ROLE"( "id" )
        on delete set null
        on update no action
    );

create table if not exists "public"."MESSAGE_TEMPLATE_CATEGORY"(
    "id" TEXT not null primary key,
    "name" TEXT null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now()
    );

create table if not exists "public"."MESSAGE_TEMPLATE"(
    "id" VARCHAR(22) not null primary key,
    "churchId" VARCHAR(22) null,
    "name" TEXT null,
    "categoryId" TEXT null,
    "languageTag" TEXT null,
    "content" TEXT null,
    "allowCategoryChange" BOOLEAN null,
    "isActive" BOOLEAN null,
    "creationTimestamp" TIMESTAMP null default now(),
    "updateTimestamp" TIMESTAMP null default now(),
    constraint `constraint_message_template_church_1"
    foreign key( "churchId" )
    references "public"."CHURCH"( "id" )
        on delete set null
        on update no action,
    constraint `constraint_message_template_language_2"
    foreign key( "languageTag" )
    references "public"."LANGUAGE"( "code" )
        on delete set null
        on update no action
    );
