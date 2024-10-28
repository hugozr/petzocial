import payload from 'payload'

export const assignGroups = async (kcUserId: string, dataGroup: any) => {
    console.log(dataGroup, "mira lo que mando");
    const tokens = await getAccessTokens();
    const groupsURL = `${process.env.KEYCLOAK_HOST}/admin/realms/${process.env.REALM_NAME}/groups`;
    const userGroupsURL = `${process.env.KEYCLOAK_HOST}/admin/realms/${process.env.REALM_NAME}/users/${kcUserId}/groups`;
    const authHeader = { Authorization: `Bearer ${tokens.access_token}` };
    const groups = await operationAdmin(groupsURL, "GET", authHeader);
    const userGroups = await operationAdmin(userGroupsURL, "GET", authHeader);
    // console.log(groups, dataGroup.groups, userGroups, "aaaaaaaaaaaa");
    const forUpdate: any = managePermissions(groups, dataGroup.groups, userGroups);
    console.log(forUpdate, "revsar")

    forUpdate.notYetAssigned.forEach(async (id: any) => {
        const addGroupURL = `${process.env.KEYCLOAK_HOST}/admin/realms/${process.env.REALM_NAME}/users/${kcUserId}/groups/${id}`;
        console.log(addGroupURL);
        const addedGroup = await operationAuth(addGroupURL, "PUT", authHeader);
    });
    forUpdate.toDeleteAssignment.forEach(async (id: any) => {
        const delGroupURL = `${process.env.KEYCLOAK_HOST}/admin/realms/${process.env.REALM_NAME}/users/${kcUserId}/groups/${id}`;
        console.log(delGroupURL);
        const deletedGroup = await operationAuth(delGroupURL, "DELETE", authHeader);
    });
    return { forUpdate };
}

// export const getAccessTokens = (): Promise<any> => {
export const getAccessTokens = async () => {
    // const tokenPath = `${this.keycloakHost}/realms/${this.realm}/protocol/openid-connect/token`;
    const tokenPath = `${process.env.KEYCLOAK_HOST}/realms/${process.env.REALM_NAME}/protocol/openid-connect/token`;
    const postData = {
        client_id: process.env.CLIENT_ID,
        username: process.env.KC_USER_NAME,
        password: process.env.KC_USER_PASSWORD,
        grant_type: 'password',
    };
    const formData = new URLSearchParams(postData);
    const tokens = await operationToken(tokenPath, "POST", formData.toString());
    return tokens;
}

export const insertKeycloakUser = async (token: string, newUserName: string, email: string, password: string) => {
    try {
        const requestBody: any = {
            username: newUserName,
            email: email,
            enabled: true,
            credentials: [
                {
                    type: 'password',
                    value: password,
                    temporary: false,
                }
            ]
        };
        const authHeader = { Authorization: `Bearer ${token}` };
        const url = `${process.env.KEYCLOAK_HOST}/admin/realms/${process.env.REALM_NAME}/users`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
            },
            body: JSON.stringify(requestBody)
        });
        // return {await response.json()};
        return {ok: "user OK"};
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error; // Puedes manejar el error de otra manera si es necesario
    }
}

async function operationAuth(url: string, method: string, authHeader: any) {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
            },
        });
        console.log(response);
        return { "status": response.status };
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
}


async function operationAdmin(url: string, method: string, authHeader: any) {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
            },
        });
        // const resp = response.json();
        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
}

async function operationToken(url: string, method: string, body) {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body
        });
        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud y:', error);
        throw error;
    }
}

function managePermissions(groups: any, toAssign: any, userGroups: any) {
    const toAssignIds = [];
    const toDelete = [];

    const userGroupNames = new Set(userGroups.map(group => group.name));
    toAssign.forEach(permissionName => {
        const group = groups.find(g => g.name === permissionName);
        if (group) {
            if (!userGroupNames.has(permissionName)) {
                toAssignIds.push(group.id);
            }
        }
    });
    userGroups.forEach(group => {
        const exists = toAssign.includes(group.name);
        if (!exists) {
            toDelete.push(group.id);
        }
    })

    return {
        notYetAssigned: toAssignIds,
        toDeleteAssignment: toDelete
    };
}

