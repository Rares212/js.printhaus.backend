import { Readable } from 'stream';

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        stream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        stream.on('error', (err) => {
            reject(err);
        });
    });
}
