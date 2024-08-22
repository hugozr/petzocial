import { CollectionConfig } from 'payload/types';
import { associateHuman, communityUpdate, filterUsers, genericDownloadExcel, getUsersByEmail, getUsersByName } from '../utils';


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
  ]
}
export default Users
