import { CollectionConfig } from 'payload/types'

const Places: CollectionConfig = {
  slug: 'places',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'placeId',
    defaultColumns: ["placeId", "displayName"]
  },
  fields: [
    {
      name: 'placeId', 
      type: 'number', 
      required: true,
    },
    {
      name: 'displayName', 
      type: 'text', 
      required: true,
    },
    {
      name: 'data', 
      type: 'json', 
      required: true,
    },
  ],
}

export default Places
