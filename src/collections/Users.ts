import { CollectionConfig } from 'payload/types';
import { associateHuman, communityUpdate, filterUsers, getUsersByEmail, getUsersByName } from '../utils';
import { genericDownloadExcel } from '../excelUtils';
import { getAccessTokens, insertKeycloakUser } from '../securityUtils';


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
  endpoints: [
    {
      path: "/create-user-keycloak",
      method: "post",
      handler: async (req, res, next) => {
        const user = {user: "nikki"};
        const tokens: any = await getAccessTokens();
        const addedUser = await insertKeycloakUser(tokens.access_token, "cori", "cori@a.com", "123");
        console.log(addedUser);
        res.status( 200 ).send(addedUser);
      },
    }
  ],
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
