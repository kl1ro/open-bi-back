import { Migration } from '@mikro-orm/migrations';

export class Migration20261118124643 extends Migration {

  override name = 'Migration20261118124643';

  override up(): void | Promise<void> {
    this.addSql(`alter table "users" alter column "created_at" set default now();`);

    this.addSql(`alter table "organizations" alter column "created_at" set default now();`);

    this.addSql(`alter table "memberships" alter column "joined_at" set default now();`);

    this.addSql(`alter table "invitations" alter column "created_at" set default now();`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "invitations" alter column "created_at" drop default;`);

    this.addSql(`alter table "memberships" alter column "joined_at" drop default;`);

    this.addSql(`alter table "organizations" alter column "created_at" drop default;`);

    this.addSql(`alter table "users" alter column "created_at" drop default;`);
  }

}
