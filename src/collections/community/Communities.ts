import { CollectionConfig } from 'payload/types'

const Communities: CollectionConfig = {
  slug: 'communities',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name","address","comment"]
  },
  fields: [
    {
      name: 'name', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'address', // required
      type: 'text', // required
    },
    {
      name: 'comment', // required
      type: 'textarea', // required
    },
    {
      name: 'url', // required
      type: 'text', // required
    },
    {
      name: 'coordinates', // required
      type: 'group', // required
      interfaceName: 'Coordinates', // optional
      fields: [
        // required
        {
          name: 'x',
          type: 'text',
          required: false,
          minLength: 3,
          maxLength: 20,
        },
        {
          name: 'y',
          type: 'text',
          required: false,
          minLength: 3,
          maxLength: 20,
        },
      ],
    },
    {
      name: 'communityImage', // required
      type: 'upload', // required
      relationTo: 'media', // required
    },
    {
      name: 'type', // required
      type: 'relationship', // required
      relationTo: 'community-types', // required
      hasMany: false,
    }
  ],
}

export default Communities
