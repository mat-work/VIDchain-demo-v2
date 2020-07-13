import { Injectable, Logger, HttpStatus, HttpException } from "@nestjs/common";
import * as vidchainBackend from "../api/vidchainBackend";
import {
  Presentation,
  MsgPresentationReady,
  CredentialData,
} from "../interfaces/dtos";
import { decodeJWT, strB64dec } from "../utils/Util";
import * as config from "../config";

@Injectable()
export class PresentationsService {
  private readonly logger = new Logger(PresentationsService.name);
  private credentialTypeRequested;

  async handlePresentation(body: MsgPresentationReady): Promise<any> {
    try {
      this.logger.debug("Presentation ready");
      const token = await vidchainBackend.getAuthzToken();
      const presentation: Presentation = await vidchainBackend.retrievePresentation(
        token,
        body.url
      );
      this.logger.debug(
        "Presentation retrieved: " + JSON.stringify(presentation)
      );

      const validation: boolean = await this.validatePresentation(
        token,
        presentation
      );
      if (validation) {
        return presentation;
      }
      return validation;
      //The generation of a credential is not necessary in this scenario
      /*if(validation){
               const response = await this.generateCredential(token, presentation);
               return response;
            }
            else{
                this.throwErrorMessage("Error while validation the VP");
            }*/
    } catch (e) {
      this.throwErrorMessage("Error while creating the VC");
    }
  }

  async handleRequest(body: MsgPresentationReady): Promise<any> {
    this.logger.debug("handling vp request...");
    this.logger.debug(JSON.parse(JSON.stringify(body)).type);
    this.credentialTypeRequested = JSON.parse(JSON.stringify(body)).type;
    const token = await vidchainBackend.getAuthzToken();
    const response = await vidchainBackend.requestVP(
      token,
      JSON.parse(JSON.stringify(body))
    );
    this.logger.debug("requestVP response:");
    this.logger.debug(response);
  }

  async validatePresentation(token: string, presentation: Presentation) {
    const dataDecoded = strB64dec(presentation.data.base64);
    this.logger.debug("Data decoded: " + JSON.stringify(dataDecoded));
    let validation = false;
    // TESTING: avoid checking the credential type here so we can authenticate presenting any type of credential
    // let credentialType = await this.validateCredentialType(dataDecoded);
    const credentialType = true;
    if (credentialType) {
      validation = await vidchainBackend.validateVP(token, dataDecoded);
      this.logger.debug("Validation of VP: " + validation);
    }
    return validation;
  }

  //This validation is done as an extra layer of security (May be removed)
  //This should be checked by VIDChain API (TODO) + the app should only present the kind of credential requested as an option
  async validateCredentialType(dataDecoded: any) {
    const JSONdata = JSON.parse(JSON.stringify(dataDecoded));
    let jwtObject = JSON.stringify(JSONdata.verifiableCredential);
    jwtObject = jwtObject.substring(
      jwtObject.lastIndexOf("[") + 1,
      jwtObject.lastIndexOf("]")
    );
    jwtObject = jwtObject.substring(1, jwtObject.length - 1);
    const jwt = await decodeJWT(jwtObject);
    const credentialType = JSON.stringify(jwt.vc.type);
    this.logger.debug("Type of credential provided:" + credentialType);
    this.logger.debug(
      "Type of credential requested:" +
        JSON.stringify(this.credentialTypeRequested[0])
    );
    let typeValidation = false;
    if (credentialType === JSON.stringify(this.credentialTypeRequested[0])) {
      this.logger.debug(
        "Good! The credential presented is the same as requested."
      );
      typeValidation = true;
    } else {
      this.logger.debug(
        "The credential presented is a different kind from requested."
      );
    }
    return typeValidation;
  }

  async generateCredential(token: string, presentation: Presentation) {
    const serviceName = presentation.name.split(": Verifiable")[0];
    const userDID = presentation.name.split(" by ")[1];
    const credential: CredentialData = {
      type: ["VerifiableCredential", "ServiceCredential"],
      issuer: config.DID,
      id: "https://example.com/credential/2390",
      credentialSubject: {
        id: userDID,
        name: serviceName.replace(": Verifiable", ""),
        startAt: Math.floor(Date.now() / 1000),
        expiresAt: Math.floor(Date.now() / 1000) + Math.floor(31104000), //1 year
      },
    };
    const response = await vidchainBackend.generateVerifiableCredential(
      token,
      credential
    );
    this.logger.debug("Credential created:" + response);
    return response;
  }

  throwErrorMessage(message: string) {
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
