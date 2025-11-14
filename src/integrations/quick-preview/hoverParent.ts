import { HoverParent, HoverPopover } from "obsidian";
import { PopoverManager } from "./popoverManager";
import { PatchedSuggester } from "./types";

export class QuickPreviewHoverParent<T> implements HoverParent {
    #hoverPopover: HoverPopover | null = null;
    hidden: boolean;
    manager: PopoverManager<T>;

    constructor(private suggest: PatchedSuggester<T>) {
        this.hidden = false;
        if (!this.suggest.popoverManager) {
            throw new Error("popoverManager not initialized");
        }
        this.manager = this.suggest.popoverManager;
    }

    hide() {
        (this.hoverPopover as any)?.hide();
        this.hidden = true;
        if (this.manager.currentOpenHoverParent === this) {
            this.manager.currentOpenHoverParent = null;
        }
    }

    get hoverPopover() {
        return this.#hoverPopover;
    }

    set hoverPopover(hoverPopover: HoverPopover | null) {
        this.#hoverPopover = hoverPopover;
        if (this.#hoverPopover) {
            this.manager.addChild(this.#hoverPopover);
            this.manager.currentOpenHoverParent?.hide();
            this.manager.currentOpenHoverParent = this;
            if (this.hidden) {
                this.hide();
                return;
            }
            this.#hoverPopover.hoverEl.addClass('quick-preview');
            (this.#hoverPopover as any).position((this.#hoverPopover as any).shownPos = this.manager.getShownPos());
        }
    }
}
