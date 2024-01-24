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
        collection: 'users',
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
            collection: 'users', // required
            id: userId, // required
            data: {
                human: humans[0].id,
            }
        });
    }
    return returned
}
export const getUsersByName = async (username) => {
    const users = await payload.find({
        collection: 'users',
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
        collection: 'users',
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
                // {
                //     phone: {
                //         like: data.filter,
                //     },
                // },
                // {
                //     email: {
                //         like: data.filter,
                //     },
                // },
                // {
                //     address: {
                //         like: data.filter,
                //     },
                // },
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
        collection: 'users',
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
        collection: 'users',
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

    const result = await payload.update({
        collection: 'users', // required
        id: userId, // required
        data: {
            communities
        },
    })
    return result;
}
export const humanAssignedToPet = async (humanId: string, petId: string) => {

    const human: any = await payload.findByID({
        collection: 'humans',
        id: humanId
    });
    if (human) {
        // const owns: any = human.pets;
        const pets = human.pets.map(pet => pet.id);
        if (!pets.includes(petId)) {
            pets.push(petId);
            const result = await payload.update({
                collection: 'humans', // required
                id: humanId, // required
                data: {
                    pets
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