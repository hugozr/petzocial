import { CollectionConfig } from 'payload/types'
import { downloadInExcel } from '../../utils';

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
      name: 'name', // required
      type: 'text', // required
      required: true,
    },
    {
      name: 'comment', // required
      type: 'textarea', // required
    },
    {
      name: 'disable', // required
      type: 'checkbox', // required
      defaultValue: false,
    },
    {
      name: 'modality', // required
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
