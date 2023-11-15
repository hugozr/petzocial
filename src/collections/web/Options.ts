import { CollectionConfig } from 'payload/types'

const Options: CollectionConfig = {
  slug: 'options',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'order', // required
      type: 'number', // required
      required: true,
    },
    {
      name: 'redirect', // required
      type: 'text', // required
      required: true,
    },
  ],
}

export default Options
