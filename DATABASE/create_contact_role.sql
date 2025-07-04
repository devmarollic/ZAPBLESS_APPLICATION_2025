create table if not exists "public"."CONTACT_MINISTRY" (
  "contactId" VARCHAR(22) null,
  "churchId" VARCHAR(22) null,
  "roleSlug" TEXT null,
  "joinedAtTimestamp" TIMESTAMP null default now(),
  "leftAtTimestamp" TIMESTAMP null,
  "creationTimestamp" TIMESTAMP null default now(),
  "updateTimestamp" TIMESTAMP null default now(),
  constraint "constraint_contact_ministry_contact_1" foreign key ("contactId") references "public"."CONTACT" ("id") on delete set null on update no action,
  constraint "constraint_contact_ministry_church_2" foreign key ("churchId") references "public"."CHURCH" ("id") on delete set null on update no action,
  constraint "constraint_contact_ministry_ministry_member_role_3" foreign key ("roleSlug") references "public"."MINISTRY_MEMBER_ROLE" ("id") on delete set null on update no action,
  primary key ("contactId", "churchId", "roleSlug")
);