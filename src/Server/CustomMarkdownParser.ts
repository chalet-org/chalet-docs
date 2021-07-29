import os from "os";

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
		/<!-- tabs:start -->\n{1,3}((.|\n)*?(?=<!-- tabs:end -->\n{1,3}))<!-- tabs:end -->/g,
		(match: string, p1: string, p2: string) => {
			while (p1.endsWith("\n") || p1.endsWith("\r")) p1 = p1.slice(0, -1);
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
			console.log(retString);
			return retString;
		}
	);
};

const parseCustomMarkdown = (text: string): string => {
	// First, ensure consistent line endings to make regex patterns easier
	text = text.replace(/\r\n/g, "\n");
	text = text.replace(/\r/g, "\n");

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
