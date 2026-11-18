import { Module } from "@nestjs/common";

import { InvitationRepository } from "./invitation.repository.js";
import { MembershipRepository } from "./membership.repository.js";
import { MikroOrmInvitationRepository } from "./mikro-orm/invitation.repository.js";
import { MikroOrmMembershipRepository } from "./mikro-orm/membership.repository.js";
import { MikroOrmOrganizationRepository } from "./mikro-orm/organization.repository.js";
import { OrganizationRepository } from "./organization.repository.js";
import { OrganizationsController } from "./organizations.controller.js";
import { OrganizationsService } from "./organizations.service.js";

@Module({
  controllers: [OrganizationsController],

  providers: [
    { provide: OrganizationRepository, useClass: MikroOrmOrganizationRepository },
    { provide: MembershipRepository, useClass: MikroOrmMembershipRepository },
    { provide: InvitationRepository, useClass: MikroOrmInvitationRepository },
    OrganizationsService,
  ],
})
export class OrganizationsModule {}
