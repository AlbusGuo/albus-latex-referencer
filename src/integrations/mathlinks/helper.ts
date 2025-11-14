import { TFile, renderMath, parseLinktext, resolveSubpath, BlockSubpathResult, HeadingSubpathResult } from "obsidian";
import LatexReferencer from "main";
import { Provider } from "./provider";

export function setMathLink(source: string, mathLinkEl: HTMLElement) {
    mathLinkEl.replaceChildren();
    const mathPattern = /\$(.*?[^\s])\$/g;
    let textFrom = 0, textTo = 0;
    let result;
    while ((result = mathPattern.exec(source)) !== null) {
        const mathString = result[1];
        textTo = result.index;
        if (textTo > textFrom) mathLinkEl.createSpan().replaceWith(source.slice(textFrom, textTo));

        const mathEl = renderMath(mathString, false);
        mathLinkEl.createSpan({ cls: ["math", "math-inline", "is-loaded"] }).replaceWith(mathEl);

        textFrom = mathPattern.lastIndex;
    }

    if (textFrom < source.length) mathLinkEl.createSpan().replaceWith(source.slice(textFrom));
}

export function getMathLink(plugin: LatexReferencer, targetLink: string, sourcePath: string, isSourceMode?: boolean): string {
    if (!plugin.mathLinksManager) return "";
    
    let { path, subpath } = parseLinktext(targetLink);

    let file = plugin.app.metadataCache.getFirstLinkpathDest(path, sourcePath);
    if (!file) return "";

    let cache = plugin.app.metadataCache.getFileCache(file);
    if (!cache) return "";

    let subpathResult = resolveSubpath(cache, subpath);

    const sourceFile = plugin.app.vault.getAbstractFileByPath(sourcePath);
    if (!(sourceFile === null || sourceFile instanceof TFile)) {
        return "";
    }

    let mathLink = "";
    plugin.mathLinksManager.iterateProviders((provider: Provider) => {
        if (isSourceMode && !provider.enableInSourceMode) return;

        const provided = provider.provide({ path, subpath }, file, subpathResult, sourceFile);
        if (provided) {
            mathLink = provided;
        }
    });

    return mathLink;
}

export function getMathLinkFromSubpath(
    linkpath: string,
    subpathResult: HeadingSubpathResult | BlockSubpathResult,
    metadata: Record<string, any> | undefined,
    blockPrefix: string,
    prefix: string | null
): string {
    let subMathLink = ""
    if (subpathResult.type == "heading") {
        subMathLink = subpathResult.current.heading;
    } else if (subpathResult.type == "block" && metadata?.["mathLink-blocks"]?.[subpathResult.block.id]) {
        subMathLink = blockPrefix + metadata["mathLink-blocks"][subpathResult.block.id];
    }
    if (subMathLink) {
        if (prefix === null) { // use standard prefix
            if (linkpath) {
                return (metadata?.["mathLink"] ?? linkpath) + " > " + subMathLink;
            } else {
                return subMathLink;
            }
        } else { // typeof prefix == 'string' => use custom prefix 
            return prefix + subMathLink;
        }
    } else {
        return "";
    }
}
