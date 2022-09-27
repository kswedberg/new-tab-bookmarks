import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import {signAddon} from 'sign-addon';
import {isCliCall} from './is-cli-call.mjs';

dotenv.config();

const rootDir = process.cwd();
const pkgText = fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8');
const pkg = JSON.parse(pkgText);
const {version} = pkg;
const downloadDir = path.join(rootDir, 'dist');

const settings = {
  // Required arguments:
  xpiPath: path.join(downloadDir, 'firefox.xpi'),
  version,
  apiKey: process.env.FF_API_KEY,
  apiSecret: process.env.FF_API_SECRET,

  // Optional arguments:

  // Save downloaded files to this directory.
  // Default: current working directory.
  downloadDir,

  // The explicit extension ID.
  // WebExtensions do not require an ID.
  id: process.env.FF_ID,

  // The release channel (listed or unlisted).
  // Ignored for new add-ons, which are always unlisted.
  // Default: most recently used channel.
  channel: undefined,

  // Number of milleseconds to wait before aborting the request.
  // Default: 2 minutes.
  timeout: undefined,
  // Optional proxy to use for all API requests,
  // such as "http://yourproxy:6000"
  // Read this for details on how proxy requests work:
  // https://github.com/request/request#proxies
  apiProxy: undefined,
  // Optional object to pass to request() for additional configuration.
  // Some properties such as 'url' cannot be defined here.
  // Available options:
  // https://github.com/request/request#requestoptions-callback
  apiRequestConfig: undefined,
  // Optional override to the number of seconds until the JWT token for
  // the API request expires. This must match the expiration time that
  // the API server accepts.
  apiJwtExpiresIn: undefined,
  // Optional override to the URL prefix of the signing API.
  // The production instance of the API will be used by default.
  apiUrlPrefix: 'https://addons.mozilla.org/api/v4',
};

const ffSign = async() => {
  if (!process.env.FF_API_KEY || !process.env.FF_API_SECRET) {
    console.error('Skipping Firefox extension signing.');

    return console.error('To sign, include the FF_API_KEY and FF_API_SECRET environment variables in .env');
  }
  try {
    const result = await signAddon(settings);

    if (result.success) {
      console.log('The following signed files were downloaded:');
      console.log(result.downloadedFiles);
      console.log('Your extension ID is:');
      console.log(result.id);
    } else {
      console.error('Your add-on could not be signed!');
      console.error(`Error code: ${result.errorCode}`);
      console.error(`Details: ${result.errorDetails}`);
    }
    console.log(result.success ? 'SUCCESS' : 'FAIL');

  } catch (err) {
    console.error('Signing error:', err);
  }
};

if (isCliCall(import.meta)) {
  ffSign();
}
