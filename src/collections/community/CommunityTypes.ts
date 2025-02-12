import { CollectionConfig } from 'payload/types'
import { downloadInExcel } from '../../excelUtils';

const CommunityTypes: CollectionConfig = {
  slug: 'community-types',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ["name","comment"]
  },
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
      name: 'disable', 
      type: 'checkbox', 
      defaultValue: false,
    },
    {
      name: 'forVets', 
      type: 'checkbox', 
    },
    {
      name: 'modality', 
      type: 'select', 
      hasMany: false,
      defaultValue: 'public',
      required: true,   //HZUMAETA: La modalidad en el tipo de comunidad es importante porque define una linea de negocio
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
      name: 'positions', // required
      type: 'array', // required
      label: 'Positions',
      interfaceName: 'Positions', // optional
      labels: {
        singular: 'Position',
        plural: 'Positions',
      },
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
  endpoints: [
    {
      path: '/download-in-excel',
      method: 'get',
      handler: async (req, res, next) => {
        const dataExcel = await downloadInExcel(); //Si es nulo no se ha podido asociar
        res.set('Content-Disposition', 'attachment; filename=archivo_excel.xlsx');
        res.set('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status( 200 ).send(dataExcel);
      },
    },
  ]
}

export default CommunityTypes
