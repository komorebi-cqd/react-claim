import { useEffect,useState } from 'react';
import { useSelector } from 'react-redux';



export default function useTokenSymb() {
    const tokenList = useSelector(state => state.account.tokenList);
    const curToken = useSelector(state => state.account.token);
    const [tokenSymb, setTokenSymb] = useState('');
    useEffect(() => {
        const res = tokenList.filter(it => it.token === curToken);
        if (!res[0]) {
            setTokenSymb('');
            return;
        }
        setTokenSymb(res[0].symb);
    }, [tokenList, curToken]);


    return tokenSymb;
}