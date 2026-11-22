import { defineField } from "sanity";

export const publicationStatusField = defineField({
  name: "status",
  title: "Publication Status",
  type: "string",
  initialValue: "draft",
  description:
    "Only 'Published' documents appear on the public website, sitemap, and search results. Keep reserved milestones and internal lore set to 'Restricted'.",
  options: {
    list: [
      { title: "Published (Public)", value: "published" },
      { title: "Draft (Work in Progress)", value: "draft" },
      { title: "Restricted (Internal / Unpublished)", value: "restricted" },
    ],
    layout: "radio",
  },
  validation: (rule) => rule.required(),
});

export function makeMediaImageField(name: string, title: string, required = false) {
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative Text (SEO & Accessibility)",
        type: "string",
        description:
          "Describe what is visible in the photograph without guessing private details.",
        validation: (rule) =>
          required ? rule.required() : rule.max(220),
      }),
      defineField({
        name: "caption",
        title: "Caption (Optional)",
        type: "string",
      }),
    ],
  });
}

export const creditArrayField = defineField({
  name: "credits",
  title: "Verified Credits",
  type: "array",
  description:
    "Add only confirmed credits (producer, mixing, mastering, photography, direction, etc.).",
  of: [
    {
      type: "object",
      fields: [
        defineField({
          name: "role",
          title: "Role",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "name",
          title: "Name",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { title: "role", subtitle: "name" },
      },
    },
  ],
});
