import payload from "payload";
// import fs from 'fs';
const exceljs = require("exceljs");
const path = require('path');
import XLSX from 'xlsx';
import { getAccessTokens, insertKeycloakUser } from "./securityUtils";

export async function processMassiveVets(jsonDataVets: any, file: string) {
    try {
        if (Array.isArray(jsonDataVets)) {
            const vetsData = transformVetArray(jsonDataVets);
            const evalVetData: any = await validateVets(vetsData);
            for (const vet of vetsData) {
                console.log(vet);
                const newVet = await payload.create({
                    collection: "vets",
                    data: vet,
                });
            }
            if (evalVetData.validData[0]) {
                saveJsonAsExcel(evalVetData.validData, file, "Valid", './src/excel-files-processed');
            }
            if (evalVetData.notValidData[1]) {
                saveJsonAsExcel(evalVetData.notValidData, file, "Not valid", './src/excel-files-not-valid');
            }

        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
}

export async function processMassiveHumans(jsonDataHumans: any, file: string) {
    try {
        if (Array.isArray(jsonDataHumans)) {
            const humansData = transformHumanArray(jsonDataHumans);
            const evalHumanData: any = await validateHumans(humansData);
            const tokens: any = await getAccessTokens();
        
            for (const human of evalHumanData.validData) {
                createUserAndKeycloakUserFromHuman(human, tokens.access_token);
            }
            if (evalHumanData.validData[0]) {
                saveJsonAsExcel(evalHumanData.validData, file, "Valid", './src/excel-files-processed');
            }
            if (evalHumanData.notValidData[1]) {
                saveJsonAsExcel(evalHumanData.notValidData, file, "Not valid", './src/excel-files-not-valid');
            }
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
}

async function createUserAndKeycloakUserFromHuman(human: any, token: string){
    const newHuman = await payload.create({
        collection: "humans",
        data: human
    });
    const addedKeycloakUser: any = await insertKeycloakUser(token, human.nickName, human.name, human.email, "123");
    console.log(addedKeycloakUser, "ver que hay", newHuman);
    const addedAppUser = await payload.create({
        collection: "app-users",
        data: {
            email: human.email,
            username: human.nickName,
            keycloakUserId: addedKeycloakUser.keycloakUserId,
            human: newHuman.id
        }
    });
        
}

export async function processMassivePets(jsonDataPets: any, file: string) {
    try {
        if (Array.isArray(jsonDataPets)) {
            const petsData = transformHumanArray(jsonDataPets);
            const evalPetData: any = await validatePets(petsData);

            for (const human of evalPetData.validData) {
                // console.log(human);
                // console.log(human, "para insertar");
                // const newHuman = await payload.create({
                //     collection: "humans",
                //     data: human
                // });
            }
            if (evalPetData.validData[0]) {
                saveJsonAsExcel (evalPetData.validData, file, "Valid", './src/excel-files-processed');
            }
            if (evalPetData.notValidData[1]) {
                saveJsonAsExcel(evalPetData.notValidData, file, "Not valid", './src/excel-files-not-valid');
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

export const processFile = async (filePath: string, file: string) => {
    const collection = file.split("-")[0];
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        if(collection == "vets") processMassiveVets(jsonData, file);
        if(collection == "humans") processMassiveHumans(jsonData, file);
        if(collection == "pets") processMassivePets(jsonData, file);
    } catch (err) {
        console.error(`Error al procesar el archivo ${filePath}:`, err);
    }
}

const validateVets = async (vetsData: any): any => {
    const notValidData: any = [];
    const validData: any = [];
    for (const vet of vetsData) {
        const validatingVet: any = await payload.find({
            collection: "vets",
            where: {
                and: [
                    {
                        name: {
                            like: vet.name,
                        },
                    },
                    {
                        email: {
                            like: vet.email,
                        },
                    },
                ],
            },
        });
        if (validatingVet.docs[0]) {
            vet.error = "Nickname or email are already registered like a huuman";
            notValidData.push(vet);
        } else {
            validData.push(vet);
        }
    }
    return { validData, notValidData };
};

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
        if (validatingHuman.docs[0]) {
            human.error = "Nickname or email are already registered like a huuman";
            notValidData.push(human);
        } else {
            validData.push(human);
        }
    }
    return { validData, notValidData };
};

const validatePets = async (petsData: any): any => {
    const notValidData: any = [];
    const validData: any = [];
    for (const pet of petsData) {
        const validatingPet: any = await payload.find({
            collection: "pets",
            where: {
                and: [
                    {
                        name: {
                            like: pet.name,
                        },
                    },
                    {
                        "human.email": {
                            like: pet.email,
                        },
                    },
                ],
            },
        });
        if (validatingPet.docs[0]) {
            pet.error = "Pet's and human email are already registered like a pet";
            notValidData.push(pet);
        } else {
            validData.push(pet);
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

function saveJsonAsExcel(jsonData: any, file: string, sheetName: string, outputPath: string){
    jsonToExcel(jsonData, file, sheetName, outputPath)
                        .then(message => console.log(message))
                        .catch(error => console.error(error));
}

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
