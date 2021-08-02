import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip, gunzip, Gzip } from "zlib";

import { Optional } from "@andrew-r-king/react-kitchen";

import { isDevelopment } from "Server/IsDevelopment";
import { getPagesCache } from "Server/MarkdownCache";
import { ApiReq, ApiRes } from "Utility";

const gunzipPromise = (sm: Buffer) =>
	new Promise((resolve, reject) => {
		gunzip(sm, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});

let sitemap: Optional<Buffer> = null;

const handler = async (req: ApiReq, res: ApiRes<any>) => {
	try {
		res.setHeader("Content-Type", "application/xml");

		// if (!!sitemap && !isDevelopment) {
		if (!!sitemap) {
			const result = await gunzipPromise(sitemap);
			res.send(result);

			// TODO: Test this in prod, might just need to send the buffer w/ gzip header
			// res.send(sitemap);
			return;
		}

		res.setHeader("Content-Encoding", "gzip");

		const smStream: SitemapStream = new SitemapStream({
			hostname: `https://${req.headers.host}`,
		});
		const pipeline: Gzip = smStream.pipe(createGzip());

		const pages = await getPagesCache();
		pages.forEach(({ url }) => {
			smStream.write({
				url,
				changefreq: "weekly",
				priority: 0.7,
			});
		});

		// smStream.write({ url: "/page-1/", changefreq: "daily", priority: 0.3 });
		// smStream.write({ url: "/page-2/", changefreq: "monthly", priority: 0.7 });
		// smStream.write({ url: "/page-3/" }); // changefreq: 'weekly',  priority: 0.5
		// smStream.write({ url: "/page-4/", img: "http://urlTest.com" });

		streamToPromise(pipeline).then((sm: Buffer) => (sitemap = sm));

		smStream.end();

		pipeline.pipe(res).on("error", (err) => {
			throw err;
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			...err,
		});
	}
};

export default handler;
