import { CollectionConfig } from 'payload/types'
import { filterCommunities } from '../../utils';

const Communities: CollectionConfig = {
  slug: 'communities',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name","address","comment"]
  },
  endpoints: [
    {
      path: "/filter-me",
      method: "put",
      handler: async (req, res, next) => {
        const pets = await filterCommunities(req.body);
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
      name: 'address', // required
      type: 'text', // required
    },
    {
      name: 'comment', // required
      type: 'textarea', // required
    },
    {
      name: 'url', // required
      type: 'text', // required
    },
    {
      name: 'coordinates', // required
      type: 'group', // required
      interfaceName: 'Coordinates', // optional
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
      name: 'communityImage', // required
      type: 'upload', // required
      relationTo: 'media', // required
    },
    {
      name: 'modality', // required
      type: 'select', // required
      hasMany: false,
      defaultValue: 'public',
      options: [
        {
          label: 'Public',
          value: 'public',
        },
        {
          label: 'Private',
          value: 'private',
        },
      ],
    },
    {
      name: 'type', // required
      type: 'relationship', // required
      relationTo: 'community-types', // required
      hasMany: false,
    },
  ],
}

export default Communities
