import { CollectionConfig } from 'payload/types'
import { filterVets } from '../../utils';

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
    defaultColumns: ["name","phone", "address","email", "url"]
  },
  endpoints: [
    {
      path: "/filter-me",
      method: "put",
      handler: async (req, res, next) => {
        const pets = await filterVets(req.body);
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
      name: 'vetImage', // required
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
      name: 'healthServices', // required
      type: 'array', // required
      label: 'HealthServices',
      labels: {
        singular: 'HealthService',
        plural: 'HealthServices',
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
          name: 'healthService', // required
          type: 'relationship', // required
          relationTo: 'health-services', // required
          hasMany: false,
        },
        
      ],
    },
    {
      name: 'vetType', // required
      type: 'relationship', // required
      relationTo: 'vet-types', // required
      hasMany: false,
    }
  ],
}
export default Vets
