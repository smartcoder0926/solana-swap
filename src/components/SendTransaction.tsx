import { Button } from '@material-ui/core';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useNotify } from '../hooks/notify';
import { actions } from '../store/liquidity';
import { swap } from '../utils/swap'

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
    const wallet = useWallet();
    const notify = useNotify();

    const onClick = useCallback(async () => {
        if (!wallet.publicKey) {
            notify('error', 'Wallet not connected!');
            return;
        }
        if (!fromAmount || !toAmount) {
            notify('error', 'Amount error!');
            return;
        }
        const liquidity = await actions(connection)
        const poolInfo = Object.values(liquidity).find((e: any) => e.ammId === "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2")
        console.log(fromAmount, toAmount)
        swap(
            connection,
            wallet.adapter,
            poolInfo,
            "11111111111111111111111111111111",
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            String(wallet.publicKey),
            "C4rHPCx82xxtVpGKN4bzT9bTta3axKxKYjX6gHNCsXgW",
            String(fromAmount),
            String(toAmount)
        )
            .then((txid) => {
                notify('info', 'Transaction has been sent');
                notify('info', `https://explorer.solana.com/tx/${txid}`);
            })
            .catch((error) => {
                console.log(`error`, error)
            })
            .finally(() => {
                console.log(`finally`)
            })
    }, [wallet, notify, connection]);

    return (
        <Button
            variant="outlined"
            color="secondary"
            size="large"
            fullWidth
            onClick={onClick}
            disabled={!wallet.publicKey}
            className={classes.swapbutton}
        >
            Swap(raydium)
        </Button>
    );
};

export default SendTransaction;