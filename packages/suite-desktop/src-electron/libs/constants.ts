export const PROTOCOL = 'file';

// General modules (both dev & prod)
export const MODULES = [
    // Event Logging
    'event-logging/process',
    'event-logging/app',
    'event-logging/contents',
    // Standard modules
    'crash-recover',
    'menu',
    'shortcuts',
    'request-filter',
    'external-links',
    'window-controls',
    'http-receiver',
    'metadata',
    'bridge',
    'tor',
    'analytics',
    'auto-updater',
];

// Modules only used in prod mode
export const MODULES_PROD = ['csp', 'file-protocol'];

// Modules only used in dev mode
export const MODULES_DEV = ['dev-tools'];
