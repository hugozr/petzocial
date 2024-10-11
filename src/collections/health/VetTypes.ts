import { CollectionConfig } from 'payload/types'

const VetTypes: CollectionConfig = {
  slug: 'vet-types',
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
      name: 'displayedOnMobileDevices', 
      type: 'checkbox', 
    },
    
  ],
}

export default VetTypes
