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
      name: 'name', 
      type: 'text', 
      required: true,
    },
    {
      name: 'phone', 
      type: 'text', 
      required: true,
    },
    {
      name: 'email', 
      type: 'email', 
      required: true,
    },
    {
      name: 'address', 
      type: 'text', 
    },
    {
      name: 'url', 
      type: 'text', 
    },
    {
      name: 'comment', 
      type: 'textarea', 
    },
    {
      name: 'petshopImage', 
      type: 'upload', 
      relationTo: 'media', 
    },
    {
      name: 'coordinates', 
      type: 'group', 
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
      name: 'careServices', 
      type: 'array', 
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
          name: 'careService', 
          type: 'relationship', 
          relationTo: 'care-services', 
          hasMany: false,
        },
      ],
    },
    {
      name: 'petshopType', 
      type: 'relationship', 
      relationTo: 'petshop-types', 
      hasMany: false,
    }
  ],
}
export default Petshops
