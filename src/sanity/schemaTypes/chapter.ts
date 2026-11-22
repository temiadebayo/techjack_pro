import { defineField, defineType } from "sanity";
import { makeMediaImageField, publicationStatusField } from "./fields";

export const chapterType = defineType({
  name: "chapter",
  title: "Chapter",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Chapter Key",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "periodLabel",
      title: "Period / Era Label",
      type: "string",
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 4,
    }),
    makeMediaImageField("coverMedia", "Cover Media"),
    defineField({
      name: "relatedReleases",
      title: "Related Releases",
      type: "array",
      of: [{ type: "reference", to: [{ type: "release" }] }],
    }),
    defineField({
      name: "relatedFragments",
      title: "Related Fragments",
      type: "array",
      of: [{ type: "reference", to: [{ type: "fragment" }] }],
    }),
    publicationStatusField,
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "periodLabel",
      media: "coverMedia",
      status: "status",
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title: title || "Untitled Chapter",
        subtitle: `[${(status || "draft").toUpperCase()}] ${subtitle || ""}`,
        media,
      };
    },
  },
});
