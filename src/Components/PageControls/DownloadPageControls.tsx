import { useRouter } from "next/router";
import React from "react";

import { ResultDownloadPage } from "Server/ResultTypes";

import { SelectDropdown } from "../SelectDropdown";
import { PageControlStyles } from "./PageControlStyles";

type Props = React.PropsWithChildren<Pick<ResultDownloadPage, "downloadLinks">>;

const DownloadPageControls = ({ children, downloadLinks }: Props) => {
	const router = useRouter();
	const path = router.asPath.split("?")[0];
	const split = path.split("/");
	const kind: string = split?.[1] ?? "";
	const ref: string = split?.[2] ?? "";

	const rootUrl: string = `/${kind}/${ref}`;

	return (
		<PageControlStyles>
			<div className="group dropdowns">
				<SelectDropdown
					name="ref-select"
					label="Version"
					defaultValue={rootUrl}
					options={downloadLinks}
					onChange={(value) =>
						router.push(value.href, undefined, {
							scroll: false,
						})
					}
				/>
				<div className="spacer" />
				<div className="spacer" />
			</div>
			{children}
		</PageControlStyles>
	);
};

export { DownloadPageControls };
