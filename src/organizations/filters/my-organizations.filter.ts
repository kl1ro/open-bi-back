import { UseFilters } from "@nestjs/common";

import { NotSignedInFilter } from "../../auth/filters/not-signed-in.filter.js";

export function UseMyOrganizationsFilter() {
  return UseFilters(NotSignedInFilter);
}
