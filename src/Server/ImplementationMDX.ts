import { serialize } from "next-mdx-remote/serialize";

export function serializeMDX(content: string) {
	return serialize(content, {
		parseFrontmatter: false,
		blockJS: false,
	});
}
