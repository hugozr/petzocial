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
      name: 'name', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'rqUserLoggedIn', // required
      type: 'checkbox', // required
      required: true,
      defaultValue: false,
      label: "It requires the user to be logged in"
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
