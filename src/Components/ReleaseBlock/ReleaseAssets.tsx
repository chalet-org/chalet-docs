import { useRouter } from "next/router";
import React, { useMemo } from "react";
import styled from "styled-components";

import { Optional } from "@andrew-r-king/react-kitchen";

import { hasMinWidth, Icon } from "Components";
import { GithubAsset, GithubRelease } from "Server/ChaletReleases";
import { useUiStore } from "Stores";
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

const getNiceArchName = (arch: string) => {
	switch (arch) {
		case "x86_64":
			return "64-bit";
		case "arm":
			return "ARM";
		case "universal":
			return "Universal";
	}
	return arch;
};

const iconSize: string = "3.25rem";

type Props = Pick<GithubRelease, "assets" | "zipball_url" | "tarball_url">;

const ReleaseAssets = ({ assets, zipball_url, tarball_url }: Props) => {
	const { theme } = useUiStore();
	const info = useMemo(
		() =>
			assets.map((asset) => getPlatformArchFromFilename(asset)).filter((data) => data !== null) as DeducedInfo[],
		[assets]
	);
	const windows = info.filter((data) => data.platform === "windows");
	const macos = info.filter((data) => data.platform === "apple");
	const linux = info.filter((data) => data.platform === "linux").sort((dataA) => (dataA.arch === "x86_64" ? -1 : 1));

	return (
		<Styles>
			<DownloadContainer>
				{windows.length > 0 && (
					<DownloadRow>
						<Icon id="windows" size={iconSize} color={theme.codeBlue} />
						<DownloadSection>
							{windows.map((data, i) => {
								const { platform, filetype, abi } = data;
								const { browser_download_url, name } = data.asset;
								const arch = getNiceArchName(data.arch);
								return (
									<AssetButton
										key={i}
										onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
										onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
										onClick={(ev) => window.open(browser_download_url)}
										color={theme.codeBlue}
									>
										<div className="main">
											Windows{" "}
											{filetype === "installer" ? "installer (Recommended)" : "archive (.zip)"}
											<br />
											<span>{name}</span>
										</div>
										<div>{arch}</div>
									</AssetButton>
								);
							})}
						</DownloadSection>
					</DownloadRow>
				)}
				{macos.length > 0 && (
					<DownloadRow>
						<Icon id="apple" size={iconSize} color={theme.codeGray} />
						<DownloadSection>
							{macos.map((data, i) => {
								const { platform, filetype, abi } = data;
								const { browser_download_url, name } = data.asset;
								const arch = getNiceArchName(data.arch);
								return (
									<AssetButton
										key={i}
										onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
										onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
										onClick={(ev) => window.open(browser_download_url)}
										color={theme.codeGray}
									>
										<div className="main">
											MacOS archive (.zip)
											<br />
											<span>{name}</span>
										</div>
										<div>
											{arch}
											<br />
											<span>{data.arch === "universal" ? "ARM64 / x86-64" : ""}</span>
										</div>
									</AssetButton>
								);
							})}
						</DownloadSection>
					</DownloadRow>
				)}
				{linux.length > 0 && (
					<DownloadRow>
						<Icon id="linux" size={iconSize} color={theme.codeGreen} />
						<DownloadSection>
							{linux.map((data, i) => {
								const { platform, filetype, abi } = data;
								const { browser_download_url, name } = data.asset;
								const arch = getNiceArchName(data.arch);
								return (
									<AssetButton
										key={i}
										onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
										onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
										onClick={(ev) => window.open(browser_download_url)}
										color={theme.codeGreen}
									>
										<div className="main">
											Linux Archive (.zip)
											<br />
											<span>{name}</span>
										</div>
										<div>{arch}</div>
									</AssetButton>
								);
							})}
						</DownloadSection>
					</DownloadRow>
				)}
				<DownloadRow>
					<Icon id="source" size={iconSize} color={theme.primaryColor} />
					<DownloadSection>
						<AssetButton
							onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
							onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
							onClick={(ev) => window.open(zipball_url)}
							color={theme.primaryColor}
						>
							<div className="main">Source code (.zip)</div>
							<div></div>
						</AssetButton>
						<AssetButton
							onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
							onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
							onClick={(ev) => window.open(tarball_url)}
							color={theme.primaryColor}
						>
							<div className="main">Source code (.tar.gz)</div>
							<div></div>
						</AssetButton>
					</DownloadSection>
				</DownloadRow>
			</DownloadContainer>
		</Styles>
	);
};

export { ReleaseAssets };

const Styles = styled.div`
	display: block;
	padding-bottom: 2rem;
`;

const DownloadContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	width: 100%;
	padding: 1.125rem 1.5rem;
	border: 0.0625rem solid ${getThemeVariable("border")};
	background-color: ${getThemeVariable("background")};
	margin-top: -0.0625rem;
`;

const DownloadRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 0.5rem 0;

	> i {
		display: none;
	}

	@media ${hasMinWidth(0)} {
		> i {
			display: block;
		}
	}
`;

const DownloadSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: left;
	justify-content: left;
	width: 100%;

	@media ${hasMinWidth(0)} {
		padding-left: 1.5rem;
	}
`;

type AssetButtonProps = {
	color: string;
};

const AssetButton = styled.button<AssetButtonProps>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	min-height: 4rem;
	padding: 1rem;
	margin-top: -0.125rem;
	color: ${getThemeVariable("mainText")};
	background-color: transparent;
	border: 0.125rem solid ${getThemeVariable("border")};
	cursor: pointer;
	z-index: 10;

	transition: background-color 0.125s linear, border-color 0.125s linear, color 0.125s linear;

	> div {
		line-height: 1.125;

		&.main {
			font-weight: 600;
			text-align: left;
		}

		&:last-of-type {
			text-align: right;
		}

		> span {
			font-weight: 400;
			font-size: 0.75rem;
		}
	}

	&:hover,
	&.touch-hover {
		color: ${getThemeVariable("background")};
		background-color: ${({ color }) => color};
		border-color: ${({ color }) => color};
		z-index: 11;
	}
`;