import payload from 'payload'
const exceljs = require("exceljs");


export const getHumansByEmail = async (email) => {
    const humans = await payload.find({
        collection: 'humans',
        where: {
            email: {
                equals: email,
            },
        },
    });
    return humans.docs;
}
const getUserById = async (id) => {
    const user = await payload.findByID({
        collection: 'app-users',
        id
    });
    return user;
}
export const associateHuman = async (userId) => {
    const user = await getUserById(userId);
    const humans = await getHumansByEmail(user.email);
    let returned = null;
    if (humans.length > 0) {
        returned = await payload.update({
            collection: 'app-users', 
            id: userId, 
            data: {
                human: humans[0].id,
            }
        });
    }
    return returned
}
export const getUsersByName = async (username) => {
    
    const users = await payload.find({
        collection: 'app-users',
        where: {
            username: {
                equals: username,
            },
        },
    });
    return users;
}
export const getUsersByEmail = async (email) => {
    const users = await payload.find({
        collection: 'app-users',
        where: {
            email: {
                equals: email,
            },
        },
    });
    return users;
}
export const filterPets = async (data: any) => {
    const pets = await payload.find({
        collection: 'pets',
        page: data.page,
        limit: data.limit,
        where: {
            or: [
                {
                    name: {
                        like: data.filter,
                    },
                },
                {
                    comment: {
                        like: data.filter,
                    },
                },
                {
                    "human.name": {
                        like: data.filter,
                    },
                },
            ]
        },
    });
    return pets;
}
export const filterPetsByHumanId = async (data: any) => {
    const human = await payload.findByID({
        collection: 'humans',
        id: data.id
    });
    return human.pets;
}
export const petLike = async (data: any) => {
    return {"like": "ok"};
}

export const filterPetsByCommunityId = async (data: any) => {
    const community = await payload.findByID({
        collection: 'communities',
        id: data.id,
        depth: 1,
    });
    return community;
    //TODO: Me quedé en que debo poner como cabecera el nombre de la comunidad, creo que mejor consulto comunidades
}

export const filterVets = async (data: any) => {
    const vets = await payload.find({
        collection: 'vets',
        page: data.page,
        limit: data.limit,
        where: {
            or: [
                {
                    name: {
                        like: data.filter,
                    },
                },
                {
                    comment: {
                        like: data.filter,
                    },
                },
            ]
        },
    });
    console.log()
    return vets;
}
export const filterPetshops = async (data: any) => {
    const petshops = await payload.find({
        collection: 'petshops',
        page: data.page,
        limit: data.limit,
        where: {
            or: [
                {
                    name: {
                        like: data.filter,
                    },
                },
                {
                    comment: {
                        like: data.filter,
                    },
                },
            ]
        },
    });
    return petshops;
}
export const filterHumans = async (data: any) => {
    const humans = await payload.find({
        collection: 'humans',
        page: data.page,
        limit: data.limit,
        where: {
            or: [
                {
                    nickName: {
                        like: data.filter,
                    },
                },
                {
                    name: {
                        like: data.filter,
                    },
                },
                {
                    comment: {
                        like: data.filter,
                    },
                },
            ]
        },
    });
    console.log()
    return humans;
}
export const filterCommunities = async (data: any) => {
    const communities = await payload.find({
        collection: 'communities',
        page: data.page,
        limit: data.limit,
        where: {
            or: [
                {
                    name: {
                        like: data.filter,
                    },
                },
                {
                    comment: {
                        like: data.filter,
                    },
                },
                {
                    "type.name": {
                        like: data.filter,
                    },
                },
            ]
        },
    });
    return communities;
}
export const filterUsers = async (data: any) => {
    const communities = await payload.find({
        collection: 'app-users',
        page: data.page,
        limit: data.limit,
        where: {
            or: [
                {
                    username: {
                        like: data.filter,
                    },
                },
                {
                    email: {
                        like: data.filter,
                    },
                },
                {
                    "human.name": {
                        like: data.filter,
                    },
                },
            ]
        },
    });
    return communities;
}
export const communityUpdate = async (userId: string, data: any) => {
    //HZUMAETA: Recibe en el body {"operation": "insert" || "delete", "communityId": communityId}
    const user: any = await payload.findByID({
        collection: 'app-users',
        id: userId
    });

    const operation = data.operation;
    //HZUMAETA: Debo campturar los IDs
    let communities = [];
    if (user.communities != undefined) {
        user.communities.map(com => {
            communities.push(com.id);
        });
    }
    //HZUMAETA: Armo el campo con el arreglo de comunidades que corresponden
    if (operation == "insert") {
        communities.push(data.communityId);
    } else {
        communities = communities.filter(valor => valor !== data.communityId);
    }
    //HZUMAETA: Elimino los undefined, en caso se haya eliminado la comunidad
    communities = communities.filter(element => element !== undefined);

    const result = await payload.update({
        collection: 'app-users', 
        id: userId, 
        data: {
            communities: communities
        },
    })
    return result;
}
export const petUpdate = async (communityId: string, data: any) => {
    const community: any = await payload.findByID({
        collection: 'communities',
        id: communityId
    });
    const operation = data.operation;
    //HZUMAETA: Debo campturar los IDs
    let petMembers = [];
    if (community.petMembers != undefined) {
        community.petMembers.map(pet => {
            petMembers.push(pet.id);
        });
    }

    //HZUMAETA: Armo el campo con el arreglo de comunidades que corresponden
    if (operation == "insert") {
        petMembers.push(data.petId);
    } else {
        petMembers = petMembers.filter(valor => valor !== data.petId);
    }

    const result = await payload.update({
        collection: 'communities',
        id: communityId, 
        data: {
            petMembers
        },
    })
    return result;
}

