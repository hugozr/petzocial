import { CollectionConfig } from 'payload/types'

const Species: CollectionConfig = {
  slug: 'species',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name", "order"]
  },
  fields: [
    {
      name: 'name', 
      type: 'text', 
      required: true,
    },
    {
      name: 'comment', 
      type: 'textarea', 
    },
    {
      name: 'order', 
      type: 'number', 
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'breeds', 
      type: 'array', 
      label: 'Breeds',
      interfaceName: 'Breeds', // optional
      labels: {
        singular: 'Breed',
        plural: 'Breeds',
      },
      fields: [
        
        {
          name: 'name',
          type: 'text',
        },
        
        {
          name: 'order',
          type: 'number',
        },
      ],
    },
  ],
}

export default Species
