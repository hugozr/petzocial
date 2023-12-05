import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";

import Users from "./collections/Users";
import Options from "./collections/web/Options";
import Pets from "./collections/master/Pets";
import Species from "./collections/master/Species";
import { Media } from "./collections/web/Media";
import Welcome from "./globals/Welcome";
import Vets from "./collections/health/Vets";
import HealthServices from "./collections/health/HealthServices";

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
    Vets,
    HealthServices,
    Media,
    Users,
    Options,
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
