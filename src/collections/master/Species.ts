import { CollectionConfig } from 'payload/types'

const Species: CollectionConfig = {
  slug: 'species',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name", "order"]
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
      name: 'order', // required
      type: 'number', // required
    },
    {
      name: 'breeds', // required
      type: 'array', // required
      label: 'Breeds',
      interfaceName: 'Breeds', // optional
      labels: {
        singular: 'Breed',
        plural: 'Breeds',
      },
      fields: [
        // required
        {
          name: 'name',
          type: 'text',
        },
        // {
        //   name: 'image',
        //   type: 'upload',
        //   relationTo: 'media',
        //   required: true,
        // },
        {
          name: 'order',
          type: 'number',
        },
      ],
    }
  ],
}

export default Species
