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
    defaultColumns: ["name","order","redirect", "rqlogIn"]
  },
  fields: [
    {
      name: 'name', 
      type: 'text', 
      required: true,
    },
    {
      name: 'rqUserLoggedIn', 
      type: 'checkbox', 
      required: true,
      defaultValue: false,
      label: "It requires the user to be logged in"
    },
    {
      name: 'order', 
      type: 'number', 
      required: true,
    },
    {
      name: 'redirect', 
      type: 'text', 
      required: true,
    },
  ],
}

export default Options
