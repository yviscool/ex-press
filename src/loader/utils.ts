import { extname } from 'path';
import * as fs from 'fs';
import * as BuiltinModule from 'module';

// Guard against poorly mocked module constructors.
const Module = module.constructor.length > 1
  ? module.constructor
  /* istanbul ignore next */
  : BuiltinModule;

export function resolveModule(filepath) {
  let fullPath;

  try {
    fullPath = require.resolve(filepath);
  } catch (e) {
    return undefined;
  }

  if (process.env.EXPRESS_TYPESCRIPT !== 'true' && fullPath.endsWith('.ts')) {
    return undefined;
  }

  return fullPath;
}

export function requireFile(filepath) {
  try {
    // if not js module, just return content buffer
    const extName = extname(filepath);

    if (extName && !Module._extensions[extName]) {
      return fs.readFileSync(filepath);
    }
    // require js module
    const obj = require(filepath);

    if (!obj) return obj;
    // it's es module
    if (obj.__esModule) return 'default' in obj ? obj.default : obj;
    return obj;
  } catch (err) {
    err.message = `[ex-press] load file: ${filepath}, error: ${err.message}`;
    throw err;
  }
}
