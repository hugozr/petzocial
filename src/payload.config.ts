import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";

import Users from "./collections/Users";
import Pets from "./collections/master/Pets";
import Humans from "./collections/master/Humans";
import Species from "./collections/master/Species";
import Welcome from "./globals/Welcome";
import Communities from "./collections/community/Communities";
import CommunityTypes from "./collections/community/CommunityTypes";
import VetTypes from "./collections/health/VetTypes";
import Vets from "./collections/health/Vets";
import HealthServices from "./collections/health/HealthServices";
import CareServices from "./collections/care/CareServices";
import Petshops from "./collections/care/Petshops";
import PetshopTypes from "./collections/care/PetshopTypes";
import { Media } from "./web/Media";
import Options from "./web/Options";
import { ExcelFile } from "./web/ExcelFile";
import AppUsers from "./collections/appUsers/AppUsers";
import Settings from "./globals/Settings";
import Zones from "./collections/master/Zones";
import Places from "./collections/master/Places";
import Emails from "./web/Emails";
import CommunitiesByUsername from "./collections/community/CommunitiesByUsername";
import CommunitiesByPets from "./collections/community/CommunitiesByPets";
import HumansByPets from "./collections/master/HumansByPets";
import HumansByCcommunities from "./collections/master/HumansByCommunities";

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
    Zones,
    Species,
    Pets,
    VetTypes,
    Vets,
    HealthServices,
    PetshopTypes,
    Petshops,
    CareServices,
    Media,
    ExcelFile,
    Humans,
    HumansByPets,
    HumansByCcommunities,
    CommunityTypes,
    Communities,
    CommunitiesByPets,
    CommunitiesByUsername,
    Options,
    AppUsers,
    Users,
    Places,
    Emails
  ],
  globals:[
    Welcome,
    Settings
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
