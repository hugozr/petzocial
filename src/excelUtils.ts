import payload from "payload";
// import fs from 'fs';
const exceljs = require("exceljs");
const path = require('path');
import XLSX from 'xlsx';
import { getAccessTokens, insertKeycloakUser } from "./securityUtils";
import { getSettings, sendMassiveLoadEmail } from "./mailUtils";
import { createPet, generateHTMLTable, humanAssignedToPet } from "./utils";

export async function processMassiveVets(jsonDataVets: any, file: string) {
    try {
        if (Array.isArray(jsonDataVets)) {
            const vetsData = transformVetArray(jsonDataVets);
            const evalVetData: any = await validateVets(vetsData);
            for (const vet of vetsData) {
                // console.log(vet);
                const newVet = await payload.create({
                    collection: "vets",
                    data: vet,
                });
            }
            if (evalVetData.validData[0]) {
                // saveJsonAsExcel(evalVetData.validData, file, "Valid", './src/excel-files-processed');
                saveJsonAsExcel(evalVetData.validData, file, "Valid", process.env.FOLDER_PATH_PROCESSED);
            }
            if (evalVetData.notValidData[1]) {
                // saveJsonAsExcel(evalVetData.notValidData, file, "Not valid", './src/excel-files-not-valid');
                saveJsonAsExcel(evalVetData.notValidData, file, "Not valid", process.env.FOLDER_PATH_NOT_VALID);
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
                saveJsonAsExcel(evalHumanData.validData, file, "Valid", process.env.FOLDER_PATH_PROCESSED);
            }
            if (evalHumanData.notValidData[1]) {
                saveJsonAsExcel(evalHumanData.notValidData, file, "Not valid", process.env.FOLDER_PATH_NOT_VALID);
            }
            return evalHumanData;       //HZUMAETA: Retorno la evaluacion de los datos para poder notificar al usuario el resultade de la evaluacion
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
}

export async function processMassivePets(jsonDataPets: any, file: string, communityId: string) {
    try {
        if (Array.isArray(jsonDataPets)) {
            const petsData = transformPetArray(jsonDataPets);
            const species: any = await payload.find({
                collection: "species",
            });
            const evalPetData: any = await validatePetsAndHumans(petsData);
            for (const petExcel of evalPetData.validData) {
                const specieAndBreed: any = getSpecieAndBreed(species.docs, petExcel.specie, petExcel.breed);
                const pet: any = {
                    name: petExcel.name,
                    specie: {
                        specieId: specieAndBreed.specie.id,
                        name: petExcel.specie
                    },
                    breed: {
                        breedId: specieAndBreed.breed.id,
                        name: petExcel.breed
                    }
                };
                const humanData: any = await payload.findByID({
                    collection: 'humans',
                    id: petExcel.humanId
                });
                const human: any = {
                    name: humanData.name,
                    email: petExcel.email,
                    id: petExcel.humanId
                };
                createPetAndAssociatedHumanAndCommunity({ pet, human, communityId });
            }
            if (evalPetData.validData[0]) {
                saveJsonAsExcel(evalPetData.validData, file, "Valid", process.env.FOLDER_PATH_PROCESSED);
            }
            if (evalPetData.notValidData[1]) {
                saveJsonAsExcel(evalPetData.notValidData, file, "Not valid", process.env.FOLDER_PATH_NOT_VALID);
            }
            return evalPetData;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
}

function getSpecieAndBreed(species: any, specieName: string, breedName: string) {
    const foundSpecie: any = species.find(item => item.name.toLowerCase() === specieName.toLowerCase());
    const foundBreed: any = foundSpecie.breeds.find(item => item.name.toLowerCase() === breedName.toLowerCase());
    return {specie: foundSpecie, breed: foundBreed};
}

async function createUserAndKeycloakUserFromHuman(human: any, token: string) {
    const newHuman = await payload.create({
        collection: "humans",
        data: human
    });
    const addedKeycloakUser: any = await insertKeycloakUser(token, human.nickName, human.name, human.email, "123");
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

async function createPetAndAssociatedHumanAndCommunity(petHumanCommunity: any) {
    const addedPet = await createPet(petHumanCommunity.pet, petHumanCommunity.human);
    const response = await humanAssignedToPet(petHumanCommunity.human.id, addedPet.id);
    if(petHumanCommunity.communityId){
        const member = await payload.create({
            collection: "communities-by-pets",
            data:  {
                community: petHumanCommunity.communityId,
                pet: addedPet.id
            }
        }); 
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
    let evalData: any = null;
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        if (collection == "vets") processMassiveVets(jsonData, file);
        if (collection == "humans") {
            evalData = await processMassiveHumans(jsonData, file);
        }
        if (collection == "pets") {
            const communityId = file.split("-")[2];
            evalData = await processMassivePets(jsonData, file, communityId);
        }
        const tableValids = generateHTMLTable(evalData.validData);
        const tableNotValids = generateHTMLTable(evalData.notValidData);
        const settings: any = await getSettings();
        let body: string = settings.mailMassiveLoad;
        let subject: string = settings.mailMassiveLoadSubject;
        if (tableValids != "") {
            body = body.replace("{{valid-section}}", "<p>Valid records</p>" + tableValids);
        }

        if (tableNotValids != "") {
            body = body.replace("{{not-valid-section}}", "<p>Not valid records</p>" + tableNotValids);
        }
        const nValidLength = evalData.validData.length;
        const nNotValidLength = evalData.notValidData.length;
        subject = subject.replace("{{q-valid}}", nValidLength);
        subject = subject.replace("{{q-not-valid}}", nNotValidLength);
        subject = subject.replace("{{collection}}", "humans");
        const send = await sendMassiveLoadEmail("hzumaeta@gmail.com", subject, body);

    } catch (err) {
        console.error(`Error al procesar el archivo ${filePath}:`, err);
    }
}

const validateVets = async (vetsData: any) => {
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

const validateHumans = async (humansData: any) => {
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

const validatePetsAndHumans = async (petsData: any) => {
    const notValidData: any = [];
    const validData: any = [];
    for (const pet of petsData) {
        const validatingPet: any = await payload.find({
            collection: "pets",
            where: {
                and: [
                    {
                        name: {
                            equals: pet.name,
                        },
                    },
                    {
                        "human.email": {
                            equals: pet.email,
                        },
                    },
                ],
            },
        });
        if (validatingPet.docs[0]) {
            pet.error = "Pet's and human's email are already registered like a pet";
            notValidData.push(pet);
            continue;
        }
        const validatingHuman: any = await payload.find({
            collection: "humans",
            where: {
                and: [
                    {
                        nickName: {
                            equals: pet.nickName,
                        },
                    },
                    {
                        email: {
                            equals: pet.email,
                        },
                    },
                ],
            },
        });
        if (!validatingHuman.docs[0]) {
            pet.error = "Human does not exists.";
            notValidData.push(pet);
            continue;
        }
        //HZUMAETA Necesito el ID del huamno para poder asociarlo a la mascota.
        pet.humanName = validatingHuman.docs[0].name;
        pet.humanId = validatingHuman.docs[0].id;
        validData.push(pet);
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

const transformPetArray = (data: any[]): any[] => {
    return data.map((item) => ({
        name: item.petName,
        specie: item.specie,
        breed: item.breed,
        gender: item.gender,
        nickName: item.nickName,
        email: item.email,
    }));

};

function saveJsonAsExcel(jsonData: any, file: string, sheetName: string, outputPath: string) {
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
