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
export default HealthServices
