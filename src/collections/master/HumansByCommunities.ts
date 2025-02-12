import { CollectionConfig } from 'payload/types'
import { delCommunityByPet, delCommunityByUsername, delHumanByCommunity, existsCommunitiesByEmail, filterCommunities, getCommunitiesByEmail, getCommunitiesByUsername, getHumans, getMembers, humanToCommunity, petUpdate, retrieveCommunitiesByUsername, retrieveHumansByCommunities } from '../../utils';

const HumansByCcommunities: CollectionConfig = {
  slug: 'humans-by-communities',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'community',
    defaultColumns: ["community"]
  },
  endpoints: [
    {
      path: '/delete',
      method: 'post',
      handler: async (req, res, next) => {
        const deleted = await delHumanByCommunity(req.body); //Si es nulo no se ha podido asociar
        res.status(200).send(deleted);
      },
    },
    {
      path: '/:communityId/retrieve-humans',
      method: 'put',
      handler: async (req, res, next) => {
        const members = await getHumans(req.params.communityId, req.body); //Si es nulo no se ha podido asociar
        res.status(200).send(members);
      },
    },
    {
      path: '/insert-human',
      method: "post",
      handler: async (req, res, next) => {
        const member = await humanToCommunity(req.body);
        res.status( 200 ).send(member);
      },
    },
    {
      path: '/:email/retrieve-communities',
      method: 'get',
      handler: async (req, res, next) => {
        const communities = await getCommunitiesByEmail(req.params.email); 
        res.status(200).send(communities);
      },
    },
    {
      path: '/:email/:communityId/exists',
      method: 'get',
      handler: async (req, res, next) => {
        const exists = await existsCommunitiesByEmail(req.params.email,req.params.communityId); 
        res.status(200).send(exists);
      },
    },
    {
      path: '/humans-from-communities',
      method: 'post',
      handler: async (req, res, next) => {
        console.log("precio")
        const humans = await retrieveHumansByCommunities(req.body); 
        res.status(200).send(humans);
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
      name: 'human',
      type: 'relationship',
      relationTo: 'humans',
    },
    {
      name: 'position', 
      type: 'group', 
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}

export default HumansByCcommunities
