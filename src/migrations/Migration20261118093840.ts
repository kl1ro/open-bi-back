import { Migration } from '@mikro-orm/migrations';

export class Migration20261118093840 extends Migration {

  override name = 'Migration20261118093840';

  override up(): void | Promise<void> {
    this.addSql(`create table "organizations" ("id" uuid not null, "name" varchar(255) not null, "owner_id" uuid not null, "created_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`create table "memberships" ("organization_id" uuid not null, "user_id" uuid not null, "invited_by" uuid null, "joined_at" timestamptz not null, primary key ("organization_id", "user_id"));`);

    this.addSql(`create table "invitations" ("id" uuid not null, "organization_id" uuid not null, "created_by" uuid not null, "created_at" timestamptz not null, "single_use" boolean not null, "expires_at" timestamptz null, "used_by" uuid null, "used_at" timestamptz null, primary key ("id"));`);

    this.addSql(`alter table "organizations" add constraint "organizations_owner_id_foreign" foreign key ("owner_id") references "users" ("id");`);

    this.addSql(`alter table "memberships" add constraint "memberships_organization_id_foreign" foreign key ("organization_id") references "organizations" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "memberships" add constraint "memberships_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "memberships" add constraint "memberships_invited_by_foreign" foreign key ("invited_by") references "users" ("id") on delete set null;`);

    this.addSql(`alter table "invitations" add constraint "invitations_organization_id_foreign" foreign key ("organization_id") references "organizations" ("id") on delete cascade;`);
    this.addSql(`alter table "invitations" add constraint "invitations_created_by_foreign" foreign key ("created_by") references "users" ("id");`);
    this.addSql(`alter table "invitations" add constraint "invitations_used_by_foreign" foreign key ("used_by") references "users" ("id") on delete set null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "memberships" drop constraint "memberships_organization_id_foreign";`);
    this.addSql(`alter table "invitations" drop constraint "invitations_organization_id_foreign";`);

    this.addSql(`drop table if exists "organizations" cascade;`);
    this.addSql(`drop table if exists "memberships" cascade;`);
    this.addSql(`drop table if exists "invitations" cascade;`);
  }

}
