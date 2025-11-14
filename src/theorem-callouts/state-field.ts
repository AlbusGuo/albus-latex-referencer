import { StateField, EditorState, Transaction, RangeSet, RangeValue, Range, Text } from '@codemirror/state';
import { ensureSyntaxTree, syntaxTree } from '@codemirror/language';

import LatexReferencer from 'main';
import { readTheoremCalloutSettings } from 'utils/parse';
import { resolveSettings } from 'utils/plugin';
import { editorInfoField } from 'obsidian';

export const CALLOUT = /HyperMD-callout_HyperMD-quote_HyperMD-quote-([1-9][0-9]*)/;

export class TheoremCalloutInfo extends RangeValue {
    constructor(
        public index: number | null,
        public sectionIndex?: number // For detailed numbering mode
    ) {
        super();
    }
}


export const createTheoremCalloutsField = (plugin: LatexReferencer) => StateField.define<RangeSet<TheoremCalloutInfo>>({
    create(state: EditorState) {
        // Since because canvas files cannot be indexed currently,
        // do not number theorems in canvas to make live preview consistent with reading view
        if (!state.field(editorInfoField).file) return RangeSet.empty;

        const ranges = getTheoremCalloutInfos(plugin, state, state.doc, 0, 0);
        return RangeSet.of(ranges);
    },
    update(value: RangeSet<TheoremCalloutInfo>, tr: Transaction) {
        // Since because canvas files cannot be indexed currently,
        // do not number theorems in canvas to make live preview consistent with reading view
        if (!tr.state.field(editorInfoField).file) return RangeSet.empty;

        // Because the field can be perfectly determined by the document content, 
        // we don't need to update it when the document is not changed
        if (!tr.docChanged) return value;

        // In order to make the updates efficient, we only update the theorem callout infos that are affected by the changes, 
        // that is, theorem callouts after the insertion point.

        // Here, we use tr.newDoc instead of tr.state.doc because "Contrary to .state.doc, accessing this won't force the entire new state to be computed right away" (from CM6 docs)

        let minChangedPosition = tr.newDoc.length - 1;
        const changeDesc = tr.changes.desc;
        changeDesc.iterChangedRanges((fromA, toA, fromB, toB) => {
            if (fromB < minChangedPosition) {
                minChangedPosition = fromB;
            }
        });

        value = value.map(changeDesc);

        let init = 0;
        value.between(0, minChangedPosition, (from, to, info) => {
            if (to < minChangedPosition && info.index !== null) init = info.index + 1;
        });

        const updatedRanges = getTheoremCalloutInfos(plugin, tr.state, tr.newDoc, minChangedPosition, init);
        return value.update({
            add: updatedRanges,
            filter: () => false,
            filterFrom: minChangedPosition,
        });
    }
});


function getTheoremCalloutInfos(plugin: LatexReferencer, state: EditorState, doc: Text, from: number, init: number): Range<TheoremCalloutInfo>[] {
    const ranges: Range<TheoremCalloutInfo>[] = [];
    // syntaxTree returns a potentially imcomplete tree (limited by viewport), so we need to ensure it's complete
    const tree = ensureSyntaxTree(state, doc.length) ?? syntaxTree(state);

    const file = state.field(editorInfoField).file;
    if (!file) return ranges;

    const settings = resolveSettings(undefined, plugin, file);
    const numberingMode = settings.numberingMode || 'unified';

    // For separate numbering: maintain counters per type
    const separateCounters: Record<string, number> = {};
    
    // For detailed numbering: get h1 headings and maintain counters per section and type
    const h1Headings = numberingMode === 'detailed'
        ? (plugin.app.metadataCache.getFileCache(file)?.headings?.filter(h => h.level === 1) || [])
        : [];
    const detailedCounters: Record<number, Record<string, number>> = {};

    // Helper function to find which h1 section a line belongs to
    const getH1SectionIndex = (lineNumber: number): number => {
        if (h1Headings.length === 0) return 0;
        for (let i = h1Headings.length - 1; i >= 0; i--) {
            if (lineNumber >= h1Headings[i].position.start.line) {
                return i + 1; // Section numbers start from 1
            }
        }
        return 0; // Before the first h1
    };

    let unifiedIndex = init; // For unified numbering mode

    tree.iterate({
        from, to: doc.length,
        enter(node) {
            if (node.name === 'Document') return; // skip the node for the entire document

            if (node.node.parent?.name !== 'Document') return false; // skip sub-nodes of a line

            const text = doc.sliceString(node.from, node.to);

            const match = node.name.match(CALLOUT);
            if (!match) return false;

            const calloutSettings = readTheoremCalloutSettings(text, plugin.extraSettings.excludeExampleCallout);
            if (!calloutSettings) return false;

            let theoremIndex: number | null = null;
            let sectionIndex: number | undefined = undefined;

            if (calloutSettings.number === 'auto') {
                const type = calloutSettings.type;
                
                if (numberingMode === 'detailed') {
                    // Detailed numbering: section.number
                    const line = doc.lineAt(node.from).number - 1; // Convert to 0-based
                    sectionIndex = getH1SectionIndex(line);
                    
                    if (!(sectionIndex in detailedCounters)) {
                        detailedCounters[sectionIndex] = {};
                    }
                    if (!(type in detailedCounters[sectionIndex])) {
                        detailedCounters[sectionIndex][type] = 0;
                    }
                    theoremIndex = detailedCounters[sectionIndex][type]++;
                } else if (numberingMode === 'separate') {
                    // Separate numbering: each type has its own counter
                    if (!(type in separateCounters)) {
                        separateCounters[type] = 0;
                    }
                    theoremIndex = separateCounters[type]++;
                } else {
                    // Unified numbering (default): all types share one counter
                    theoremIndex = unifiedIndex++;
                }
            }

            const value = new TheoremCalloutInfo(theoremIndex, sectionIndex);
            const range = value.range(node.from, node.to);
            ranges.push(range);

            return false;
        }
    });

    return ranges;
}
