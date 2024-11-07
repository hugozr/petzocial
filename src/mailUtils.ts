import payload from 'payload'


export const sendMassiveLoadEmail = async (to, subject, body) => {
    try {
        const info = await payload.sendEmail({
          to,
          subject,
          html: body,
        });
        return { message: 'Email sended', info };
      } catch (error) {
        return { message: 'There was an error', error };
      }
};

export const getSettings = async () => {
    try {
        const globalData = await payload.findGlobal({
          slug: "settings", // Coloca el slug del Global aquí
        });
        return globalData;
      } catch (error) {
        console.error('Error al obtener el Global:', error);
        return { message: 'There was an error', error };
      }
    
};