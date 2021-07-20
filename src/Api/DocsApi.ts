import { JSONSchema7 } from "json-schema";
import { BaseApi } from "@andrew-r-king/react-kitchen";

export type Greeting = {
	name: string;
};

export type ChaletSchema = {
	schema: JSONSchema7;
};

class DocsApi extends BaseApi {
	constructor() {
		super(`${process.env.API_BASE ?? "http://localhost:3000"}/api`);
	}

	getHello = () => this.GET<Greeting>("/hello");

	getChaletSchema = (version: string = "main") => this.GET<ChaletSchema>(`/chalet-schema/${version}`);
}

const docsApi = new DocsApi();

export { docsApi };
