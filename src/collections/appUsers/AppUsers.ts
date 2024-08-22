import { CollectionConfig } from 'payload/types';
import { associateHuman, communityUpdate, filterUsers, genericDownloadExcel, getUsersByEmail, getUsersByName, syncronizeToApUser } from '../../utils';


const AppUsers: CollectionConfig = {
  slug: 'app-users',
  auth: false,
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
      name: 'email', 
      type: 'text', 
      required: true,
    },
    {
      name: 'username', 
      type: 'text', 
      required: true,
      unique: true
    },
    {
      name: 'keycloakUserId', 
      type: 'text', 
    },
    {
      name: 'human', 
      type: 'relationship', 
      relationTo: 'humans', 
      hasMany: false,
    },
    {
      name: 'communities', 
      type: 'relationship', 
      relationTo: 'communities', 
      hasMany: true,
    },
   {
      name: 'roles', 
      type: 'select', 
      hasMany: true,
      admin: {
        isClearable: true,
        isSortable: true, 
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
        const user = await getUsersByName(req.params.username); 
        res.status( 200 ).send(user)
      },
    },
    {
      path: '/:email/users-by-email',
      method: 'get',
      handler: async (req, res, next) => {
        const user = await getUsersByEmail(req.params.email); 
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
    {
      path: '/download-in-excel',
      method: 'get',
      handler: async (req, res, next) => {
        const dataExcel = await genericDownloadExcel("users", "users"); 
        res.set('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status( 200 ).send(dataExcel);
      },
    },
    {
      path: '/sync-to-app-user',
      method: 'post',
      handler: async (req, res, next) => {
        const dataExcel = await syncronizeToApUser(req.body); 
        res.status( 200 ).send(dataExcel);
      },
    },
  ],
}
export default AppUsers
