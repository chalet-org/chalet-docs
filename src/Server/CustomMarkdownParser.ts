import os from "os";

const trimLineBreaksFromEdges = (text: string) => {
	while (text.endsWith("\n") || text.endsWith("\r")) {
		text = text.slice(0, -1);
	}
	return text;
};

const parseImportantNotes = (text: string): string => {
	return text.replace(/!> (.*)/g, `<p className="tip">$1</p>`);
};

const parsePageHeaders = (text: string): string => {
	return text.replace(/!# (.+)/g, `<PageHeading>$1</PageHeading>`);
};

const parseAnchoredHeaders = (text: string): string => {
	return text.replace(/(#{1,6}) \[(.+)\]/g, (match: string, p1: string, p2: string) => {
		return `<AnchoredH${p1.length}>${p2}</AnchoredH${p1.length}>`;
	});
};

const parseTabs = (text: string): string => {
	return text.replace(
		/<!-- tabs:start -->\n{1,3}((.|\n)*?)<!-- tabs:end -->/g,
		(match: string, p1: string, p2: string) => {
			p1 = trimLineBreaksFromEdges(p1);

			if (p1.startsWith("|")) p1 = p1.substr(1);

			const tabArray = p1.replace(/(\n{1,3}\||\|\n{1,3})/g, "|").split("|");
			if (tabArray.length % 2 == 1) return "";

			let retString: string = `<TabbedContent>`;
			for (let i = 0; i < tabArray.length; i += 2) {
				retString += `<button>

${tabArray[i]}

</button><div className="tab">

${tabArray[i + 1]}

</div>`;
			}
			retString += `</TabbedContent>`;
			return retString;
		}
	);
};

const parseCustomMarkdown = (text: string): string => {
	// First, ensure consistent line endings to make regex patterns easier
	text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	// Parse the things
	text = parseImportantNotes(text);
	text = parsePageHeaders(text);
	text = parseAnchoredHeaders(text);
	text = parseTabs(text);

	// Set line endings back
	text = text.replace(/\n/g, os.EOL);

	return text;
};

export { parseCustomMarkdown };
