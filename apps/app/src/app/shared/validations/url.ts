import { AbstractControl, ValidationErrors } from "@angular/forms";

export const validatorUrl = (control: AbstractControl): ValidationErrors | null => {
  const input = control.value;
  if (!input) return null;

  const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
  const isUrl = regex.test(input);

  if (!isUrl)
    return { invalidUrl: 'Input must be a valid url starting with "http://" or "https://"' };

  return null;
};
