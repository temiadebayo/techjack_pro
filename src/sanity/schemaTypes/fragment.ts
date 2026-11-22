import { defineField, defineType } from "sanity";
import { makeMediaImageField, publicationStatusField } from "./fields";

export const fragmentType = defineType({
  name: "fragment",
  title: "Fragment",
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
      initialValue: "notes",
      options: {
        list: [
          { title: "Photographs", value: "photographs" },
          { title: "Notes", value: "notes" },
          { title: "Studio", value: "studio" },
          { title: "Moments", value: "moments" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categoryLabel",
      title: "Display Category Label",
      type: "string",
      initialValue: "NOTES",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short Excerpt (Card & Meta Description)",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Entry Date (Optional)",
      type: "date",
      description: "Only set when an actual date is supplied.",
    }),
    defineField({
      name: "body",
      title: "Body Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      validation: (rule) => rule.min(1),
    }),
    makeMediaImageField("coverMedia", "Cover Media"),
    defineField({
      name: "gallery",
      title: "Image Sequence / Gallery (Optional)",
      type: "array",
      of: [makeMediaImageField("item", "Gallery Image")],
    }),
    defineField({
      name: "audioUrl",
      title: "Audio Attachment URL (Optional)",
      type: "url",
    }),
    defineField({
      name: "videoUrl",
      title: "Video Attachment URL (Optional)",
      type: "url",
    }),
    defineField({
      name: "relatedRelease",
      title: "Related Release (Optional)",
      type: "reference",
      to: [{ type: "release" }],
    }),
    defineField({
      name: "chapterRef",
      title: "Chapter Marker (e.g. 7926)",
      type: "string",
      initialValue: "7926",
    }),
    defineField({
      name: "layoutVariant",
      title: "Editorial Grid Ratio",
      type: "string",
      initialValue: "editorial",
      options: {
        list: [
          { title: "Tall (4:5)", value: "tall" },
          { title: "Wide (7:5)", value: "wide" },
          { title: "Editorial Square (1:1)", value: "editorial" },
        ],
        layout: "radio",
      },
    }),
    publicationStatusField,
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "categoryLabel",
      media: "coverMedia",
      status: "status",
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title: title || "Untitled Fragment",
        subtitle: `[${(status || "draft").toUpperCase()}] ${subtitle || ""}`,
        media,
      };
    },
  },
});
