import * as jwtDecode from "jwt-decode";
import { decode as atob, encode } from "base-64";
/**
 * Parse a JWT token
 */
function decodeJWT(token) {
  try {
    const tok = jwtDecode(token);
    return tok;
  } catch (Error) {
    return Error;
  }
}

/**
 * Decodes a Base64 string in an UTF-8 string format
 * @param input Base64 encoded string to decode
 */
function strB64dec(input) {
  try {
    return JSON.parse(atob(input));
  } catch (error) {
    return null;
  }
}
// TODO: convert function to const
/*const strB64dec = (input: string) : JSON | null => {
  try {
    return JSON.parse(atob(input));
  } catch (error) {
    return null;
  }
}*/ 

/**
 * Encoded  a Base64 string in an UTF-8 string format
 * @param input Base64 encoded string to decode
 */
function strB64enc(input) {
  try {
    return encode(JSON.stringify(input));
  } catch (error) {
    return null;
  }
}

function extractVCfromPresentation(credential){
  const dataDecoded = strB64dec(credential.data.base64);
  const JSONdata = JSON.parse(JSON.stringify(dataDecoded));
  let jwtObject = JSON.stringify(JSONdata.verifiableCredential);
  jwtObject = jwtObject.substring(
  jwtObject.lastIndexOf("[") + 1,
  jwtObject.lastIndexOf("]")
  );
  jwtObject = jwtObject.substring(1, jwtObject.length - 1);
  return decodeJWT(jwtObject);
}

export { decodeJWT, strB64dec, strB64enc, extractVCfromPresentation };
