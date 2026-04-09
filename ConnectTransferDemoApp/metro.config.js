const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');
const defaultConfig = getDefaultConfig(projectRoot);

module.exports = mergeConfig(defaultConfig, {
	watchFolders: [workspaceRoot],
	resolver: {
		sourceExts: Array.from(new Set([...defaultConfig.resolver.sourceExts, 'cjs'])),
		unstable_enableSymlinks: true,
		nodeModulesPaths: [
			path.resolve(projectRoot, 'node_modules'),
			path.resolve(workspaceRoot, 'node_modules')
		],
		extraNodeModules: {
			'connect-transfer-react-native-sdk': workspaceRoot
		}
	}
});
