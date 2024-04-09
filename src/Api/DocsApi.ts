import { ResultSearchResults } from "Server/ResultTypes";
import { ContactEmailOptions } from "Server/InputTypes";

import { BaseApi } from "./BaseApi";

class DocsApi extends BaseApi {
	constructor() {
		super(`${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000/api"}`, {
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN ?? ""}`,
			},
		});
	}

	searchMarkdown = async (search: string): Promise<ResultSearchResults> => {
		if (search.length >= 3) {
			const result = await this.GET<ResultSearchResults>(`/search-markdown?search=${encodeURIComponent(search)}`);
			return result ?? [];
		} else {
			return [];
		}
	};

	sendContactEmail = async (options: Partial<ContactEmailOptions>): Promise<void> => {
		try {
			await this.POST("/send-contact-email", options);
		} catch (err: any) {
			console.error(err.message);
			throw new Error("Bad request");
		}
	};
}

const docsApi = new DocsApi();

export { docsApi };
