import { resolveStaticPath } from '@suite-utils/nextjs';

export const FETCH_CONFIG_SUCCESS = '@message-system/fetch-config-success';
export const FETCH_CONFIG_SUCCESS_UPDATE = '@message-system/fetch-config-success-update';
export const FETCH_CONFIG_ERROR = '@message-system/fetch-config-error';

export const SAVE_VALID_MESSAGES = '@message-system/save-valid-messages';
export const DISMISS_MESSAGE = '@message-system/dismiss-message';

// every 6 hours the message system config should be fetched
export const FETCH_INTERVAL = 21600000; // in milliseconds
// every 10 minutes the message system fetching interval should be checked
export const FETCH_CHECK_INTERVAL = 600000; // in milliseconds

/*
 * Bump version in case the new version of message system is not backward compatible.
 * Have to be in sync with version in 'suite-data' package in message-system index file.
 */
export const VERSION = 1;

export const CONFIG_URL_REMOTE = process.env.STABLE_CONFIG
    ? `https://data.trezor.io/config/stable/config.v${VERSION}.jws`
    : `https://data.trezor.io/config/develop/config.v${VERSION}.jws`;

export const CONFIG_URL_LOCAL = resolveStaticPath(`message-system/config.v${VERSION}.jws`);
