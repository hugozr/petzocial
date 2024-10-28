import payload from 'payload';
import { CollectionConfig } from 'payload/types'
import { filterPets, filterPetsByHumanId, filterPetsByZone, petLike } from '../../utils';
import { genericDownloadExcel } from '../../excelUtils';

const Pets: CollectionConfig = {
  slug: 'pets',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name","specie","breed","gender","birthday","human"]
  },
  endpoints: [
    {
      path: "/filter-me",
      method: "put",
      handler: async (req, res, next) => {
        const pets = await filterPets(req.body);
        res.status( 200 ).send(pets);
      },
    },
    {
      path: "/filter-me-by-zone",
      method: "put",
      handler: async (req, res, next) => {
        const pets = await filterPetsByZone(req.body);
        res.status( 200 ).send(pets);
      },
    },
    {
      path: "/by-human-id",
      method: "put",
      handler: async (req, res, next) => {
        const pets = await filterPetsByHumanId(req.body);
        res.status( 200 ).send(pets);
      },
    },
    {
      path: '/download-in-excel',
      method: 'get',
      handler: async (req, res, next) => {
        const dataExcel = await genericDownloadExcel("pets", "pets"); 
        res.set('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status( 200 ).send(dataExcel);
      },
    },
    {
      path: '/like',
      method: 'post',
      handler: async (req, res, next) => {
        const pets = await petLike(req.body);
        res.status( 200 ).send(pets);
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
      name: 'comment', 
      type: 'textarea', 
    },
    {
      name: 'zone', 
      type: 'relationship', 
      relationTo: 'zones', 
      hasMany: false,
    },
    {
      name: 'address', 
      type: 'text', 
    },
    {
      name: 'gender', 
      type: 'text', 
    },
    {
      name: 'birthday', 
      type: 'date', 
    },
    {
      name: 'specie', 
      type: 'group', 
      interfaceName: 'Specie', 
      fields: [
        
        {
          name: 'specieId',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'breed', 
      type: 'group', 
      interfaceName: 'Breed', 
      fields: [
        {
          name: 'breedId',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'petImage',
      type: 'upload', 
      relationTo: 'media',
    },
    {
      name: 'human', 
      type: 'group', 
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'humanId',
          type: 'text',
        },
        {
          name: 'email',
          type: 'text',
        },
      ],
    },
  ],
}

export default Pets