import { createSelector } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

import { selectAccounts, selectCoins } from '@suite-common/wallet-core';
import { Account } from '@suite-common/wallet-types';
import { networksCompatibility, NetworkSymbol } from '@suite-common/wallet-config';
import { toFiatCurrency } from '@suite-common/wallet-utils';
import { selectFiatCurrency } from '@suite-native/module-settings';

type Assets = Record<string, Account[]>;

interface AssetType {
    symbol: NetworkSymbol;
    network: NetworkSymbol;
    assetBalance: BigNumber;
    assetFailed: boolean;
    fiatBalance: string;
}

export const selectAssets = createSelector(selectAccounts, accounts => {
    const assets: Assets = {};
    accounts.forEach(account => {
        if (!assets[account.symbol]) {
            assets[account.symbol] = [];
        }
        assets[account.symbol].push(account);
    });
    return assets;
});

export const selectNetworks = createSelector(selectAssets, assets => Object.keys(assets));

export const selectAssetsData = createSelector(
    [selectNetworks, selectAssets, selectCoins, selectFiatCurrency],
    (networks, assets, coins, fiatCurrency): AssetType[] =>
        networks
            .map(symbol => {
                const network = networksCompatibility.find(
                    n => n.symbol === symbol && !n.accountType,
                );
                if (!network) {
                    console.error('unknown network');
                    return;
                }

                const currentFiatRates = coins.find(
                    f => f.symbol.toLowerCase() === symbol.toLowerCase(),
                )?.current;

                const assetBalance = assets[symbol].reduce(
                    (prev, account) => prev.plus(account.formattedBalance),
                    new BigNumber(0),
                );
                const fiatBalance = toFiatCurrency(
                    assetBalance.toString(),
                    fiatCurrency.label,
                    currentFiatRates?.rates,
                );

                return {
                    symbol,
                    network,
                    assetBalance,
                    fiatBalance: fiatBalance ?? 0,
                };
            })
            .filter(data => data !== undefined) as unknown as AssetType[],
);
