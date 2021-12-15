import request from '../utils/http';

export function getNetwork(){
    return request({
        method: 'get',
        url: '/api/chains'
    })
}

export function getExtractCash(params) {
    return request({
        method: 'get',
        url: `/api/${params.token}/${params.address}/${params.chain_id}/${params.nonce}`
    })
}


export function getSign(params) {
    return request({
        method: 'get',
        url: `/api/sign/${params.token}/${params.address}/${params.chain_id}/${params.nonce}`
    })
}