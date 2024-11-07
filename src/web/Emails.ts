import { CollectionConfig } from 'payload/types'
import payload from 'payload'
import { getSettings, sendMassiveLoadEmail } from '../mailUtils';

// import { sendMail } from '../mailUtils';
// const nodemailer = require('nodemailer')


const Emails: CollectionConfig = {
  slug: 'emails',
  auth: false,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'from',
    defaultColumns: ["from", "to", "subject"]
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          await payload.sendEmail({
            from: doc.from,
            to: doc.to,
            subject: doc.subject,
            html: doc.body,
          });
        }
      }
    ],
  },
  endpoints: [
    {
      path: '/notify-massive-load',
      method: 'post',
      handler: async (req, res) => {
        const {to, subject, body, validPath, notValidPath } = req.body;
        const settings: any = await getSettings();
        console.log(settings)
        const send = await sendMassiveLoadEmail(to, subject, settings.mailMassiveLoad);
        return  res.status( 200 ).send({ message: 'Correo enviado', send });;
      },
    },
  ],
  fields: [
    {
      name: 'from', 
      type: 'text', 
      required: true,
    },
    {
      name: 'to', 
      type: 'text', 
      required: true,
    },
    {
      name: 'subject', 
      type: 'text', 
    },
    {
      name: 'body', 
      type: 'textarea', 
    }
  ],
}

export default Emails



