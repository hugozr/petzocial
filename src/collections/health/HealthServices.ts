import { CollectionConfig } from 'payload/types'

const HealthServices: CollectionConfig = {
  slug: 'health-services',
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
      name: 'order', // required
      type: 'number', // required
    },
   
  ],
}
export default HealthServices
