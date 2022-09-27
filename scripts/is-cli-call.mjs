import path from 'path';
import process from 'process';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';

/**
 * @function isCliCall
 * @description Indicates whether the file was called from the command line
 * @param {Object} meta The module's meta information. Typically would pass `import.meta` as the argument
 * @returns {Boolean} Whether the file was called from the command line
 */
export const isCliCall = (meta) => {
  const argv1 = process.argv && process.argv[1];

  if (!meta || !argv1) {
    return false;
  }
  const require = createRequire(meta.url);
  const argvPath = require.resolve(argv1);
  const argvExt = path.extname(argvPath);

  const metaPath = fileURLToPath(meta.url);
  const metaExt = path.extname(metaPath);

  if (argvExt) {
    return argvPath === metaPath;
  }

  return argvPath === metaPath.slice(0, -metaExt.length);
};
