import { CollectionConfig } from 'payload/types'

export const ExcelFile: CollectionConfig = {
  slug: 'excels',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  upload: {
    staticURL: '/excel-files',
    staticDir: 'excel-files',
    mimeTypes: ['application/*'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'type',
      type: 'text',
    },
    {
      name: 'username',
      type: 'text',
    },
  ],
}