export const humanAssignedToPet = async (humanId: string, petId: string) => {

    //HZUMAETA: Verifico que el humano exista. Si existe obtengo el arreglo de las mascotas que tiene
    const human: any = await payload.findByID({
        collection: 'humans',
        id: humanId
    });

    if (human) {
        let petIds: any = human.pets.map(pet => pet.id);
        if(!petIds) petIds = [];
        if (!petIds.includes(petId)) {
            petIds.push(petId);
            const result = await payload.update({
                collection: 'humans', 
                id: humanId, 
                data: {
                    pets: petIds
                },
            })
        }
    }
    else {
        return null;
    }
    return { "ok": "ok" };
}

export const downloadInExcel = async () => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Hoja1");

    const data: any = await payload.find({
        collection: 'community-types',
    })
    const columns = getLabelsFromJSON(data.docs[0]);
    worksheet.addRow(columns);
    data.docs.map(obj => {
        worksheet.addRow(getValuesByLabels(columns, obj));
    })
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer
}

export const syncronizeToApUser = async (keycloakData: any) => {
    // keycloakData:
    // {
    //     keycloakUserId: '6d2419da-30e8-449e-8408-9e155c0893af',
    //     keycloakUserName: 'pp',
    //     keycloakEmail: 'pp@a.com'
    //   }
    console.log("parece que no viene unsername",keycloakData);
    const users = await payload.find({
        collection: 'app-users',
        where: {
            keycloakUserId: {
                equals: keycloakData.keycloakUserId,
            },
        },
    });
    console.log("entra a crear?", users.totalDocs);
    if(users.totalDocs == 0) {
        const user = await payload.create({
            collection: "app-users",
            data: {
                username: keycloakData.keycloakUserName,
                email: keycloakData.keycloakEmail,
                keycloakUserId: keycloakData.keycloakUserId,
            }
        })
        return user;
    }
    return users.docs[0];
}


export const genericDownloadExcel = async (slug: string, sheetName: string) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    const data: any = await payload.find({
        collection: slug,
    })
    const columns = getLabelsFromJSON(data.docs[0]);
    worksheet.addRow(columns);
    data.docs.map(obj => {
        worksheet.addRow(getValuesByLabels(columns, obj));
    })
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer
}

function getLabelsFromJSON(jsonData) {
    if (typeof jsonData !== 'object') {
      console.error('El argumento proporcionado no es un objeto JSON válido.');
      return [];
    }
    const labels = Object.keys(jsonData);
    return labels;
  }

  function getValuesByLabels(labels, jsonData) {
    if (typeof jsonData !== 'object') {
      console.error('El segundo argumento no es un objeto JSON válido.');
      return [];
    }
    const values = labels.map(label => jsonData[label]);
    return values;
  }