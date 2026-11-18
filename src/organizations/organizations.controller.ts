import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";

import { SignedInGuard } from "../auth/guards/signed-in.guard.js";
import { CreateOrganizationFilter } from "./filters/create-organization.filter.js";
import { DeleteOrganizationFilter } from "./filters/delete-organization.filter.js";
import { MyOrganizationsFilter } from "./filters/my-organizations.filter.js";
import { OrganizationMembersFilter } from "./filters/organization-members.filter.js";
import { UpdateOrganizationFilter } from "./filters/update-organization.filter.js";
import { convertMembershipToView, type MembershipView } from "./membership.js";
import type Organization from "./organization.js";
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

  @Patch(":id")
  @UseGuards(SignedInGuard)
  @UseFilters(UpdateOrganizationFilter)
  public async update(
    @Param("id", ParseUUIDPipe) id: Organization["id"],
    @Body() details: OrganizationDetailsDto,
    @Req() request: Request,
  ): Promise<OrganizationView> {
    const organization = await this.organizationsService.update(
      id,
      details,
      request.session,
    );

    return convertOrganizationToView(organization);
  }

  @Delete(":id")
  @UseGuards(SignedInGuard)
  @UseFilters(DeleteOrganizationFilter)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param("id", ParseUUIDPipe) id: Organization["id"],
    @Req() request: Request,
  ) {
    await this.organizationsService.delete(id, request.session);
  }

  @Get(":id/members")
  @UseGuards(SignedInGuard)
  @UseFilters(OrganizationMembersFilter)
  public async getMembers(
    @Param("id", ParseUUIDPipe) id: Organization["id"],
    @Req() request: Request,
  ): Promise<MembershipView[]> {
    const memberships = await this.organizationsService.getMembers(id, request.session);
    const membershipViews = memberships.map(convertMembershipToView);
    return membershipViews;
  }
}
