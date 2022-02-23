import React, { useMemo } from "react";
import styled from "styled-components";

import { Optional } from "@andrew-r-king/react-kitchen";

import { Link, TabbedContent } from "Components";
import { GithubAsset, GithubRelease } from "Server/ChaletReleases";
import { getThemeVariable } from "Theme";

type DeducedInfo = {
	asset: GithubAsset;
	arch: string;
	platform: string;
	abi: string;
	filetype: "zip" | "installer";
};

const getPlatformArchFromFilename = (asset: GithubAsset): Optional<DeducedInfo> => {
	const triple = asset.name
		.replace(/chalet\-([\w\-_]+)\.zip/g, (result: string, p1: string) => p1)
		.replace(/pc-windows/g, "windows")
		.replace(/-installer/g, "")
		.split("-");

	// console.log(triple);

	if (triple.length !== 3) {
		console.log("excluded:", asset);
		return null;
	}

	const [arch, platform, abi] = triple;

	return {
		asset,
		arch,
		platform,
		abi,
		filetype: asset.name.includes("-installer") ? "installer" : "zip",
	};
};

type Props = Pick<GithubRelease, "assets" | "zipball_url" | "tarball_url">;

const ReleaseAssets = ({ assets, zipball_url, tarball_url }: Props) => {
	const info = useMemo(
		() =>
			assets.map((asset) => getPlatformArchFromFilename(asset)).filter((data) => data !== null) as DeducedInfo[],
		[assets]
	);
	const windows = info.filter((data) => data.platform === "windows");
	const macos = info.filter((data) => data.platform === "apple");
	const linux = info.filter((data) => data.platform === "linux");

	return (
		<Styles>
			<TabbedContent>
				{windows.length > 0 && <button>Windows</button>}
				{windows.length > 0 && (
					<div className="tab-content">
						<AssetBlockWrapper>
							{windows.map((data, i) => {
								// const { arch, platform, filetype } = data;
								const { browser_download_url, name } = data.asset;
								return (
									<AssetBlock key={i}>
										{/* <span>{arch}</span>
										<span>{platform}</span>
										<span>{filetype}</span> */}
										<Link href={browser_download_url}>{name}</Link>
									</AssetBlock>
								);
							})}
						</AssetBlockWrapper>
					</div>
				)}
				{windows.length > 0 && <button>MacOS</button>}
				{windows.length > 0 && (
					<div className="tab-content">
						<AssetBlockWrapper>
							{macos.map((data, i) => {
								// const { arch, platform, filetype } = data;
								const { browser_download_url, name } = data.asset;
								return (
									<AssetBlock key={i}>
										{/* <span>{arch}</span>
										<span>{platform}</span>
										<span>{filetype}</span> */}
										<Link href={browser_download_url}>{name}</Link>
									</AssetBlock>
								);
							})}
						</AssetBlockWrapper>
					</div>
				)}
				{windows.length > 0 && <button>Linux</button>}
				{windows.length > 0 && (
					<div className="tab-content">
						<AssetBlockWrapper>
							{linux.map((data, i) => {
								// const { arch, platform, filetype } = data;
								const { browser_download_url, name } = data.asset;
								return (
									<AssetBlock key={i}>
										{/* <span>{arch}</span>
										<span>{platform}</span>
										<span>{filetype}</span> */}
										<Link href={browser_download_url}>{name}</Link>
									</AssetBlock>
								);
							})}
						</AssetBlockWrapper>
					</div>
				)}
				<button>Source</button>
				<div className="tab-content">
					<AssetBlockWrapper>
						<AssetBlock>
							<Link href={zipball_url}>Source Code (zip)</Link>
						</AssetBlock>
						<AssetBlock>
							<Link href={tarball_url}>Source Code (tar.gz)</Link>
						</AssetBlock>
					</AssetBlockWrapper>
				</div>
			</TabbedContent>
		</Styles>
	);
};

export { ReleaseAssets };

const Styles = styled.div`
	display: block;
`;

const AssetBlockWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const AssetBlock = styled.div`
	display: block;
	width: 100%;
	color: ${getThemeVariable("mainText")};
	border: 0.0675rem solid ${getThemeVariable("mainText")};
	padding: 1rem;
	border-radius: 0.5rem;
	margin-bottom: 1rem;
`;
