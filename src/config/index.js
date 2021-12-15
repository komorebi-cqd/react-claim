


import { getNetwork } from '../api/claim';


const chaim = async () => {
    let res = await getNetwork();
    return res.data;
}


export const netWorks = chaim;
export const pro_netWorks = chaim;


export const errorChainMsg = "You are on the wrong network";
export const metaMaskDownload = "https://metamask.io";