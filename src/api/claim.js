import request from '../utils/http';


export function getNetwork(){
    return request({
        method: 'get',
        url: '/api/chains'
    })
}