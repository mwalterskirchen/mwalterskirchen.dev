import { CollectionConfig } from "payload/types";

const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    {
      name: "content",
      label: "Content",
      type: "richText",
      required: true,
    },
    {
      name: "publishedAt",
      label: "Published At",
      type: "date",
      required: true,
    },
    {
      name: "featuredImage",
      label: "Featured Image",
      type: "upload",
      required: true,
      relationTo: "media",
    },
    {
      name: "category",
      label: "Category",
      type: "relationship",
      relationTo: "categories",
    },
  ],
};

export default Posts;
