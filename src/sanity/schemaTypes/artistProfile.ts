import { defineField, defineType } from "sanity";
import { makeMediaImageField, publicationStatusField } from "./fields";

export const artistProfileType = defineType({
  name: "artistProfile",
  title: "The Persona (Artist Profile)",
  type: "document",
  fields: [
    defineField({
      name: "displayName",
      title: "Display Name",
      type: "string",
      initialValue: "Tech Jack",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Page Eyebrow",
      type: "string",
      initialValue: "03 / THE PERSONA",
    }),
    defineField({
      name: "headline",
      title: "Page Headline",
      type: "string",
      initialValue: "RYAN MET TECH JACK.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "openingPassage",
      title: "Opening Passage",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    makeMediaImageField("portraitHero", "Homepage Campaign Portrait (4:5)"),
    makeMediaImageField("portraitEditorial", "Persona Editorial Portrait (7:5)"),
    defineField({
      name: "chapters",
      title: "Persona Chapters",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Anchor ID",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "chapterLabel",
              title: "Chapter Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body Copy",
              type: "text",
              rows: 5,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "surface",
              title: "Surface Tone",
              type: "string",
              initialValue: "obsidian",
              options: {
                list: [
                  { title: "Obsidian (#080808)", value: "obsidian" },
                  { title: "Bone (#F0EEE9)", value: "bone" },
                ],
                layout: "radio",
              },
            }),
          ],
          preview: {
            select: { title: "heading", subtitle: "chapterLabel" },
          },
        },
      ],
    }),
    defineField({
      name: "symbols",
      title: "Approved Symbols",
      type: "array",
      description:
        "Publish only approved symbols. Keep reserved milestones and internal lore unpublished.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Symbol ID",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "note",
              title: "Short Context Note",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "note" },
          },
        },
      ],
    }),
    defineField({
      name: "closingSignOff",
      title: "Closing Sign-off",
      type: "string",
      initialValue: "Fauuwww. 🦅🔥",
    }),
    publicationStatusField,
  ],
  preview: {
    select: { title: "displayName", subtitle: "headline" },
  },
});
