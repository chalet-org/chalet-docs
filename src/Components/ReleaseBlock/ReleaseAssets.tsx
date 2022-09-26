import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";

import { hasMinWidth, Icon } from "Components";
import { OperatingSystem, useOperatingSystem } from "Hooks";
import { GithubAsset, GithubRelease } from "Server/ChaletReleases";
import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";
import { Optional } from "Utility";
import { Panelbear } from "Utility";

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

const getNiceArchName = (arch: string, platform: OperatingSystem) => {
	switch (arch) {
		case "x86_64":
			return platform === OperatingSystem.MacOS ? "Intel 64-bit" : "64-bit";
		case "arm64":
			return platform === OperatingSystem.MacOS ? "M1 ARM64" : "ARM64";
		case "arm":
			return "ARM";
		case "universal":
			return "Universal";
	}
	return arch;
};

const iconSize: string = "3.25rem";

type Props = Pick<GithubRelease, "assets" | "zipball_url" | "tarball_url" | "tag_name">;

const ReleaseAssets = ({ assets, zipball_url, tarball_url, tag_name }: Props) => {
	const { theme, showAllPlatforms } = useUiStore();
	const router = useRouter();
	const info = useMemo(
		() =>
			assets.map((asset) => getPlatformArchFromFilename(asset)).filter((data) => data !== null) as DeducedInfo[],
		[assets]
	);
	const windows = info.filter((data) => data.platform === "windows");
	const macos = info
		.filter((data) => data.platform === "apple")
		.sort((dataA) => 1)
		.sort((dataA) => (dataA.arch === "universal" ? -1 : 1));
	const linux = info
		.filter((data) => data.platform === "linux" && data.abi !== "debian")
		.sort((dataA) => (dataA.arch === "x86_64" ? -1 : 1));
	const debian = info
		.filter((data) => data.platform === "linux" && data.abi === "debian")
		.sort((dataA) => (dataA.arch === "x86_64" ? -1 : 1));
	const [platform] = useOperatingSystem();

	const onDownload = useCallback(
		async (url: string, ...data: string[]) => {
			try {
				Panelbear.trackDownload(`${tag_name}_${data.join("-")}`);
				await router.push(url);
			} catch (err) {
				console.error(err);
			}
		},
		[router, tag_name]
	);

	return (
		<Styles>
			<DownloadContainer>
				{(platform == OperatingSystem.Windows || showAllPlatforms) && windows.length > 0 && (
					<DownloadRow>
						<Icon id="windows" size={iconSize} color={theme.codeBlue} hoverColor={theme.codeBlue} />
						<DownloadSection>
							{windows.map((data, i) => {
								const { platform: dataPlatform, filetype, abi } = data;
								const { browser_download_url, name } = data.asset;
								const arch = getNiceArchName(data.arch, OperatingSystem.Windows);
								const typeLabel = filetype === "installer" ? "installer" : "archive (.zip)";
								const isRecommended =
									platform == OperatingSystem.Windows &&
									filetype === "installer" &&
									data.arch === "x86_64";

								return (
									<AssetButton
										key={i}
										onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
										onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
										onClick={(ev) =>
											onDownload(browser_download_url, data.arch, dataPlatform, abi, filetype)
										}
										color={theme.codeBlue}
									>
										<div className="bold">
											Windows {isRecommended ? `${typeLabel} (Recommended)` : typeLabel}
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
				{(platform == OperatingSystem.MacOS || showAllPlatforms) && macos.length > 0 && (
					<DownloadRow>
						<Icon id="apple" size={iconSize} color={theme.codeGray} hoverColor={theme.codeGray} />
						<DownloadSection>
							{macos.map((data, i) => {
								const { platform: dataPlatform, filetype, abi } = data;
								const { browser_download_url, name } = data.asset;
								const arch = getNiceArchName(data.arch, OperatingSystem.MacOS);
								return (
									<AssetButton
										key={i}
										onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
										onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
										onClick={(ev) =>
											onDownload(browser_download_url, data.arch, dataPlatform, abi, filetype)
										}
										color={theme.codeGray}
									>
										<div className="bold">
											MacOS{" "}
											{platform == OperatingSystem.MacOS && data.arch === "universal"
												? "archive (Recommended)"
												: "archive (.zip)"}
											<br />
											<span>{name}</span>
										</div>
										<div>
											{arch}
											<br />
											<span>{data.arch === "universal" ? "M1 ARM64 / Intel 64-bit" : ""}</span>
										</div>
									</AssetButton>
								);
							})}
						</DownloadSection>
					</DownloadRow>
				)}
				{(platform == OperatingSystem.Linux || showAllPlatforms) && debian.length > 0 && (
					<DownloadRow>
						<Icon id="debian" size={iconSize} color={theme.codeRed} hoverColor={theme.codeRed} />
						<DownloadSection>
							{debian.map((data, i) => {
								const { platform: dataPlatform, filetype, arch: dataArch, abi } = data;
								const { browser_download_url, name } = data.asset;
								const arch = getNiceArchName(data.arch, OperatingSystem.Linux);
								return (
									<AssetButton
										key={i}
										onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
										onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
										onClick={(ev) =>
											onDownload(browser_download_url, data.arch, dataPlatform, abi, filetype)
										}
										color={theme.codeRed}
									>
										<div className="bold">
											{dataArch === "arm" ? "Debian" : "Debian / Ubuntu"} package (.deb / .zip)
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
				{(platform == OperatingSystem.Linux || showAllPlatforms) && linux.length > 0 && (
					<DownloadRow>
						<Icon id="linux" size={iconSize} color={theme.codeGreen} hoverColor={theme.codeGreen} />
						<DownloadSection>
							{linux.map((data, i) => {
								const { platform: dataPlatform, filetype, abi } = data;
								const { browser_download_url, name } = data.asset;
								const arch = getNiceArchName(data.arch, OperatingSystem.Linux);
								return (
									<AssetButton
										key={i}
										onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
										onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
										onClick={(ev) =>
											onDownload(browser_download_url, data.arch, dataPlatform, abi, filetype)
										}
										color={theme.codeGreen}
									>
										<div className="bold">
											Linux archive (.zip)
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
					<Icon id="source" size={iconSize} color={theme.primaryColor} hoverColor={theme.primaryColor} />
					<DownloadSection>
						<AssetButton
							className="source"
							onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
							onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
							onClick={(ev) => onDownload(zipball_url, "source", "zip")}
							color={theme.primaryColor}
						>
							<div className="bold">Source code (.zip)</div>
							<div></div>
						</AssetButton>
						<AssetButton
							className="source"
							onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
							onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
							onClick={(ev) => onDownload(tarball_url, "source", "tar")}
							color={theme.primaryColor}
						>
							<div className="bold">Source code (.tar.gz)</div>
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
	padding-bottom: 0.5rem;

	@media ${hasMinWidth(0)} {
		padding-bottom: 0.5rem;
	}
`;

const DownloadContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	width: 100%;
	padding: 1.125rem 0.25rem;
	border: 0.0625rem solid ${getThemeVariable("border")};
	background-color: ${getThemeVariable("background")};
	margin-top: -0.0625rem;

	@media ${hasMinWidth(0)} {
		padding: 1.125rem 1.5rem;
	}
	@media ${hasMinWidth(1)} {
	}
	@media ${hasMinWidth(2)} {
	}
`;

const DownloadRow = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 0.5rem 0;

	@media ${hasMinWidth(0)} {
		flex-direction: row;
	}
`;

const DownloadSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: left;
	justify-content: left;
	width: 100%;
	padding-top: 1.5rem;

	@media ${hasMinWidth(0)} {
		padding-top: 0;
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
	padding: 0.5rem 0.75rem;
	margin-top: -0.125rem;
	color: ${getThemeVariable("primaryText")};
	background-color: transparent;
	border: 0.125rem solid ${getThemeVariable("border")};
	cursor: pointer;
	z-index: 10;

	transition: background-color 0.125s linear, border-color 0.125s linear, color 0.125s linear;

	> div {
		line-height: 1.125;

		&.bold {
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

	&.source {
		min-height: 2rem;
	}

	&:first-of-type {
		border-radius: 0.25rem 0.25rem 0 0;
	}
	&:last-of-type {
		border-radius: 0 0 0.25rem 0.25rem;
	}
	&:only-of-type {
		border-radius: 0.25rem;
	}

	&:hover,
	&.touch-hover {
		color: ${getThemeVariable("background")};
		background-color: ${({ color }) => color};
		border-color: ${({ color }) => color};
		z-index: 11;
	}
`;
