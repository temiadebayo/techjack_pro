import { defineField, defineType } from "sanity";
import { makeMediaImageField } from "./fields";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "brandMark",
      title: "Brand Mark",
      type: "string",
      initialValue: "TECH JACK®",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "chapterMarker",
      title: "Chapter Marker",
      type: "string",
      initialValue: "7926",
      description: "Visual era marker (do not expand or decode).",
      validation: (rule) => rule.required(),
    }),
    makeMediaImageField("logo", "Official Logo"),
    defineField({
      name: "featuredRelease",
      title: "Featured Homepage Release",
      type: "reference",
      to: [{ type: "release" }],
      description: "Shown in the homepage Latest Transmission section.",
    }),
    defineField({
      name: "footerStatement",
      title: "Footer Statement",
      type: "string",
      initialValue: "AN ONGOING DOCUMENTATION.",
    }),
    defineField({
      name: "showLabelCredit",
      title: "Show Label Credit in Footer & Credits",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "labelCredit",
      title: "Label Credit Line",
      type: "string",
      initialValue: "AN ARTIST PROJECT UNDER MOVO STUDIOS",
    }),
    defineField({
      name: "streamingDestinations",
      title: "Verified Streaming Destinations",
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
              title: "Platform Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Official URL",
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
      name: "socialDestinations",
      title: "Verified Social Destinations",
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
              title: "Platform Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Official URL",
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
      name: "contactChannels",
      title: "Verified Contact Emails",
      type: "array",
      description: "Leave blank until official email addresses are active.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Channel Key",
              type: "string",
              options: {
                list: [
                  { title: "Bookings", value: "bookings" },
                  { title: "Press & Media", value: "press" },
                  { title: "Management", value: "management" },
                  { title: "Collaborations", value: "collaborations" },
                  { title: "Other", value: "other" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Display Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "email",
              title: "Verified Email Address",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "email" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Global Tech Jack® / 7926 configuration",
      };
    },
  },
});
