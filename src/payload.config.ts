import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";

import Users from "./collections/Users";
import Options from "./collections/web/Options";
import Pets from "./collections/master/Pets";
import Humans from "./collections/master/Humans";
import Species from "./collections/master/Species";
import { Media } from "./collections/web/Media";
import Welcome from "./globals/Welcome";
import Communities from "./collections/community/Communities";
import CommunityTypes from "./collections/community/CommunityTypes";
// import HealthServices from "./collections/health/HealthServices";
import VetTypes from "./collections/health/VetTypes";
import Vets from "./collections/health/Vets";
import HealthServices from "./collections/health/HealthServices";
import CareServices from "./collections/care/CareServices";
import Petshops from "./collections/care/Petshops";
import PetshopTypes from "./collections/care/PetshopTypes";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, written in bytes
    },
  },
  collections: [
    Species,
    Pets,
    VetTypes,
    Vets,
    HealthServices,
    PetshopTypes,
    Petshops,
    CareServices,
    Media,
    Humans,
    CommunityTypes,
    Communities,
    Options,
    Users,
  ],
  globals:[
    Welcome
  ],

  cors: "*", //HZUMAETA: Si no lo pongom tendré problemas de cors en el cliente
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});
