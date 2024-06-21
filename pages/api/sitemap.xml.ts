import { getPagesCache } from "Server/MarkdownPagesCache";
import { middleware } from "Server/Middleware";
import { serverCache } from "Server/ServerCache";
import { ApiReq, ApiRes } from "Utility";

const handler = middleware.use([], async (req: ApiReq, res: ApiRes<any>) => {
	try {
		const cacheLength = 60 * 60 * 24; // 1 day
		const sitemap = await serverCache.get(
			"sitemap.xml",
			async () => {
				const pages = await getPagesCache(true);
				const pageData = pages.map(({ url }) => url);

				const host: string = `https://${req.headers.host}`;
				const lastmod: string = new Date().toISOString();
				const changefreq: string = "weekly";
				const priority: string = (1.0).toFixed(1);

				const data: string = pageData
					.map((url) => {
						let result = "<url>";
						result += `<loc>${host}${url}</loc>`;
						result += `<lastmod>${lastmod}</lastmod>`;
						result += `<changefreq>${changefreq}</changefreq>`;
						result += `<priority>${priority}</priority>`;
						result += "</url>";
						return result;
					})
					.join("");

				return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${data}</urlset>`;
			},
			cacheLength,
		);
		res.setHeader("Content-Type", "application/xml");
		res.status(200).send(sitemap);
	} catch (err: any) {
		console.error(err);
		res.status(500).json({
			...err,
		});
	}
});

export default handler;
