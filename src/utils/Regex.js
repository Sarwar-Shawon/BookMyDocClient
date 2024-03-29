/*
 * @copyRight by md sarwar hoshen.
 */
export const Regex = {
    emailRegex : /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    passwordRegex : /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})[A-Za-z0-9!@#$%^&*()_+={}[\]:;\"'|<>?./\\~-]*$/,
    uppercaseRegex : /[A-Z]/,
    numericRegex : /[0-9]/,
    specialCharacterRegex : /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
}