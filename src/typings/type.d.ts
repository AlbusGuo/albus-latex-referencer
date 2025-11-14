import { PaneType, SplitDirection } from "obsidian";
import { EditorView } from "@codemirror/view";

declare module "obsidian" {
    interface App {
        plugins: {
            enabledPlugins: Set<string>;
            plugins: {
                [id: string]: any;
                ["supercharged-links-obsidian"]?: {
                    settings: SuperchargedLinksSettings;
                };
            };
            getPlugin: (id: string) => Plugin | null;
        };
    }
    interface Editor {
        cm?: EditorView;
    }
    
    interface MetadataCache {
        /** Custom events for MathLinks integration */
        on(
            name: "mathlinks:update",
            callback: (file: TFile) => any
        ): EventRef;

        on(
            name: "mathlinks:update-all",
            callback: () => any
        ): EventRef;
    }
    
    // Reference: https://github.com/tadashi-aikawa/obsidian-various-complements-plugin/blob/be4a12c3f861c31f2be3c0f81809cfc5ab6bb5fd/src/ui/AutoCompleteSuggest.ts#L595-L619
    interface EditorSuggest<T> {
        scope: Scope;
        suggestions: {
            selectedItem: number;
            values: T[];
            containerEl: HTMLElement;
        };
        suggestEl: HTMLElement;
    }

    // Reference: https://github.com/tadashi-aikawa/obsidian-another-quick-switcher/blob/6aa40a46fe817d25c11847a46ec6c765c742d629/src/ui/UnsafeModalInterface.ts#L5
    interface SuggestModal<T> {
        chooser: {
            values: T[] | null;
            selectedItem: number;
            setSelectedItem(
                item: number,
                event?: KeyboardEvent,
            ): void;
            useSelectedItem(ev: Partial<KeyboardEvent>): void;
            suggestions: Element[];
        };
    }
}

// Type definitions for Supercharged Links
type SelectorTypes = 'attribute' | 'tag' | 'path';

interface CSSLink {
    type: SelectorTypes
    name: string
    value: string
}

interface SuperchargedLinksSettings {
    targetTags: boolean;
    selectors: CSSLink[];
}

export type LeafArgs = [newLeaf?: PaneType | boolean] | [newLeaf?: 'split', direction?: SplitDirection];
