import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import { ENV } from '../config/env';
import { ethers } from 'ethers';

export function generateOTP() {
  const OTP = otpGenerator.generate(5, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return OTP;
}

export async function sendMail(params: {
  to: string;
  otp: string;
  service: string;
  name: string;
}) {
  try {
    const { to, otp, service, name } = params;
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: ENV.MAIL_EMAIL,
        pass: ENV.MAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: testAccount.user,
      to,
      subject: `Marcel - ${service} using OTP`,
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
      <h3>Hi ${name},</h3>
      <h3>Use the OTP ${otp} to ${service}</h3>
      <h3>The code is valid for 15 minutes and can be used only once.</h3>
   </div>
    `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function createEtherInstance(network?: string) {
  let baseUrl;
  switch (network) {
    case 'polygon-mumbai':
      baseUrl = 'https://polygon-mumbai.infura.io/v3';
      break;
    case 'polygon-mainnet':
      baseUrl = 'https://polygon-mainnet.infura.io/v3';
      break;
    case 'goerli':
      baseUrl = 'https://goerli.infura.io/v3';
      break;
    case 'sepolia':
      baseUrl = 'https://sepolia.infura.io/v3';
      break;
    case 'mainnet':
      baseUrl = 'https://mainnet.infura.io/v3';
      break;
    default:
      baseUrl = 'https://ropsten.infura.io/v3';
      break;
  }
  const provider = new ethers.providers.JsonRpcProvider(
    `${baseUrl}/${ENV.INFURA_PROJECT_ID}`,
  );
  return provider;
}

// export function createWeb3Instance(): Web3 {
//   const web3 = new Web3(
//     `https://ropsten.infura.io/v3/${ENV.INFURA_PROJECT_ID}`,
//   );
//   return web3;
// }

export function requirePanic(obj: object, keys: string[]) {
  const missingKeys = validateRequiredKeys(obj, keys);
  if (missingKeys.length > 0) {
    throw new Error('Required keys: ' + missingKeys.join(' ,'));
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateRequiredKeys(obj: any, keys: string[]) {
  const missingKeys = [];
  for (const key of keys) {
    if (obj[key] == undefined || obj[key] == null) {
      missingKeys.push(key);
    }
  }
  return missingKeys;
}

export function apiRoute(path = '/') {
  return `/${[...path.split('/')]
    .filter((pathSegment) => pathSegment)
    .join('/')}`;
}
