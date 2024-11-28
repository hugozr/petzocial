import { CollectionConfig } from 'payload/types'
import { delCommunityByPet, getMembers, petIsCommunityMember, petToCommunity } from '../../utils';

const CommunitiesByPets: CollectionConfig = {
  slug: 'communities-by-pets',
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
    
    {
      path: '/:communityId/:petId/is-member',
      method: 'get',
      handler: async (req, res, next) => {
        const isMember = await petIsCommunityMember(req.params.communityId, req.params.petId); 
        console.log(isMember, "lalalala")
        res.status( 200 ).send(isMember);
      },
    },
    {
      path: '/insert-member',
      method: "post",
      handler: async (req, res, next) => {
        const member = await petToCommunity(req.body);
        res.status( 200 ).send(member);
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
      name: 'pet', 
      type: 'relationship', 
      relationTo: 'pets', 
    },
  ],
}

export default CommunitiesByPets
