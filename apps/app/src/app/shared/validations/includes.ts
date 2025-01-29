import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const inListValidator = (allowedValues: string[]): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (allowedValues.includes(control.value)) {
      return null;
    } else {
      return { inList: true };
    }
  };
}
