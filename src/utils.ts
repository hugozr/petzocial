import payload from 'payload'
// const exceljs = require("exceljs");


export const getHumansByEmail = async (email) => {
    const humans = await payload.find({
        collection: 'humans',
        depth: 2,
        where: {
            email: {
                equals: email,
            },
        },
    });
    return humans.docs;
}


export const getPetsHumansByEmail = async (email: string) => {
    let pets: any = null;
    let human: any = null;
    const humans = await payload.find({
        collection: 'humans',
        depth: 1,
        where: {
            email: {
                equals: email,
            },
        },
    });
    if (humans.docs[0]){
        human = humans.docs[0];
        const humanPets = await payload.find({
            collection: 'humans-by-pets',
            depth: 2,
            where: {
                human: {
                    equals: humans.docs[0].id,
                },
            },
        });
        pets = humanPets.docs.map(item => item.pet);
    }
    return {human, pets};
}


export const existsCommunitiesByEmail = async (email: string, communityId: string) => {
    let exists = false;
    let human: any = null;
    const humans = await payload.find({
        collection: 'humans',
        depth: 1,
        where: {
            email: {
                equals: email,
            },
        },
    });
    if (humans.docs[0]){
        human = humans.docs[0];
        const humanCommunities = await payload.find({
            collection: 'humans-by-communities',
            depth: 1,
            where: {
                and:
                [
                    {
                        human: {
                            equals: humans.docs[0].id,
                        },
                    },
                    {
                        community: {
                            equals: communityId,
                        },
                    },
                ]
            } 
        });
        exists = humanCommunities.docs[0] ? true : false;
    }
    return {exists};
}

export const getCommunitiesByEmail = async (email: string) => {
    let communities: any = null;
    let human: any = null;
    const humans = await payload.find({
        collection: 'humans',
        depth: 1,
        where: {
            email: {
                equals: email,
            },
        },
    });
    if (humans.docs[0]){
        human = humans.docs[0];
        const humanCommunities = await payload.find({
            collection: 'humans-by-communities',
            depth: 2,
            where: {
                human: {
                    equals: humans.docs[0].id,
                },
            },
        });
        communities = humanCommunities.docs.map(item => item.community);
    }
    return {human, communities};
}

export const getPetsBysHumanId = async (id: string) => {
    const humanPets = await payload.find({
        collection: 'humans-by-pets',
        depth: 2,
        where: {
            human: {
                equals: id,
            },
        },
    });
    const pets = humanPets.docs.map(item => item.pet);
        
    return pets;
}

