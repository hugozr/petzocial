import { CollectionConfig } from 'payload/types'
import { filterHumans, getHumansByEmail, humanAssignedToPet } from '../../utils';

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
        const humans = await filterHumans(req.body); 
        res.status( 200 ).send(humans);
      },
    },
    {
      path: "/:email/by-email",
      method: "get",
      handler: async (req, res, next) => {
        const humans = await getHumansByEmail(req.params.email); 
        res.status( 200 ).send(humans);
      },
    },
    {
      path: "/:id/assigned-to/:petId",
      method: "post",
      handler: async (req, res, next) => {
        const humans = await humanAssignedToPet(req.params.id, req.params.petId ); 
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
      defaultValue: "male",
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
      name: 'humanImage', // required
      type: 'upload', // required
      relationTo: 'media', // required
    },
    {
      name: 'pets', // required
      type: 'relationship', // required
      relationTo: 'pets', // required
      hasMany: true,
    },
  ],
}
export default Humans
