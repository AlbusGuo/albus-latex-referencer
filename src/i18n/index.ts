import { moment } from 'obsidian';
import { en, TranslationKeys } from './en';
import { zhCN } from './zh-cn';

const locales: Record<string, TranslationKeys> = {
	'en': en,
	'zh-cn': zhCN,
	'zh': zhCN, // fallback for Chinese
};

// Get translation based on current Obsidian locale
export function t(key: string): string {
	const locale = moment.locale();
	const translation = locales[locale] || en;
	
	// Navigate nested keys (e.g., "commands.insertDisplayMath")
	const keys = key.split('.');
	let value: any = translation;
	
	for (const k of keys) {
		if (value && typeof value === 'object' && k in value) {
			value = value[k];
		} else {
			// Fallback to English if key not found
			value = en;
			for (const fallbackKey of keys) {
				if (value && typeof value === 'object' && fallbackKey in value) {
					value = value[fallbackKey];
				} else {
					return key; // Return key itself if not found
				}
			}
			break;
		}
	}
	
	return typeof value === 'string' ? value : key;
}

// Export locales for direct access if needed
export { en, zhCN };
