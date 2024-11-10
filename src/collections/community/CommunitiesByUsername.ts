import { CollectionConfig } from 'payload/types'
import { delCommunityByUsername, filterCommunities, getCommunitiesByUsername, petUpdate, retrieveCommunitiesByUsername } from '../../utils';

const CommunitiesByUsername: CollectionConfig = {
  slug: 'communities-by-username',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'username',
    defaultColumns: ["username"]
  },
  endpoints: [
    {
      path: '/:username/retrieve-communities',
      method: 'get',
      handler: async (req, res, next) => {
        console.log(req.params.username, "traer los id de comunidades en un arreglo");
        const communities = await getCommunitiesByUsername(req.params.username); //Si es nulo no se ha podido asociar
        res.status( 200 ).send(communities);
      },
    },
    {
      path: '/delete',
      method: 'post',
      handler: async (req, res, next) => {
        const deleted = await delCommunityByUsername(req.body); //Si es nulo no se ha podido asociar
        res.status( 200 ).send(deleted);
      },
    },
  ],
  fields: [
    {
      name: 'community', 
      type: 'relationship', 
      relationTo: 'communities', 
    },
    {
      name: 'username', 
      type: 'text'
    },
  ],
}

export default CommunitiesByUsername
