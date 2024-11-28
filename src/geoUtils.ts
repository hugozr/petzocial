import payload from 'payload'


export const createPlace = async (doc: any) => {
    console.log(doc, "este es el documento", doc.coordinates);
    const x = doc.coordinates.x;
    const y = doc.coordinates.y;
    if (x == null || y == null) {
        return;
    }
    const url = `${process.env.PLACE_SERVICE}?format=json&lat=${x}&lon=${y}&addressdetails=1`;
    const detailPlace: any = await nominatimPlace(url,"GET");
    console.log(detailPlace,",,,,,,,,,,,,,,,", detailPlace.place_id);
    const placeId = detailPlace.place_id;
    const foundPlaces: any = await getPlaceByPlaceId(placeId);
    let refPlaceId = null;

    if(foundPlaces.length == 0){
        const place = await payload.create({
            collection: "places",
            data: {
                placeId,
                displayName: detailPlace.display_name,
                data: detailPlace,
            }
        });
        refPlaceId = place.id;
    } else {
        refPlaceId = foundPlaces[0].id;
    }
    
    
    const vet = await payload.update({
        collection: 'vets', 
        id: doc.id, 
        data: {
            place: refPlaceId
        },
    });
    return vet;
}


async function nominatimPlace(url: string, method: string) {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'User-Agent': 'MyGeocodingApp/1.0',
            },
        });
        return response.json();
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
}

async function getPlaceByPlaceId(placeId: string) {
    const places = await payload.find({
        collection: 'places',
        depth: 0,
        where: {
            placeId: {
                equals: placeId,
            },
        },
    });
    return places.docs;
}