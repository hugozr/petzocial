import { GlobalConfig } from 'payload/types'

const Welcome: GlobalConfig = {
  slug: 'welcome',
  access: {
    read: () => true,
  },
  fields: [
    {
      // HZUMAETA: Uso este html como editor https://onlinehtmleditor.dev/
      name: 'html',
      type: 'textarea',
      required: true,
    },
  ],
}
export default Welcome
