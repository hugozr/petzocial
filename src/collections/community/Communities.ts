import { CollectionConfig } from 'payload/types'
import { canDeleteCommunity, filterCommunities, linkCommunityToUsername, petUpdate, retrieveCommunitiesByUsername, retrieveCommunitiesByUsernameAndZone } from '../../utils';

const Communities: CollectionConfig = {
  slug: 'communities',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name","address","comment"]
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, previousDoc }) => {
        if (operation === 'create') {
          const userCommunity = await linkCommunityToUsername(doc);
          console.log(userCommunity);
        }
        console.log('Documento anterior:', previousDoc);
      }
    ],
  },
  endpoints: [
    {
      path: "/filter-me",
      method: "put",
      handler: async (req, res, next) => {
        const pets = await filterCommunities(req.body);
        res.status( 200 ).send(pets);
      },
    },
    {
      path: '/:communityId/pet-update',
      method: "put",
      handler: async (req, res, next) => {
        const community = await petUpdate(req.params.communityId, req.body);
        res.status( 200 ).send(community);
      },
    },
    {
      path: '/:communityId/can-delete',
      method: "get",
      handler: async (req, res, next) => {
        const community = await canDeleteCommunity(req.params.communityId);
        res.status( 200 ).send(community);
      },
    },
    {
      path: '/:username/by-username',
      method: "get",
      handler: async (req, res, next) => {
        const communities = await retrieveCommunitiesByUsername(req.params.username);
        res.status( 200 ).send(communities);
      },
    },
    {
      path: '/:username/:zone/by-username-and-zone',
      method: "get",
      handler: async (req, res, next) => {
        const communities = await retrieveCommunitiesByUsernameAndZone(req.params.username, req.params.zone);
        res.status( 200 ).send(communities);
      },
    },
  ],
  fields: [
    {
      name: 'name', 
      type: 'text', 
      required: true,
    },
    {
      name: 'zone', 
      type: 'relationship', 
      relationTo: 'zones', 
    },
    {
      name: 'address',
      type: 'text', 
    },
    {
      name: 'comment', 
      type: 'textarea',
    },
    {
      name: 'url', 
      type: 'text',
    },
    {
      name: 'coordinates', 
      type: 'group', 
      interfaceName: 'Coordinates', // optional
      fields: [
        {
          name: 'x',
          type: 'text',
          required: false,
          minLength: 3,
          maxLength: 20,
        },
        {
          name: 'y',
          type: 'text',
          required: false,
          minLength: 3,
          maxLength: 20,
        },
      ],
    },
    {
      name: 'communityImage', 
      type: 'upload', 
      relationTo: 'media', 
    },
    {
      name: 'modality', 
      type: 'select', 
      hasMany: false,
      defaultValue: 'public',
      options: [
        {
          label: 'Public',
          value: 'public',
        },
        {
          label: 'Private',
          value: 'private',
        },
      ],
    },
    {
      name: 'type', 
      type: 'relationship', 
      relationTo: 'community-types', 
      hasMany: false,
    },
    {
      name: 'petMembers', 
      type: 'relationship', 
      relationTo: 'pets', 
      hasMany: true,
    },
    {
      name: 'kcUserName', 
      type: 'text', 
    },
  ],
}

export default Communities
