import axios from "axios";

const intance = axios.create({

});



intance.interceptors.response.use(config => {
    return config
},error => {
    return Promise.reject(error);
})

intance.interceptors.request.use(res => {
    return res;
},error => {
    return Promise.reject(error);
})

export default intance;