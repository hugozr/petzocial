import { CollectionConfig } from 'payload/types'
import { delCommunityByPet, delCommunityByUsername, filterCommunities, getCommunitiesByUsername, getMembers, petUpdate, retrieveCommunitiesByUsername } from '../../utils';

const HumansByPets: CollectionConfig = {
  slug: 'humans-by-pets',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'pet',
    defaultColumns: ["pet"]
  },
  endpoints: [
    {
      path: '/delete',
      method: 'post',
      handler: async (req, res, next) => {
        const deleted = await delCommunityByPet(req.body); //Si es nulo no se ha podido asociar
        res.status( 200 ).send(deleted);
      },
    },
    {
      path: '/:communityId/retrieve-pets',
      method: 'get',
      handler: async (req, res, next) => {
        const members = await getMembers(req.params.communityId); //Si es nulo no se ha podido asociar
        res.status( 200 ).send(members);
      },
    },
  ],
  fields: [
    {
      name: 'human', 
      type: 'relationship', 
      relationTo: 'humans', 
    },
    {
      name: 'pet', 
      type: 'relationship', 
      relationTo: 'pets', 
    },
  ],
}

export default HumansByPets
