import { input } from '@inquirer/prompts';
import { hash } from 'bcrypt';

export async function bcrypt_hash() {
  const password = await input({
    required: true,
    message: 'Password ?',
  });

  let salt: number | string = await input({
    message: 'Salt ? (or round)',
    required: true,
  });
  if (!salt.startsWith('$')) {
    salt = parseInt(salt);
  }

  const hashed = await hash(password, salt);
  return hashed;
}

if (process.argv[1] === __filename) {
  bcrypt_hash().then(console.log).catch(console.error);
}
