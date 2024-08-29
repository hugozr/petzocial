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
  ],
}
export default Settings
