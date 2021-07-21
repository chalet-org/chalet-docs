export function hashString(value: string): number {
	let hash: number = 0;
	for (let i = 0; i < value.length; i++) {
		let char = value.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return hash;
}
