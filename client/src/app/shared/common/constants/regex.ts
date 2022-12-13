export const RegexEnum = {
    textFeild: '^[a-z A-Z]*$',
    phone: '^[0-9]{10}$',
    userNameWithSpecial: '^[a-zA-Z0-9]*$',
    amount: '^([0-9]+(.[0-9]+)?)',
    numeric: '^[0-9]*.?[0-9]+$',
    alpha_spaces: '^[a-zA-Z ]+$',
    textField_Spaces: '^[A-Z0-9]+$',
    email: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
    mobile: '^[1-9][0-9]{9}$',
    url: '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?',
    httpUrl:
      /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
    zipcode: '^[0-9]{5}(?:-[0-9]{4})?$',
    passwordValidation:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!])[a-zA-Z0-9@$!]{8,}$',
    chatTime: /^(0[0-9]|1[0-2]):[0-5][0-9]([ ])(AM|PM)$/
  };
  