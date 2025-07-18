import { LANGUAGE_TO_FLAG } from "../constants/index.js";

export default function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return `https://flagcdn.com/24x18/${countryCode}.png`;
  }
  return null;
}