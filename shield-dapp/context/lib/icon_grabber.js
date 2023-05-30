import axios from 'axios';
export const icon_grabber = async (domain, size)=>{
    const response = await axios.get(`https://www.google.com/s2/favicons?domain=${domain}&sz=${size||256}`,{
        headers: {
            'Access-Control-Allow-Origin': '*',
            //'Content-Type': 'application/json',
          },
    });
    return response.data;
}