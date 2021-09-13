import { Button } from '@material-ui/core';
import { useConnection } from '@solana/wallet-adapter-react';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useNotify } from '../hooks/notify';
import { usePoolForBasket, swap } from '../serum/utils/pools';
import { useCurrencyPairState } from '../serum/utils/currencyPair';
import { useWallet } from '../serum/context/wallet';

const useStyles = makeStyles({
    swapbutton: {
        display: "flex",
        justifyContent: "center",
        marginTop: 30,
    },
});
type FormState = {
    fromAmount: Number
    toAmount: Number
}

const SendTransaction = ({ fromAmount, toAmount }: FormState) => {
    const classes = useStyles();
    const { connection } = useConnection();
    const { wallet, connect, connected } = useWallet();
    const notify = useNotify();
    const { A, B } = useCurrencyPairState();
    const pool = usePoolForBasket([A?.mintAddress, B?.mintAddress]);

    console.log(`A`, A.account, pool?.legacy)

    const handleSwap = useCallback(async () => {
        // if (A.account && B.mintAddress) {
        //     notify('error', 'Wallet not connected!');
        //     return;
        // }
        if (!fromAmount || !toAmount) {
            notify('error', 'Amount error!');
            return;
        }
        try {
            const components = [
                {
                    account: A.account,
                    mintAddress: A.mintAddress,
                    amount: Number(fromAmount) * Math.pow(10, 9),
                },
                {
                    mintAddress: B.mintAddress,
                    amount: Number(toAmount) * Math.pow(10, 6),
                },
            ];
            await swap(connection, wallet, components, 0.25, pool);
        } catch (error) {
            console.log(error)
        } finally {
        }
    }, [A.account, A.mintAddress, B.mintAddress, wallet, notify, connection]);

    return (
        <Button
            variant="outlined"
            color="secondary"
            size="large"
            fullWidth
            onClick={connected ? handleSwap : connect}
            className={classes.swapbutton}
        >
            {connected ? "Swap(Serum)" : "Connect wallet"}
        </Button>
    );
};

export default SendTransaction;
