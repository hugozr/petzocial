import { CollectionConfig } from 'payload/types'
import { filterVets, genericDownloadExcel } from '../../utils';
import { createPlace } from '../../geoUtils';
import { text } from 'express';

const Vets: CollectionConfig = {
  slug: 'vets',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name","phone", "address","email", "url"]
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, previousDoc }) => {
        if (operation === 'create') {
          const place = await createPlace(doc);
          console.log(place);
        }
        // if (operation === 'update') {
        //   console.log('Un documento fue modificado:', doc);
        //   const place = await createPlace(doc);
        //   console.log(place);
        // }
        console.log('Documento anterior:', previousDoc);
      }
    ],
  },
  endpoints: [
    {
      path: "/filter-me",
      method: "put",
      handler: async (req, res, next) => {
        const pets = await filterVets(req.body);
        res.status( 200 ).send(pets);
      },
    },
    {
      path: '/download-in-excel',
      method: 'get',
      handler: async (req, res, next) => {
        const dataExcel = await genericDownloadExcel("vets", "vets"); 
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
      name: 'phone', 
      type: 'text', 
      required: true,
    },
    {
      name: 'email', 
      type: 'email', 
      required: true,
    },
    {
      name: 'address', 
      type: 'text', 
    },
    {
      name: 'url', 
      type: 'text', 
    },
    {
      name: 'comment', 
      type: 'textarea', 
    },
    {
      name: 'vetImage', 
      type: 'upload', 
      relationTo: 'media', 
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
      name: 'healthServices', 
      type: 'array', 
      label: 'HealthServices',
      labels: {
        singular: 'HealthService',
        plural: 'HealthServices',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'order',
          type: 'number',
        },
        {
          name: 'healthService', 
          type: 'relationship', 
          relationTo: 'health-services', 
          hasMany: false,
        },
        
      ],
    },
    {
      name: 'openingHours',
      type: 'text'
    },
    {
      name: 'vetType', 
      type: 'relationship', 
      relationTo: 'vet-types', 
      hasMany: false,
    },
    {
      name: 'kcUserName', 
      type: 'text', 
    },
    {
      name: 'place', 
      type: 'relationship', 
      relationTo: 'places', 
      hasMany: false,
    },
  ],
  
}
export default Vets
