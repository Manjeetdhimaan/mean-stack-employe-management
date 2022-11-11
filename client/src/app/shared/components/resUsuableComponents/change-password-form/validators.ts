import { FormGroup, ValidationErrors } from '@angular/forms';

export function matchingInputsValidator(firstKey: string, secondKey: string) {
  return function (group: FormGroup): ValidationErrors | undefined {
    if (group.controls[firstKey].value !== group.controls[secondKey].value) {
      console.log('missmatch', group.controls[firstKey].value)
      return {
        'missmatch': true
      };
    }
  };
}
