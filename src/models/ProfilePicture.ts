import { Identifiable } from "../database/Identifyable";
import { Md5Hash } from "../utils/base64img";

export interface ProfilePicture extends Identifiable {
  base64: string,
  checksum: Md5Hash,
  employeeId: number,
};
