import { Body, Controller, Get, Post, Req, UseFilters, UseGuards } from "@nestjs/common";
import type { Request } from "express";

import { SignedInGuard } from "../auth/guards/signed-in.guard.js";
import { CreateOrganizationFilter } from "./filters/create-organization.filter.js";
import { MyOrganizationsFilter } from "./filters/my-organizations.filter.js";
import { convertOrganizationToView, type OrganizationView } from "./organization.js";
import { OrganizationDetailsDto } from "./organization-details.dto.js";
import { OrganizationsService } from "./organizations.service.js";

@Controller("organizations")
export class OrganizationsController {
  public constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @UseGuards(SignedInGuard)
  @UseFilters(CreateOrganizationFilter)
  public async create(
    @Body() details: OrganizationDetailsDto,
    @Req() request: Request,
  ): Promise<OrganizationView> {
    const organization = await this.organizationsService.create(details, request.session);
    return convertOrganizationToView(organization);
  }

  @Get("mine")
  @UseGuards(SignedInGuard)
  @UseFilters(MyOrganizationsFilter)
  public async getMine(@Req() request: Request): Promise<OrganizationView[]> {
    const organizations = await this.organizationsService.getMine(request.session);
    const organizationViews = organizations.map(convertOrganizationToView);
    return organizationViews;
  }
}
