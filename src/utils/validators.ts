import { PASSWORD_MIN_LENGTH } from "@/config";

export const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;
export const PASSWORD_REGEX = new RegExp(`^(?=.{${PASSWORD_MIN_LENGTH},}$)(?!.*\\s).*$`);

// allow unicode letters, spaces, hyphen, apostrophe
export const USERNAME_REGEX = /^[\p{L}\p{M} '\-]+$/u;

export const PHONE_REGEX = /^(?:0\d{9}\|+213\d{9})$/;