import { AbstractControl, ValidationErrors } from "@angular/forms";

// Maximum size: 10MB
export const maxFileSize = 10 * 1024 * 1024;

// Valid types: Valid formats: .png, .jpg, .jpeg and .svg
export const validFileTypes = [
  'image/jpeg',
  'image/png',
  'application/octet-stream',
];


// : ValidationErrors | null
export const validatorFile = (control: AbstractControl): ValidationErrors | null => {
  const file = control.value;
  if (!file) return null;
  const { name, type, size } = file;

  const conditionType =
    !validFileTypes.includes(type) ||
    !/jpg$|jpeg$|png$|svg$/g.test(name.toLowerCase());
  const conditionSize = size > maxFileSize || size <= 0;

  if (conditionType)
    return { invalidFormat: 'Valid formats: .png, .jpg, .jpeg and .svg' };
  if (conditionSize) return { invalidSize: 'Maximum size: 10MB' };
  return null;
}
