import { defineField, defineType } from "sanity";
import {
  creditArrayField,
  makeMediaImageField,
  publicationStatusField,
} from "./fields";

export const releaseType = defineType({
  name: "release",
  title: "Release",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Stylized Display Title",
      type: "string",
      description: "Example: MUZZ N BUZZ.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "displayTitle",
      title: "Plain Title (SEO & Structured Data)",
      type: "string",
      description: "Example: Muzz N Buzz",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "displayTitle", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "primaryArtist",
      title: "Primary Artist",
      type: "string",
      initialValue: "Tech Jack",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredArtists",
      title: "Featured Artists",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "artistCredit",
      title: "Formatted Credit Line",
      type: "string",
      description: "Example: TECH JACK FEAT. BLACKMASKED",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Archive Filter Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Singles", value: "singles" },
          { title: "Projects", value: "projects" },
          { title: "Collaborations", value: "collaborations" },
        ],
      },
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "releaseTypeLabel",
      title: "Release Type Badge",
      type: "string",
      description: "Example: SINGLE / COLLABORATION",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "releaseStatus",
      title: "Release Status",
      type: "string",
      initialValue: "OUT NOW",
      options: {
        list: [
          { title: "OUT NOW", value: "OUT NOW" },
          { title: "UPCOMING", value: "UPCOMING" },
          { title: "ARCHIVED", value: "ARCHIVED" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "releaseDate",
      title: "Confirmed Release Date (Optional)",
      type: "date",
      description: "Leave empty unless the official release date is confirmed.",
    }),
    defineField({
      name: "year",
      title: "Release Year (Optional)",
      type: "number",
    }),
    defineField({
      name: "shortCopy",
      title: "Homepage Transmission Short Copy",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Release Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    makeMediaImageField("coverArt", "Official Cover Artwork (1:1)"),
    creditArrayField,
    defineField({
      name: "lyrics",
      title: "Lyrics (Verbatim Source)",
      type: "text",
      rows: 12,
      description:
        "Preserve artist-supplied spelling, spacing, and stylization exactly.",
    }),
    defineField({
      name: "audioFile",
      title: "Audio Preview Upload (Optional)",
      type: "file",
      options: { accept: "audio/*" },
      description: "Never autoplays. Plays only when the visitor clicks Play.",
    }),
    defineField({
      name: "audioUrl",
      title: "External Audio Preview URL (Optional)",
      type: "url",
    }),
    defineField({
      name: "streamingLinks",
      title: "Verified Streaming Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Platform ID",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "platform",
              title: "Platform Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Verified Track URL",
              type: "url",
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "relatedVisuals",
      title: "Connected Visuals",
      type: "array",
      of: [{ type: "reference", to: [{ type: "visualWork" }] }],
    }),
    defineField({
      name: "relatedFragments",
      title: "Connected Fragments",
      type: "array",
      of: [{ type: "reference", to: [{ type: "fragment" }] }],
    }),
    publicationStatusField,
  ],
  preview: {
    select: {
      title: "displayTitle",
      subtitle: "artistCredit",
      media: "coverArt",
      status: "status",
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title: title || "Untitled Release",
        subtitle: `[${(status || "draft").toUpperCase()}] ${subtitle || ""}`,
        media,
      };
    },
  },
});
