import { CollectionConfig } from 'payload/types'

const Vets: CollectionConfig = {
  slug: 'vets',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name","specie","breed","sex","birthday","human"]
  },
  fields: [
    {
      name: 'name', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'phone', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'email', // required
      type: 'email', // required
      required: true,
    },
    {
      name: 'address', // required
      type: 'text', // required
    },
    {
      name: 'url', // required
      type: 'text', // required
    },
    {
      name: 'comment', // required
      type: 'textarea', // required
    },
    {
      name: 'vetImage', // required
      type: 'upload', // required
      relationTo: 'media', // required
    },
  ],
}
export default Vets
