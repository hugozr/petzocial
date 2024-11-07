import { CollectionConfig } from 'payload/types'
import { generatePrefixFileName } from '../utils';

export const ExcelFile: CollectionConfig = {
  slug: 'excels',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  upload: {
    staticURL: '/files/excel-files',
    staticDir: 'files/excel-files',
    mimeTypes: ['application/*'],
  },
  hooks: {
    beforeOperation: [async ({ args }) => {
      const files = args.req?.files;
      const username = args.req.body.username;
      const collection =  args.req.body.collection;
      if (files?.file?.name) {
        const parts = files.file.name.split('.');
        const prefix = generatePrefixFileName(collection, username);
        files.file.name = `${prefix}-${files.file.name}`;
      }
    }]
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