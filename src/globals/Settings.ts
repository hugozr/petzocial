import { GlobalConfig } from 'payload/types'

const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'roles',
      type: 'json',
    },
    {
      name: 'mailMassiveLoad',
      type: 'textarea',
    },
    {
      name: 'mailMassiveLoadSubject',
      type: 'text',
    },
  ],
}
export default Settings
