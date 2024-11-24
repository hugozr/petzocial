import { CollectionConfig } from 'payload/types'
import { filterHumans, getHumansByEmail, getPetsBysHumanId, getPetsHumansByEmail, humanAssignedToPet } from '../../utils';
import { genericDownloadExcel } from '../../excelUtils';

const Humans: CollectionConfig = {
  slug: 'humans',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["nickName","name","address","gender","comment","birthday"]
  },
  endpoints: [
    {
      path: "/filter-me",
      method: "put",
      handler: async (req, res, next) => {
        const humans = await filterHumans(req.body); 
        res.status( 200 ).send(humans);
      },
    },
    {
      path: "/:email/pets-by-human-email",
      method: "get",
      handler: async (req, res, next) => {
        const pets = await getPetsHumansByEmail(req.params.email); 
        res.status( 200 ).send(pets);
      },
    },
    {
      path: "/:id/pets-by-human-id",
      method: "get",
      handler: async (req, res, next) => {
        const pets = await getPetsBysHumanId(req.params.id); 
        res.status( 200 ).send(pets);
      },
    },
    {
      path: "/:email/by-email",
      method: "get",
      handler: async (req, res, next) => {
        const humans = await getHumansByEmail(req.params.email); 
        res.status( 200 ).send(humans);
      },
    },
    {
      path: "/:id/assigned-to/:petId",
      method: "post",
      handler: async (req, res, next) => {
        const humans = await humanAssignedToPet(req.params.id, req.params.petId ); 
        res.status( 200 ).send(humans);
      },
    },
    {
      path: '/download-in-excel',
      method: 'get',
      handler: async (req, res, next) => {
        const dataExcel = await genericDownloadExcel("humans", "humans"); 
        res.set('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status( 200 ).send(dataExcel);
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
      name: 'nickName', 
      type: 'text', 
      required: true,
    },
    {
      name: 'comment', 
      type: 'textarea', 
    },
    {
      name: 'address', 
      type: 'text', 
    },
    {
      name: 'email', 
      type: 'text', 
    },
    {
      name: 'phone', 
      type: 'text', 
    },
    {
      name: 'socialUrl', 
      type: 'text', 
    },
    {
      name: 'gender', 
      type: 'select', 
      hasMany: false,
      admin: {
        isClearable: true,
      },
      defaultValue: "male",
      options: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
        {
          label: 'Prefer not to say',
          value: 'nottosay',
        },
      ],
    },
    {
      name: 'birthday', 
      type: 'date', 
    },
    {
      name: 'coordinates', 
      type: 'group', 
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
      name: 'humanImage', 
      type: 'upload', 
      relationTo: 'media', 
    },
    {
      name: 'pets', 
      type: 'relationship', 
      relationTo: 'pets', 
      hasMany: true,
    },
  ],
}
export default Humans