export const getHumansByPetId = async (id: string, body: any) => {
    const humans = await payload.find({
        collection: 'humans-by-pets',
        depth: 2,
        where: {
            pet: {
                equals: id,
            },
        },
    });
    return humans.docs.map(item => item.human);
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
    console.log(pets,"debls")
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
    return { "like": "ok" };
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
                    email: {
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
    let filterCondition: any = {
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
    };
    if (data.zone) {     //Si en el body existe la zona, entonces filtro por la zona también y lo pongo en el AND, de esta forma no modifico el query original
        const zoneCondition: any = {
            zone: {
                equals: data.zone
            }
        }
        filterCondition = { and: [filterCondition, zoneCondition] }
    }
    const communities = await payload.find({
        collection: 'communities',
        page: data.page,
        limit: data.limit,
        where: filterCondition
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
    //Este método es necesario porque un app-user puede manejar varias comunidades
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


export const linkCommunityToUsername = async (community: any) => {
    const created = await payload.create({
        collection: "communities-by-username",
        data: {
            username: community.kcUserName,
            community: community.id,
        }
    });
    return created;
}

export const createPet = async (pet: any, human: any, zoneId: string) => {
    const petToAdd: any = {
        name: pet.name,
        comment: "Put some information aboout me",
        zone: zoneId,
        specie: {
            specieId: pet.specie.specieId,
            name:  pet.specie.name,
        },
        breed: {
            breedId: pet.breed.breedId,
            name:  pet.breed.name
        }
    };
    if(human){
        petToAdd.human = {
            name: human.name,
            humanId: human.id,
            email: human.email
        }
    } 
    const createdPet: any = await payload.create({
        collection: "pets",
        data:  petToAdd
    });
    
    return createdPet;
}

export const getCommunitiesByUsername = async (username: string) => {
    const toReturn = await payload.find({
        collection: 'communities-by-username',
        where: {
            and: [
                {
                    username: {
                        equals: username,
                    }
                }
            ]
        },
    });
    return toReturn.docs;
}

export const getMembers = async (communityId: string) => {
    const members = await payload.find({
        collection: 'communities-by-pets',
        depth: 3,
        where: {
            and: [
                {
                    "community.id": {
                        equals: communityId,
                    }
                }
            ]
        },
    });
    return members.docs;
}

export const getHumans = async (community: string, body: any) => {
    const humans = await payload.find({
        collection: 'humans-by-communities',
        depth: 3,
        where: {
            and: [
                {
                    "community.id": {
                        equals: community,
                    }
                }
            ]
        },
    });
    console.log(humans);
    // return humans.docs.map(item => item.human);
    return humans.docs.map(item => ({id: item.id, human: item.human, position: item.position}));
}

export const petIsCommunityMember = async (communityId: string, petId: string) => {
    const member = await payload.find({
        collection: 'communities-by-pets',
        depth: 1,
        where: {
            and: [
                {
                    "community.id": {
                        equals: communityId,
                    }
                },
                {
                    "pet.id": {
                        equals: petId,
                    }
                },
            ]
        },
    });
    return member.docs;
}

export const delCommunityByUsername = async (body: any) => {
    const toDelete = await payload.delete({
        collection: 'communities-by-username',
        where: {
            and: [
                {
                    community: {
                        equals: body.community,
                    }
                },
                {
                    username: {
                        equals: body.username
                    }
                }
            ]
        },
    });
    return toDelete.docs;
}
export const delCommunityByPet = async (body: any) => {
    const toDelete = await payload.delete({
        collection: 'communities-by-pets',
        where: {
            and: [
                {
                    community: {
                        equals: body.communityId,
                    }
                },
                {
                    pet: {
                        equals: body.petId
                    }
                }
            ]
        },
    });
    return toDelete.docs;
}

export const delHumanByCommunity = async (body: any) => {
    const toDelete = await payload.delete({
        collection: 'humans-by-communities',
        where: {
            and: [
                {
                    community: {
                        equals: body.community,
                    }
                },
                {
                    pet: {
                        equals: body.human
                    }
                }
            ]
        },
    });
    return toDelete.docs;
}

export const petToCommunity = async (body: any) => {
    const canInsert = await payload.find({
        collection: 'communities-by-pets',
        where: {
            and: [
                {
                    community: {
                        equals: body.community,
                    }
                },
                {
                    pet: {
                        equals: body.pet
                    }
                }
            ]
        },
    });
    if(canInsert.docs[0]) return canInsert.docs[0]; 
    const toInsert = await payload.create({
        collection: 'communities-by-pets',
        data: {
            pet: body.pet,
            community: body.community,
        },
    });
    console.log(toInsert, "insettado")
    return toInsert;
}

export const humanToCommunity = async (body: any) => {
    const canInsert = await payload.find({
        collection: 'humans-by-communities',
        where: {
            and: [
                {
                    community: {
                        equals: body.community,
                    }
                },
                {
                    human: {
                        equals: body.human
                    }
                }
            ]
        },
    });
    if(canInsert.docs[0]) return canInsert.docs[0]; 
    const toInsert = await payload.create({
        collection: 'humans-by-communities',
        data: body
        // data: {
        //     human: body.human,
        //     community: body.community,
        // },
    });
    return toInsert;
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
        let petIds: any = human.pets ? human.pets.map(pet => pet.id) : [];
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
    if (users.totalDocs == 0) {
        const user = await payload.create({
            collection: "app-users",
            data: {
                username: keycloakData.keycloakUserName,
                name: keycloakData.keycloakFullName,
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


export function generatePrefixFileName(collection, user, filterId) {
    const filter = filterId ? filterId : "SF";
    const date = new Date();
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const hhmmss = date.toTimeString().slice(0, 8).replace(/:/g, "");
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `${collection}-${user}-${filter}-${yyyymmdd}-${hhmmss}-${randomNumber}`;
}

export function generateHTMLTable(data: any): string {
    if (data.length === 0) {
        return "";
    }

    // Obtener los encabezados de la tabla a partir de las claves del primer objeto
    const headers = Object.keys(data[0]);

    // Generar la fila de encabezados
    const headerHTML = headers
        .map(header => `<th>${header}</th>`)
        .join("");

    // Generar las filas de datos
    const rowsHTML = data
        .map(obj => {
            // Crear celdas de la fila para cada propiedad en headers
            const cells = headers
                .map(header => `<td>${obj[header] !== undefined ? obj[header] : ""}</td>`)
                .join("");
            return `<tr>${cells}</tr>`;
        })
        .join("");

    // Armar la tabla completa
    const tableHTML = `
    <table border="1">
      <thead>
        <tr>${headerHTML}</tr>
      </thead>
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>
  `;

    return tableHTML;
}

