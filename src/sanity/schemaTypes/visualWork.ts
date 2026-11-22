import { defineField, defineType } from "sanity";
import {
  creditArrayField,
  makeMediaImageField,
  publicationStatusField,
} from "./fields";

export const visualWorkType = defineType({
  name: "visualWork",
  title: "Visual Work",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      initialValue: "music-videos",
      options: {
        list: [
          { title: "Music Videos", value: "music-videos" },
          { title: "Visualizers", value: "visualizers" },
          { title: "Short Films", value: "short-films" },
          { title: "Experiments", value: "experiments" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categoryLabel",
      title: "Display Category Label",
      type: "string",
      initialValue: "MUSIC VIDEOS",
      validation: (rule) => rule.required(),
    }),
    makeMediaImageField("poster", "Poster Frame (16:9)", true),
    defineField({
      name: "embedProvider",
      title: "Video Provider",
      type: "string",
      options: {
        list: [
          { title: "YouTube (privacy-enhanced embed)", value: "youtube" },
          { title: "Vimeo (DNT embed)", value: "vimeo" },
          { title: "Direct Video URL (MP4 / WebM)", value: "direct" },
        ],
      },
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
    }),
    defineField({
      name: "caption",
      title: "Captions Track URL (.vtt, optional)",
      type: "url",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    creditArrayField,
    defineField({
      name: "relatedRelease",
      title: "Associated Release (Optional)",
      type: "reference",
      to: [{ type: "release" }],
    }),
    defineField({
      name: "duration",
      title: "ISO 8601 Duration (Optional, e.g. PT3M14S)",
      type: "string",
    }),
    defineField({
      name: "publishedDate",
      title: "Confirmed Publish Date (Optional)",
      type: "date",
    }),
    defineField({
      name: "featured",
      title: "Feature in IN FOCUS slot",
      type: "boolean",
      initialValue: false,
    }),
    publicationStatusField,
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "categoryLabel",
      media: "poster",
      status: "status",
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title: title || "Untitled Visual",
        subtitle: `[${(status || "draft").toUpperCase()}] ${subtitle || ""}`,
        media,
      };
    },
  },
});
