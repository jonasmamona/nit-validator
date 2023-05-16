import { Either, makeLeft, makeRight } from "../helper/either-monad";

type ValidationError =
  | "TooShort"
  | "TooLong"
  | "InvalidFormat"
  | "InvalidRange";

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

function addZeroesToLeft(nit: string): string {
  if (nit.length < 15) {
    return addZeroesToLeft("0" + nit);
  } else {
    return nit;
  }
}

function calculateNITVerificationDigit(
  nit: string
): Either<ValidationError[], ValidationResult> {
  const nitRegex = /^[0-9]{1,13}-?[0-9]$/;

  let errors: ValidationError[] = [];

  if (nit.length > 12) {
    errors.push("TooLong");
  }

  if (!nitRegex.test(nit)) {
    errors.push("InvalidFormat");
  }

  if (errors.length > 0) {
    return makeLeft(Array.from(new Set(errors)));
  }

  const nitArray = addZeroesToLeft(nit.replace("-", "")).split("").map(Number);

  const nitWeights = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3];

  let sum = 0;

  for (let i = 0; i < nitArray.length; i++) {
    sum += nitArray[i] * nitWeights[i];
  }

  let verificationDigit = 11 - (sum % 11);

  if (verificationDigit == 11) {
    verificationDigit = 0;
  }

  return makeRight({
    nit,
    verificationDigit: verificationDigit.toString(),
  });
}

export { calculateNITVerificationDigit, assembleErrorString };
export type { ValidationError, ValidationResult };
