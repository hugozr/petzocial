import { CollectionConfig } from 'payload/types'

const CommunityTypes: CollectionConfig = {
  slug: 'community-types',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name","comment"]
  },
  fields: [
    {
      name: 'name', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'comment', // required
      type: 'textarea', // required
    },
    {
      name: 'disable', // required
      type: 'checkbox', // required
      defaultValue: false,
    },
  ],
}

export default CommunityTypes
