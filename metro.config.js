const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add the GLSL file extension to both assetExts and sourceExts
config.resolver.assetExts.push('glsl');
config.resolver.sourceExts.push('glsl');

module.exports = config;