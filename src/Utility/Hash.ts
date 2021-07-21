export function hashString(value: string): number {
	let hash: number = 0;
	for (let i = 0; i < value.length; ++i) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash = hash & hash;
	}
	return hash;
}
