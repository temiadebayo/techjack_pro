import { defineField, defineType } from "sanity";
import { makeMediaImageField, publicationStatusField } from "./fields";

export const productType = defineType({
  name: "product",
  title: "Uniform Piece (Product)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Piece Title",
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
      name: "collection",
      title: "Collection",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Photography",
      type: "array",
      of: [makeMediaImageField("image", "Product Image", true)],
    }),
    defineField({
      name: "price",
      title: "Price (Numeric)",
      type: "number",
      description: "Only set real confirmed prices.",
    }),
    defineField({
      name: "currency",
      title: "Currency Code (e.g. USD, GBP, EUR)",
      type: "string",
    }),
    defineField({
      name: "variants",
      title: "Sizes / Variants",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Size / Variant",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "inStock",
              title: "In Stock",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: { title: "label", inStock: "inStock" },
            prepare({ title, inStock }) {
              return {
                title,
                subtitle: inStock ? "In stock" : "Out of stock",
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "stockState",
      title: "Availability State",
      type: "string",
      initialValue: "coming_soon",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Coming Soon", value: "coming_soon" },
          { title: "Sold Out", value: "sold_out" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "checkoutUrl",
      title: "Verified Checkout URL (Shopify / Stripe)",
      type: "url",
      description:
        "Purchase button only activates when a verified checkout destination is configured.",
    }),
    publicationStatusField,
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "collection",
      media: "images.0",
      status: "status",
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title: title || "Untitled Piece",
        subtitle: `[${(status || "draft").toUpperCase()}] ${subtitle || ""}`,
        media,
      };
    },
  },
});
