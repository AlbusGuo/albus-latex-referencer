import { MarkdownView, TFile, Component } from 'obsidian';
import { StateEffect } from '@codemirror/state';
import LatexReferencer from 'main';
import { Provider } from './provider';
import { createEditorExtensions } from './preview';
import { generateMathLinks } from './reading';

/**
 * Integrated MathLinks functionality
 * Based on obsidian-mathlinks plugin
 */
export class MathLinksManager extends Component {
    providers: { provider: Provider, sortOrder: number }[] = [];
    forceUpdateEffect = StateEffect.define<null>();

    constructor(public plugin: LatexReferencer) {
        super();
    }

    onload() {
        // Markdown Post Processor for reading view
        this.plugin.registerMarkdownPostProcessor((element, context) => {
            let file = this.plugin.app.vault.getAbstractFileByPath(context.sourcePath);
            // Process if:
            // - !file: true if this is a canvas card that is not an embed of an existing note
            // - file exists: process the file
            if (!file || file) {
                generateMathLinks(this.plugin, element, context);
            }
        });

        this.plugin.registerEditorExtension(createEditorExtensions(this.plugin));

        this.plugin.registerEvent(
            this.plugin.app.metadataCache.on('changed', file => this.update(file))
        );
        
        // Force-update when switching between Reading & Editing views
        this.plugin.registerEvent(
            this.plugin.app.workspace.on('layout-change', () => this.update())
        );
    }

    /**
     * @param provider 
     * @param sortOrder - An optional integer sort order. Defaults to 0. Lower number runs before higher numbers.
     */
    registerProvider(provider: Provider, sortOrder?: number) {
        this.providers.find(another => another.provider === provider)
            ?? this.providers.push({ provider, sortOrder: sortOrder ?? 0 });
    }

    iterateProviders(callback: (provider: Provider) => any) {
        this.providers
            .sort((p1, p2) => p1.sortOrder - p2.sortOrder)
            .forEach(({ provider }) => callback(provider));
    }

    enableInSourceMode(): boolean {
        return this.providers.some(({ provider }) => provider.enableInSourceMode);
    }

    update(file?: TFile) {
        if (file) {
            this._update("mathlinks:update", file);
        } else {
            this._update("mathlinks:update-all");
        }
    }

    // eventName: see src/type.d.ts
    private _update(...args: [eventName: "mathlinks:update", file: TFile] | [eventName: "mathlinks:update-all"]) {
        // trigger an event informing this update
        const [eventName, file] = args;
        this.plugin.app.metadataCache.trigger(eventName, file);

        // refresh mathLinks display based on the new metadata
        this.plugin.app.workspace.iterateAllLeaves((leaf) => {
            if (leaf.view instanceof MarkdownView && leaf.view.getMode() === 'source') {
                const editorView = leaf.view.editor.cm;
                if (!editorView) return; // ignore the legacy editor

                // Should dispatch if no file is specified (i.e. "update-all")
                let shouldDispatch = !file;
                // Should dispatch if Obsidian is still yet to resolve links
                shouldDispatch ||= !this.plugin.app.metadataCache.resolvedLinks;
                if (file && leaf.view.file && this.plugin.app.metadataCache.resolvedLinks[leaf.view.file.path]) {
                    // Should dispatch if the opened file (leaf.view.file) links to the changed file (file)
                    shouldDispatch ||= file.path in this.plugin.app.metadataCache.resolvedLinks[leaf.view.file.path];
                }
                if (shouldDispatch) {
                    editorView.dispatch({ effects: this.forceUpdateEffect.of(null) });
                }
            }
        });
    }
}
