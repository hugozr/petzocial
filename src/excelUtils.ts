import payload from "payload";
// import fs from 'fs';
const exceljs = require("exceljs");
const path = require('path');
import XLSX from 'xlsx';

export async function processMassiveVets(jsonDataVets: any) {
    try {
        if (Array.isArray(jsonDataVets)) {
            const vetsData = transformVetArray(jsonDataVets);
            for (const vet of vetsData) {
                console.log(vet);
                const newVet = await payload.create({
                    collection: "vets",
                    data: vet,
                });
            }
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
}

export async function processMassiveHumans(jsonDataHumans: any) {
    try {
        if (Array.isArray(jsonDataHumans)) {
            const humansData = transformHumanArray(jsonDataHumans);
            const evalHumanData: any = await validateHumans(humansData);

            for (const human of evalHumanData.validData) {
                // console.log(human);
                // console.log(human, "para insertar");
                // const newHuman = await payload.create({
                //     collection: "humans",
                //     data: human
                // });
            }
            // xxxxxxxxxxxxxxxxxxx
            if (evalHumanData.notValidData[0]) {
                const outputPath = './src/excel-files-not-valid'; // Ruta de la carpeta de salida
                jsonToExcel(evalHumanData.notValidData, 'mi_archivo.xlsx', 'Hoja1', outputPath)
                    .then(message => console.log(message))
                    .catch(error => console.error(error));
            }
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
}

export const downloadInExcel = async () => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Hoja1");

    const data: any = await payload.find({
        collection: "community-types",
    });
    const columns = getLabelsFromJSON(data.docs[0]);
    worksheet.addRow(columns);
    data.docs.map((obj) => {
        worksheet.addRow(getValuesByLabels(columns, obj));
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

export const genericDownloadExcel = async (slug: string, sheetName: string) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    const data: any = await payload.find({
        collection: slug,
    });
    const columns = getLabelsFromJSON(data.docs[0]);
    worksheet.addRow(columns);
    data.docs.map((obj) => {
        worksheet.addRow(getValuesByLabels(columns, obj));
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

export const processFile = async (filePath: string, collection: string) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[1];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        if(collection == "vets") processMassiveVets(jsonData);
        if(collection == "humans") processMassiveHumans(jsonData);
        console.log(`Archivo procesado y eliminado: ${filePath}`);
    } catch (err) {
        console.error(`Error al procesar el archivo ${filePath}:`, err);
    }
}


const validateHumans = async (humansData: any): any => {
    const notValidData: any = [];
    const validData: any = [];
    for (const human of humansData) {
        const validatingHuman: any = await payload.find({
            collection: "humans",
            where: {
                or: [
                    {
                        nickName: {
                            like: human.nickName,
                        },
                    },
                    {
                        email: {
                            like: human.email,
                        },
                    },
                ],
            },
        });
        console.log(validatingHuman, "aaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        if (validatingHuman.docs[0]) {
            human.error = "Nickname or email are already registered like a huuman";
            notValidData.push(human);
        } else {
            validData.push(human);
        }
    }
    return { validData, notValidData };
};


const transformVetArray = (data: any[]): any[] => {
    return data.map((item) => ({
        name: item.name,
        coordinates: { x: item.x, y: item.y },
        phone: item.phone,
        address: item.address,
        email: item.email,
        url: item.url,
        openingHours: item.openingHours,
    }));
};

const transformHumanArray = (data: any[]): any[] => {
    return data.map((item) => ({
        name: item.name,
        nickName: item.nickName,
        phone: item.phone,
        address: item.address,
        email: item.email,
    }));
};

function getLabelsFromJSON(jsonData) {
    if (typeof jsonData !== "object") {
        console.error("El argumento proporcionado no es un objeto JSON válido.");
        return [];
    }
    const labels = Object.keys(jsonData);
    return labels;
}

function getValuesByLabels(labels, jsonData) {
    if (typeof jsonData !== "object") {
        console.error("El segundo argumento no es un objeto JSON válido.");
        return [];
    }
    const values = labels.map((label) => jsonData[label]);
    return values;
}

function jsonToExcel(jsonData, outputFileName, worksheetName = "Data", outputPath = './') {
    return new Promise((resolve, reject) => {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet(worksheetName);

        // Escribir encabezados y datos
        worksheet.addRow(Object.keys(jsonData[0])); // Asume que todos los objetos tienen las mismas propiedades
        jsonData.forEach((item) => {
            worksheet.addRow(Object.values(item));
        });
        const filePath = path.join(outputPath, outputFileName);
        workbook.xlsx
            .writeFile(filePath)
            .then(() => {
                resolve("Archivo Excel creado exitosamente");
            })
            .catch((err) => {
                reject(err);
            });
    });
}
