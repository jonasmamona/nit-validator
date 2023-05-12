import { Either, makeLeft, makeRight } from "../helper/either-monad";

type ValidationError = "TooShort" | "TooLong" | "InvalidFormat" | "InvalidRange";

type ValidationResult = {
  nit: string;
  verificationDigit: string;
};

function convertValidationErrorToHelpText(error: ValidationError): string {
  switch (error) {
    case "InvalidFormat":
      return "El NIT debe tener un formato válido";
    case "TooLong":
      return "El NIT debe tener máximo 10 dígitos";
    default:
      return "Error desconocido";
  }
}

function assembleErrorString(errors: ValidationError[]): string {
  return errors.map(convertValidationErrorToHelpText).join(", ");
}

function calculateNITVerificationDigit(
  nit: string
): Either<ValidationError[], ValidationResult> {
  const nitRegex = /^[0-9]{1,13}-?[0-9]$/;
  const nitDigits = nit.replace(/-/g, "");

  let errors: ValidationError[] = [];

  if(length > 13) {
    errors.push("TooLong");
  }

  if (!nitRegex.test(nit)) {
    errors.push("InvalidFormat");
  }

  let rangeMin = 0;
  let rangeMax = 0;

  // determine range and number of digits based on type of identification
  if (nitDigits.length <= 8 && parseInt(nitDigits) <= 99999999) {
    rangeMin = 1;
    rangeMax = 99999999;
  } else if (nitDigits.length <= 9 && parseInt(nitDigits) >= 700000001 && parseInt(nitDigits) <= 799999999) {
    rangeMin = 700000001;
    rangeMax = 799999999;
  } else if (nitDigits.length <= 9 && parseInt(nitDigits) >= 600000001 && parseInt(nitDigits) <= 799999999) {
    rangeMin = 600000001;
    rangeMax = 799999999;
  } else if (nitDigits.length <= 13 && parseInt(nitDigits) >= 1000000000) {
    rangeMin = parseInt(nitDigits);
    rangeMax = parseInt(nitDigits);
  } else {
    errors.push("InvalidFormat");
  }

  if (rangeMin > 0 && rangeMax > 0 && parseInt(nitDigits) < rangeMin || parseInt(nitDigits) > rangeMax) {
    errors.push("InvalidFormat");
  }

  if (errors.length > 0) {
    return makeLeft(Array.from(new Set(errors)));
  }

  const nitArray = nitDigits.split("").map(Number);
  const weights = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3];
  let sum = 0;

  for (let i = 0; i < nitArray.length; i++) {
    sum += nitArray[i] * weights[i];
  }

  const mod = sum % 11;
  const verificationDigit = mod === 0 || mod === 1 ? 0 : 11 - mod;

  return makeRight({
    nit,
    verificationDigit: verificationDigit.toString(),
  });
}

export { calculateNITVerificationDigit, assembleErrorString };
export type { ValidationError, ValidationResult };
