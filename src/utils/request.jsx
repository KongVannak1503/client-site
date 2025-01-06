import axios from "axios";

const base_url = "http://localhost:5000/api/";
export const request = (url= "", method="GET", data={}) =>{
    return axios({
        url: base_url + url,
        method: method,
        data: data,
        headers: {},
    })
    .then((res)=>{
        return res.data;
    })
    .catch((err)=>{
        alert("Fetch Error API",err);
    });
};