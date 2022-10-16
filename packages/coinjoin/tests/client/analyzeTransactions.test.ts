import { networks } from '@trezor/utxo-lib';

import { analyzeTransactions } from '../../src/client/phase/analyzeTransactions';
import { createServer, Server } from '../mocks/server';

let server: Server | undefined;

const genTx = (vin: any[], vout: any[]) => {
    const r = v => ({
        addresses: [v.address],
        value: v.value,
        isAccountOwned: v.isAccountOwned,
    });

    return {
        details: {
            vin: vin.map(r),
            vout: vout.map(r),
        },
    } as any;
};

describe('analyzeTransactions', () => {
    beforeAll(async () => {
        server = await createServer();
    });

    beforeEach(() => {
        server?.removeAllListeners('test-request');
    });

    afterAll(() => {
        if (server) server.close();
    });

    it('payment-request', async () => {
        const response = await analyzeTransactions(
            [genTx([{ address: 'a', value: 1 }], [{ address: 'b', value: 1 }])],
            {
                ...server?.requestOptions,
                network: networks.regtest,
            },
        );
        expect(response).toMatchObject({
            transactionData: {
                paymentRequest: {
                    recipient_name: 'trezor.io',
                    signature: 'AA',
                },
            },
        });
    });
});
