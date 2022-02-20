import { getPagesCache } from "Server/MarkdownPagesCache";
import { middleware } from "Server/Middleware";
import { serverCache } from "Server/ServerCache";
import { ApiReq, ApiRes } from "Utility";

const handler = middleware.use([], async (req: ApiReq, res: ApiRes<any>) => {
	try {
		const sitemap = await serverCache.get("sitemap.xml", async () => {
			const pages = await getPagesCache();
			const lastmod = new Date().toISOString();
			const pageData = pages.map(({ url }) => ({
				url: `https://${req.headers.host}${url}`,
				lastmod,
				changefreq: "weekly",
				priority: 1.0,
			}));

			const data: string = pageData
				.map((data) => {
					let result = "<url>";
					result += `<loc>${data.url}</loc>`;
					result += `<lastmod>${data.lastmod}</lastmod>`;
					result += `<changefreq>${data.changefreq}</changefreq>`;
					result += `<priority>${data.priority}</priority>`;
					result += "</url>";
					return result;
				})
				.join("");

			return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${data}</urlset>`;
		});
		res.setHeader("Content-Type", "application/xml");
		res.send(sitemap);
		res.end();
	} catch (err: any) {
		console.error(err);
		res.status(500).json({
			...err,
		});
	}
});

export default handler;
