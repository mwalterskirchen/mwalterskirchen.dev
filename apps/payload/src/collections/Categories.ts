import { CollectionConfig } from "payload/types";

const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "Slug",
      label: "Slug",
      type: "text",
      required: true,
    },
  ],
};

export default Categories;
