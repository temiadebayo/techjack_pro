import type { SchemaTypeDefinition } from "sanity";
import { announcementType } from "./announcement";
import { artistProfileType } from "./artistProfile";
import { chapterType } from "./chapter";
import { fragmentType } from "./fragment";
import { productType } from "./product";
import { releaseType } from "./release";
import { siteSettingsType } from "./siteSettings";
import { visualWorkType } from "./visualWork";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettingsType,
  artistProfileType,
  releaseType,
  visualWorkType,
  fragmentType,
  chapterType,
  productType,
  announcementType,
];
