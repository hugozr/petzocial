import payload from 'payload'

export const updateByHumanQueue = async (doc: any) => {
  console.log(doc, "sacar human dataaaaaaaaaaaaaaaaaaaaa")
  const body: any = {
    humanData: {
      nickName: doc.nickName,
      email: doc.email,
      humanImageUrl: doc.humanImage?.url 
    }
  }

  const url = `http://localhost:3001/api/pet-humans/${doc.id}/queue-update`;
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  console.log(body,url)

  const response = await fetch(url, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });
  return response;
};
