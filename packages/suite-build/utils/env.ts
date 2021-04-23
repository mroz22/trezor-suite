const { NODE_ENV, ANALYZE, LAUNCH_ELECTRON, ASSET_PREFIX } = process.env;

const environment = NODE_ENV === 'production' ? 'production' : 'development';
const isDev = environment === 'development';
const isAnalyzing = ANALYZE === 'true';
const launchElectron = LAUNCH_ELECTRON === 'true';
const assetPrefix = ASSET_PREFIX || '';

export { environment, isAnalyzing, isDev, launchElectron, assetPrefix };
