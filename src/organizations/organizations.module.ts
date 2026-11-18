import { Module } from "@nestjs/common";

import { MikroOrmOrganizationRepository } from "./mikro-orm/organization.repository.js";
import { OrganizationRepository } from "./organization.repository.js";
import { OrganizationsController } from "./organizations.controller.js";
import { OrganizationsService } from "./organizations.service.js";

@Module({
  controllers: [OrganizationsController],

  providers: [
    { provide: OrganizationRepository, useClass: MikroOrmOrganizationRepository },
    OrganizationsService,
  ],
})
export class OrganizationsModule {}
