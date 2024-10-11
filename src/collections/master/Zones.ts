import { CollectionConfig } from 'payload/types'

const Zones: CollectionConfig = {
  slug: 'zones',
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
  ],
}

export default Zones
