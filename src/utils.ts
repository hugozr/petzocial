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

// module.exports = associateHuman;