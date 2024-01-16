import payload from 'payload';
import { CollectionConfig } from 'payload/types'
import { filterPets } from '../../utils';

const Pets: CollectionConfig = {
  slug: 'pets',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name","specie","breed","gender","birthday","human"]
  },
  endpoints: [
    {
      path: "/filter-me",
      method: "put",
      handler: async (req, res, next) => {
        const pets = await filterPets(req.body);
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
      name: 'comment', // required
      type: 'textarea', // required
    },
    {
      name: 'address', // required
      type: 'text', // required
    },
    {
      name: 'gender', // required
      type: 'text', // required
    },
    {
      name: 'birthday', // required
      type: 'date', // required
    },
    {
      name: 'specie', // required
      type: 'group', // required
      interfaceName: 'Specie', // optional
      fields: [
        // required
        {
          name: 'specieId',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'breed', // required
      type: 'group', // required
      interfaceName: 'Breed', // optional
      fields: [
        // required
        {
          name: 'breedId',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'petImage', // required
      type: 'upload', // required
      relationTo: 'media', // required
    },
    {
      name: 'human', // required
      type: 'group', // required
      fields: [
        // required
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'humanId',
          type: 'text',
        },
      ],
    },
  ],
}

export default Pets
