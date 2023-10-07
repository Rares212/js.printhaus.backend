import { v4 as uuidv4 } from 'uuid';

export class FileUtil {
    static generateFileKey(filename: string): string {
      return `${uuidv4()}/${filename}`;
    }
}