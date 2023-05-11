import { Either, makeLeft, makeRight } from "../helper/either-monad";

type ValidationError = "TooShort" | "InvalidFormat";

type ValidationResult = {
  nit: string;
  verificationDigit: string;
};

function convertValidationErrorToHelpText(error: ValidationError): string {
  switch (error) {
    case "TooShort":
      return "El NIT debe tener al menos 8 dígitos";
    case "InvalidFormat":
      return "El NIT debe tener un formato válido";
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
  const nitRegex = /^[0-9]{8,10}-?[0-9]$/;
  const nitDigits = nit.replace(/-/g, "");

  let errors: ValidationError[] = [];

  if (nitDigits.length < 8) {
    errors.push("TooShort");
  }

  if (!nitRegex.test(nit)) {
    errors.push("InvalidFormat");
  }

  if (errors.length > 0) {
    return makeLeft(errors);
  }

  const nitArray = nitDigits.split("").map(Number);
  const weights = [41, 37, 29, 23, 19, 17, 13, 7, 3];
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
