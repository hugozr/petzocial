import payload from 'payload'
// const exceljs = require("exceljs");


export const getHumansByEmail = async (email) => {
    const humans = await payload.find({
        collection: 'humans',
        depth: 1,
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
export const filterPetsByZone = async (data: any) => {
    console.log("aaaaaaaaaa");
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
            ],
            and: [
                {
                    zone: {
                        equals: data.zone
                    }
                }
            ]
        },
    });
    return pets;
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
            ],
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

export const retrieveCommunitiesByUsername = async (username: string) => {
    const communities: any = await payload.find({
        collection: 'communities',
        depth: 0,
        where: {
            kcUserName: {
                equals: username,
            },
        },
        }
    );
    return communities;
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


export const syncronizeToApUser = async (keycloakData: any) => {
    let createdUser = false;     
    // console.log("parece que no viene unsername",keycloakData);
    const users = await payload.find({
        collection: 'app-users',
        where: {
            keycloakUserId: {
                equals: keycloakData.keycloakUserId,
            },
        },
    });
    if(users.totalDocs == 0) {
        const user = await payload.create({
            collection: "app-users",
            data: {
                username: keycloakData.keycloakUserName,
                email: keycloakData.keycloakEmail,
                keycloakUserId: keycloakData.keycloakUserId,
            }
        })
        user.created = true;
        return user;
    }
    users.docs[0].created = createdUser;
    return users.docs[0];
}


export function generatePrefixFileName(id, user) {
    const date = new Date();
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const hhmmss = date.toTimeString().slice(0, 8).replace(/:/g, "");
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `${id}-${user}-${yyyymmdd}-${hhmmss}-${randomNumber}`;
}