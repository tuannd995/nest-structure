import { existsSync, mkdirSync, unlinkSync, writeFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const createUploadFolder = () => {
  const dir = './uploads';
  try {
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
  } catch (error) {
    console.error(error);
  }
};

export const convertAvatarToPath = (avatar: string) => {
  const base64Data = avatar.replace(
    /^data:image\/(jpe?g|png|gif|bmp);base64,/,
    '',
  );
  const regexFileExtension = /((jpe?g|png|gif|bmp))/gm;
  const fileExtension = avatar.match(regexFileExtension)[0];
  const filePath = `/uploads/${uuidv4()}.${fileExtension}`;

  writeFile(`.${filePath}`, base64Data, 'base64', function (err) {
    console.log(err);
  });
  return filePath;
};

export const removeImageInServer = (path) => {
  try {
    if (existsSync(`.${path}`)) {
      unlinkSync(`.${path}`);
    }
  } catch (err) {
    console.error(err);
  }
};
//generate pass
export const generatePassword = () => {
  const length = 6;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};
