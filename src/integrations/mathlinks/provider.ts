import { BlockSubpathResult, Component, HeadingSubpathResult, TFile } from 'obsidian';
import LatexReferencer from 'main';

/**
 * A class that provides a displayed text for a given link.
 * Integrated from obsidian-mathlinks plugin.
 */
export abstract class Provider extends Component {
    _enableInSourceMode: boolean = false;

    constructor(public plugin: LatexReferencer) {
        super();
    }

    get enableInSourceMode() {
        return this._enableInSourceMode;
    }

    set enableInSourceMode(enable: boolean) {
        this._enableInSourceMode = enable;
        this.plugin.mathLinksManager?.update();
    }

    /**
     * Provide a displayed text for the given information about a link by returning `string`.
     * You should return `null` as soon as possible if you don't want to handle the given link.
     * 
     * @param sourceFile Can be `null` for a canvas card that is not associated with any existing note in the vault.
     */
    public abstract provide(
        parsedLinktext: { path: string, subpath: string },
        targetFile: TFile | null,
        targetSubpathResult: HeadingSubpathResult | BlockSubpathResult | null,
        sourceFile: TFile | null,
    ): string | null;

    onunload() {
        const providers = this.plugin.mathLinksManager?.providers || [];
        let index = providers.findIndex(({ provider }: { provider: Provider }) => provider === this);
        if (index !== -1) {
            providers.splice(index, 1);
            this.plugin.mathLinksManager?.update();
        }
    }
}
