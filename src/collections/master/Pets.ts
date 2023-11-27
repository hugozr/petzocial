import { CollectionConfig } from 'payload/types'

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
    defaultColumns: ["name","specie","breed","sex","birthday","human"]
  },
  fields: [
    {
      name: 'name', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'human', // required
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
      name: 'sex', // required
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
  ],
}

export default Pets
