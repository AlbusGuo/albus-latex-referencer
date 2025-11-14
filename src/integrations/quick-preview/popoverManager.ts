import { Component, Keymap, KeymapEventHandler, Modifier, PopoverSuggest, UserEvent } from "obsidian";
import LatexReferencer from "main";
import { QuickPreviewHoverParent } from "./hoverParent";
import { getSelectedItem } from "./utils";
import { PatchedSuggester, PreviewInfo } from "./types";

export class PopoverManager<T> extends Component {
    suggestions: { values: T[], selectedItem: number, containerEl: HTMLElement, moveUp: (event: KeyboardEvent) => void, moveDown: (event: KeyboardEvent) => void };
    currentHoverParent: QuickPreviewHoverParent<T> | null = null;
    currentOpenHoverParent: QuickPreviewHoverParent<T> | null = null;
    lastEvent: MouseEvent | PointerEvent | null = null;
    handlers: KeymapEventHandler[] = [];
    popoverHeight: number | null = null;
    popoverWidth: number | null = null;
    modifier: Modifier = "Alt";

    constructor(private plugin: LatexReferencer, public suggest: PatchedSuggester<T>, private itemNormalizer: (item: T) => PreviewInfo | null) {
        super();

        if (suggest instanceof PopoverSuggest) {
            this.suggestions = (suggest as any).suggestions;
        } else {
            this.suggestions = (suggest as any).chooser;
        }
    }

    get doc() {
        return this.suggestions.containerEl.doc;
    }

    get win() {
        return this.doc.win;
    }

    onload() {
        this.registerDomEvent(this.win, 'keydown', (event) => {
            if ((this.suggest as any).isOpen && Keymap.isModifier(event, this.modifier)) {
                if (this.currentOpenHoverParent) this.hide();
                else {
                    const item = getSelectedItem(this.suggestions);
                    if (item) this.spawnPreview(item);    
                }
            }
        });
        this.registerDomEvent(this.win, 'keyup', (event: KeyboardEvent) => {
            if (event.key === this.modifier) this.hide();
        });
        // Workaround for the problem that the keyup event is not fired when command key is released on macOS
        this.registerDomEvent(this.win, 'mousemove', (event: MouseEvent) => {
            if (!Keymap.isModifier(event, this.modifier)) this.hide();
        });

        this.handlers.push(
            (this.suggest as any).scope.register([this.modifier], 'ArrowUp', (event: KeyboardEvent) => {
                this.suggestions.moveUp(event);
                return false;
            }),
            (this.suggest as any).scope.register([this.modifier], 'ArrowDown', (event: KeyboardEvent) => {
                this.suggestions.moveDown(event);
                return false;
            })
        );
    }

    onunload() {
        this.handlers.forEach((handler) => {
            (this.suggest as any).scope.unregister(handler);
        });
        this.handlers.length = 0;

        this.currentHoverParent?.hide();
        this.currentHoverParent = null;
        this.currentOpenHoverParent?.hide();
        this.currentOpenHoverParent = null;
        this.lastEvent = null;
    }

    hide(lazy: boolean = false) {
        if (!lazy) this.currentHoverParent?.hide();
        this.currentHoverParent = null;
    }

    spawnPreview(item: T, lazyHide: boolean = false, event: UserEvent | null = null) {
        this.hide(lazyHide);

        if (event && (event.instanceOf(MouseEvent) || event.instanceOf(PointerEvent))) this.lastEvent = event;

        this.currentHoverParent = new QuickPreviewHoverParent(this.suggest);

        const info = this.itemNormalizer(item);
        if (info) {
            const pagePreview = (this.plugin.app as any).internalPlugins.getPluginById('page-preview').instance;
            pagePreview.onLinkHover(this.currentHoverParent, this.doc.body, info.linktext, info.sourcePath, { scroll: info.line });
        }
    }

    getShownPos(): { x: number, y: number } {
        const position = 'Auto';

        if (position === 'Auto') {
            return this.getShownPosAuto();
        }
        return this.getShownPosCorner('Bottom right');
    }

    getShownPosCorner(position: 'Top left' | 'Top right' | 'Bottom left' | 'Bottom right') {
        if (position === 'Top left') {
            return { x: 0, y: 0 };
        } else if (position === 'Top right') {
            return { x: this.win.innerWidth, y: 0 };
        } else if (position === 'Bottom left') {
            return { x: 0, y: this.win.innerHeight };
        }
        return { x: this.win.innerWidth, y: this.win.innerHeight };
    }

    getShownPosAuto(): { x: number, y: number } {
        const el = this.suggestions.containerEl;
        const { top, bottom, left, right, width, height } = el.getBoundingClientRect();

        const popover = this.currentHoverParent?.hoverPopover;
        this.popoverWidth = popover?.hoverEl.offsetWidth ?? this.popoverWidth ?? null;
        this.popoverHeight = popover?.hoverEl.offsetHeight ?? this.popoverHeight ?? null;

        if (this.popoverWidth && this.popoverHeight) {
            let offsetX = width * 0.1;
            let offsetY = height * 0.1;
            if (right - offsetX + this.popoverWidth < this.win.innerWidth) return { x: right - offsetX, y: top + offsetY };
            offsetX = width * 0.03;
            offsetY = height * 0.05;
            if (left > this.popoverWidth + offsetX) return { x: left - this.popoverWidth - offsetX, y: top + offsetY };
        }

        const x = (left + right) * 0.5;
        const y = (top + bottom) * 0.5;

        if (x >= this.win.innerWidth * 0.6) {
            if (y >= this.win.innerHeight * 0.5) return this.getShownPosCorner('Top left');
            return this.getShownPosCorner('Bottom left');
        }
        if (y >= this.win.innerHeight * 0.5) return this.getShownPosCorner('Top right');
        return this.getShownPosCorner('Bottom right');
    }
}
