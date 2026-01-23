import { PASSWORD_MIN_LENGTH } from "@/config";

export const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;
export const PASSWORD_REGEX = new RegExp(`^(?=.{${PASSWORD_MIN_LENGTH},}$)(?!.*\\s).*$`);