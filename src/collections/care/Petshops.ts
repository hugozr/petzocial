import { CollectionConfig } from 'payload/types'
import { filterPetshops } from '../../utils';

const Petshops: CollectionConfig = {
  slug: 'petshops',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name","phone", "address","email", "url"]
  },
  endpoints: [
    {
      path: "/filter-me",
      method: "put",
      handler: async (req, res, next) => {
        const pets = await filterPetshops(req.body);
        res.status( 200 ).send(pets);
      },
    },
  ],
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
      name: 'petshopImage', // required
      type: 'upload', // required
      relationTo: 'media', // required
    },
    {
      name: 'coordinates', // required
      type: 'group', // required
      fields: [
        {
          name: 'x',
          type: 'text',
          required: false,
          minLength: 3,
          maxLength: 20,
        },
        {
          name: 'y',
          type: 'text',
          required: false,
          minLength: 3,
          maxLength: 20,
        },
      ],
    },
    {
      name: 'careServices', // required
      type: 'array', // required
      label: 'CareServices',
      labels: {
        singular: 'CareService',
        plural: 'CareServices',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'order',
          type: 'number',
        },
        {
          name: 'careService', // required
          type: 'relationship', // required
          relationTo: 'care-services', // required
          hasMany: false,
        },
      ],
    },
    {
      name: 'petshopType', // required
      type: 'relationship', // required
      relationTo: 'petshop-types', // required
      hasMany: false,
    }
  ],
}
export default Petshops
