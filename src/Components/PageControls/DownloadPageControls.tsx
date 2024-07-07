import { useRouter } from "next/router";
import React, { useMemo } from "react";

import { Link } from "Components";
import { Checkbox } from "Components/Checkbox";
import { HyperLink, ResultDownloadPage } from "Server/ResultTypes";
import { useUiStore } from "Stores";

import { SelectDropdown } from "../SelectDropdown";
import { PageControlStyles } from "./PageControlStyles";

type Props = React.PropsWithChildren<Pick<ResultDownloadPage, "releases">>;

const DownloadPageControls = ({ children, releases }: Props) => {
	const router = useRouter();
	const { showAllPlatforms, toggleShowAllPlatforms } = useUiStore();
	const path = router.asPath.split("?")[0];
	const split = path.split("/");
	const kind: string = split?.[1] ?? "";
	const ref: string = split?.[2] ?? "";

	const rootUrl: string = `/${kind}/${ref}`;

	const downloadLinks: HyperLink[] = useMemo(
		() =>
			releases?.map((release) => {
				return {
					label: release.tag_name,
					href: `/download/${release.tag_name}`,
				};
			}) ?? [],
		[releases],
	);

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
				<Checkbox
					name="show-all-platforms"
					label="Show All Platforms"
					checked={showAllPlatforms}
					onClick={toggleShowAllPlatforms}
				/>
				<div className="spacer" />
				<Link href="//github.com/chalet-org/chalet/releases">All releases</Link>
			</div>
			{children}
		</PageControlStyles>
	);
};

export { DownloadPageControls };
