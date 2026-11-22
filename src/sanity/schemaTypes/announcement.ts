import { defineField, defineType } from "sanity";
import { publicationStatusField } from "./fields";

export const announcementType = defineType({
  name: "announcement",
  title: "Announcement / Dispatch",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Message",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date (Optional)",
      type: "date",
    }),
    defineField({
      name: "ctaLabel",
      title: "Button Label (Optional)",
      type: "string",
    }),
    defineField({
      name: "externalUrl",
      title: "Destination URL (Optional)",
      type: "url",
    }),
    publicationStatusField,
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "date",
      status: "status",
    },
    prepare({ title, subtitle, status }) {
      return {
        title: title || "Untitled Announcement",
        subtitle: `[${(status || "draft").toUpperCase()}] ${subtitle || ""}`,
      };
    },
  },
});
