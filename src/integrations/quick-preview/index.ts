import { Component, PopoverSuggest, SuggestModal } from "obsidian";
import { around } from "monkey-around";
import LatexReferencer from "main";
import { PopoverManager } from "./popoverManager";
import { PreviewInfo, Suggester, PatchedSuggester } from "./types";

/**
 * Integrated Quick Preview functionality
 * Based on obsidian-quick-preview plugin
 */
export function registerQuickPreview<T>(
    plugin: LatexReferencer,
    component: Component,
    suggestClass: new (...args: any[]) => Suggester<T>,
    itemNormalizer: (item: T) => PreviewInfo | null
): void {
    plugin.app.workspace.onLayoutReady(() => {
        const uninstaller = patchSuggester(plugin, suggestClass, itemNormalizer);
        component.register(uninstaller);
    });
}

function patchSuggester<T>(
    plugin: LatexReferencer,
    suggestClass: new (...args: any[]) => Suggester<T>,
    itemNormalizer: (item: T) => PreviewInfo | null
) {
    const prototype = suggestClass.prototype;

    const uninstaller = around(prototype, {
        open(old) {
            return function (this: PatchedSuggester<T>) {
                old.call(this);
                if (!this.popoverManager) {
                    this.popoverManager = new PopoverManager<T>(plugin, this, itemNormalizer);
                }
                this.popoverManager.load();
            }
        },
        close(old) {
            return function (this: PatchedSuggester<T>) {
                old.call(this);
                this.popoverManager?.unload();
            }
        }
    });

    return uninstaller;
}
