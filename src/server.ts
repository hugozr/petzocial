import express from 'express'
import payload from 'payload'
import path from 'path';
import chokidar from 'chokidar';

import fs from 'fs';
import { processFile, processMassiveHumans, processMassiveVets } from './excelUtils';



require('dotenv').config()
const app = express()

app.get('/', (_, res) => {
  res.redirect('/admin')
})

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)

      const folderPathToUpload = 'C:/ehzr/16.Petso/02.app/payload-petzocial/src/excel-files';
      const folderPathToProcess = 'C:/ehzr/16.Petso/02.app/payload-petzocial/src/excel-files-pre-processed';
      const watcherStepOne = chokidar.watch(folderPathToUpload, { persistent: true });
      const watcherStepTwo = chokidar.watch(folderPathToProcess, { persistent: true });
      watcherStepOne.on('add', (filePath) => {
        if (path.extname(filePath) === '.xlsx') {
          const fileName = (path.parse(filePath)).name + path.extname(filePath);
          const fullFileName = folderPathToUpload + "/" + fileName;
          const fullNewFileName = folderPathToProcess + "/" + fileName;
          console.log(`Nuevo archivo detectado: ${filePath}`);
          console.log("MOVIENDO ARCHIVO", fullFileName, "--->", fullNewFileName);
          fs.renameSync(fullFileName, fullNewFileName);
        }
      });
      watcherStepOne.on('error', (error) => console.error(`Error al monitorear la carpeta: ${error}`));
      watcherStepTwo.on('add', (filePath) => {
        if (path.extname(filePath) === '.xlsx') {
          console.log(`PROCESANDO ARCHIVO: ${filePath}`);
          const collection = ((path.parse(filePath)).name).split("-")[0];
          processFile(filePath, collection);
        }
      });
      watcherStepOne.on('error', (error) => console.error(`Error al monitorear la carpeta: ${error}`));
      watcherStepTwo.on('error', (error) => console.error(`Error al monitorear la carpeta: ${error}`));
    },
  })
  app.listen(3000)
}
start()
