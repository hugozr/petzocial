import { CollectionConfig } from 'payload/types'
import { filterHumans } from '../../utils';

const Humans: CollectionConfig = {
  slug: 'humans',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["nickName","name","address","sex","comment","birthday"]
  },
  endpoints: [
    {
      path: "/filter-me",
      method: "put",
      handler: async (req, res, next) => {
        console.log(req.body);
        const humans = await filterHumans(req.body); 
        res.status( 200 ).send(humans);
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
      name: 'nickName', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'comment', // required
      type: 'textarea', // required
    },
    {
      name: 'address', // required
      type: 'text', // required
    },
    {
      name: 'email', // required
      type: 'text', // required
    },
    {
      name: 'phone', // required
      type: 'text', // required
    },
    {
      name: 'socialUrl', // required
      type: 'text', // required
    },
    {
      name: 'sex', // required
      type: 'select', // required
      hasMany: false,
      admin: {
        isClearable: true,
      },
      options: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
        {
          label: 'Prefer not to say',
          value: 'nottosay',
        },
      ],
    },
    {
      name: 'birthday', // required
      type: 'date', // required
    },
    {
      name: 'humanImage', // required
      type: 'upload', // required
      relationTo: 'media', // required
    },
  ],
}
export default Humans
