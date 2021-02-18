const { NODE_ENV, ANALYZE, LAUNCH_ELECTRON, ASSET_PREFIX } = process.env;

const ALLOWED = ['development', 'production'] as const;
const DEFAULT = ALLOWED[0]; // development

const env = NODE_ENV as typeof ALLOWED[number];
const environment = NODE_ENV !== undefined && ALLOWED.includes(env) ? env : DEFAULT;
const isDev = environment === 'development';
const isAnalyzing = ANALYZE === 'true';
const launchElectron = LAUNCH_ELECTRON === 'true';
const assetPrefix = ASSET_PREFIX || '';

export { environment, isAnalyzing, isDev, launchElectron, assetPrefix };
