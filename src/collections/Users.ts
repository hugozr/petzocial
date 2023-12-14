import { CollectionConfig } from 'payload/types'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'email', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'username', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'human', // required
      type: 'relationship', // required
      relationTo: 'humans', // required
      hasMany: false,
    },
   {
      name: 'roles', // required
      type: 'select', // required
      hasMany: true,
      admin: {
        isClearable: true,
        isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
      },
      options: [
        {
          label: 'I belong to a pet',
          value: 'ibtap',
        },
        {
          label: 'I care about the health of pets',
          value: 'icahp',
        },
        {
          label: "I take care of pets",
          value: 'itkp',
        },
        {
          label: "I manage a community of pets",
          value: 'imcp',
        }
      ],
    } 
  ],
}

export default Users
