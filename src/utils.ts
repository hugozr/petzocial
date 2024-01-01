import payload from 'payload'

const getHumansByEmail = async (email) => {
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
export const getUsers = async (username) => {
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
                    human: {
                        like: data.filter,
                    },
                },
            ]
        },
    });
    console.log()
    return pets;
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
    console.log(userId, data);
    const users: any = await payload.findByID({
        collection: 'users',
        id: userId
    });
    const operation = data.operation;
    let communities = [];
    if( users.communities != undefined){
        users.communities.map(com =>{
            communities.push(com.id);
        });
    }
    
    //HZUMAETA: Armo el campo con el arreglo de comunidades que corresponden
    if(operation == "insert"){
        communities.push(data.communityId);
    }else{
        communities = communities.filter(valor => valor !== data.communityId);
    }

    console.log(communities);
    // 658af3a52b529dec99e1bd98
    const result = await payload.update({
        collection: 'users', // required
        id: userId, // required
        data: {
          communities
        },
    })      
    return users;
}