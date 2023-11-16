import { CollectionConfig } from 'payload/types'

const Pets: CollectionConfig = {
  slug: 'pets',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name","specie","breed","sex","birthday"]
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
      name: 'specie', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'breed', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'sex', // required
      type: 'text', // required
    },
    {
      name: 'birthday', // required
      type: 'date', // required
    },

  ],
}

export default Pets
