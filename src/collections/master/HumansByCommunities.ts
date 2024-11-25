import { CollectionConfig } from 'payload/types'
import { delCommunityByPet, delCommunityByUsername, delHumanByCommunity, filterCommunities, getCommunitiesByUsername, getHumans, getMembers, petUpdate, retrieveCommunitiesByUsername } from '../../utils';

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
        // const deleted = await delCommunityByPet(req.body); //Si es nulo no se ha podido asociar
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
  ],
}

export default HumansByCcommunities
