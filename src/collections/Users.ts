import { CollectionConfig } from 'payload/types';
import { associateHuman, communityUpdate, filterUsers, getUsers } from '../utils';


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
    {
      name: 'email', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'username', // required
      type: 'text', // required
      required: true,
      unique: true
    },
    {
      name: 'human', // required
      type: 'relationship', // required
      relationTo: 'humans', // required
      hasMany: false,
    },
    {
      name: 'communities', // required
      type: 'relationship', // required
      relationTo: 'communities', // required
      hasMany: true,
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
  endpoints: [
    {
      path: '/:userId/associate',
      method: 'post',
      handler: async (req, res, next) => {
        const associatedUser = await associateHuman(req.params.userId); //Si es nulo no se ha podido asociar
        res.status( 200 ).send(associatedUser)
      },
    },
    {
      path: '/:username/users-by-name',
      method: 'get',
      handler: async (req, res, next) => {
        const user = await getUsers(req.params.username); 
        res.status( 200 ).send(user)
      },
    },
    {
      path: '/filter-me',
      method: "put",
      handler: async (req, res, next) => {
        const users = await filterUsers(req.body);
        res.status( 200 ).send(users);
      },
    },
    
    {
      path: '/:userId/community-update',
      method: "put",
      handler: async (req, res, next) => {
        const users = await communityUpdate(req.params.userId, req.body);
        res.status( 200 ).send(users);
      },
    },
  ],
}
export default Users
