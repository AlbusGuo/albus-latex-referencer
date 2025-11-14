import { PopoverSuggest, SuggestModal, TFile } from "obsidian";

export type Suggester<T> = PopoverSuggest<T> | SuggestModal<T>;
export type PatchedSuggester<T> = Suggester<T> & { popoverManager?: PopoverManager<T> };

export interface PreviewInfo {
    linktext: string;
    sourcePath: string;
    line?: number;
}

import { PopoverManager } from "./popoverManager";
