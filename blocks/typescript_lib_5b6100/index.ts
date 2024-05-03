import type { VocanaSDK } from "@vocana/sdk";
import OSS from "ali-oss";
import path from "path"

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ 
  region: string,
  accessKeyId: string,
  accessKeySecret: string,
  bucket: string,
  localfile: string,
 }>;
type Outputs = Readonly<{ url: string }>;

export default async function(inputs: Inputs, context: Context) {
  const client = new OSS({
    region: inputs.region, 
    accessKeyId: inputs.accessKeyId,
    accessKeySecret: inputs.accessKeySecret,
    bucket: inputs.bucket,
    secure: true,
  });
  try {
    const timestampInSeconds = Math.floor(Date.now() / 1000)
    const localfile_name = `${timestampInSeconds}_${path.basename(inputs.localfile)}`;
    const uploadResult = await client.put(localfile_name, inputs.localfile);
    void context.output(uploadResult.url, "url", true);
  } catch (error) {
    console.error('error:', error);
  } finally {
    void context.done();
  }
};