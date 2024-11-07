import express from 'express'
import payload from 'payload'
import path from 'path';
import chokidar from 'chokidar';

import fs from 'fs';
import { processFile } from './excelUtils';
import nodemailer from 'nodemailer'

const nodemailer = require('nodemailer')




require('dotenv').config()
const app = express()

app.get('/', (_, res) => {
  res.redirect('/admin')
})

const start = async () => {
  const transport = await nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls:{
      rejectUnauthorized: false // Esto ignora los errores de certificado
    }
  });
  // console.log(process.env.SMTP_USER, process.env.SMTP_PASS, process.env.SMTP_HOST,);
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)

      const folderPathToUpload = process.env.FOLDER_PATH_TO_UPLOAD;
      const folderPathToProcess = process.env.FOLDER_PATH_TO_PROCESS;
      const folderPathToBackup = process.env.FOLDER_PATH_TO_BACKUP;

      const watcherStepOne = chokidar.watch(folderPathToUpload, { persistent: true });
      const watcherStepTwo = chokidar.watch(folderPathToProcess, { persistent: true });
      watcherStepOne.on('add', (filePath) => {
        if (path.extname(filePath) === '.xlsx') {
          const fileName = (path.parse(filePath)).name + path.extname(filePath);
          const fullFileName = folderPathToUpload + "/" + fileName;
          const fullNewFileName = folderPathToProcess + "/" + fileName;
          const fullBackupFileName = folderPathToBackup + "/" + fileName;
          fs.copyFileSync(fullFileName, fullBackupFileName); 
          fs.renameSync(fullFileName, fullNewFileName);
        }
      });
      watcherStepOne.on('error', (error) => console.error(`Error al monitorear la carpeta: ${error}`));
      watcherStepTwo.on('add', (filePath) => {
        if (path.extname(filePath) === '.xlsx') {
          console.log(`PROCESANDO ARCHIVO: ${filePath}`);
          const fileName = (path.parse(filePath)).name + path.extname(filePath)
          processFile(filePath, fileName);
          fs.unlinkSync(filePath);
        }
      });
      watcherStepOne.on('error', (error) => console.error(`Error al monitorear la carpeta: ${error}`));
      watcherStepTwo.on('error', (error) => console.error(`Error al monitorear la carpeta: ${error}`));
    },
    email:{
      fromName: 'Admin',
      fromAddress: 'hzumaeta@gmail.com',
      transport
    }
  })
  app.listen(3000)
}
start()
