import { TFile, getLinkpath, MarkdownRenderChild, MarkdownPostProcessorContext, finishRenderMath } from "obsidian";
import { setMathLink, getMathLink } from "./helper"
import LatexReferencer from "main"

function translateLink(targetLink: string): string {
    // Convert "filename#heading" to "filename > heading" and "filename#^blockID" to "filename > ^blockID"
    function translateLinkImpl(targetLink: string, pattern: RegExp): string | undefined {
        let result = pattern.exec(targetLink);
        if (result)
            return (result[1] ? `${result[1]} > ` : "") + `${result[2]}`
    }

    let headingPattern = /(^.*)#([^\^].*)/;
    let blockPattern = /(^.*)#(\^[a-zA-Z0-9\-]+)/;
    let translatedAsHeading = translateLinkImpl(targetLink, headingPattern);
    let translatedAsBlock = translateLinkImpl(targetLink, blockPattern);
    return translatedAsHeading ?? translatedAsBlock ?? "";
}

export class MathLinksRenderChild extends MarkdownRenderChild {
    readonly targetFile: TFile | null;
    readonly getMathLink: () => string;
    mathLinkEl: HTMLElement;

    constructor(containerEl: HTMLElement, public plugin: LatexReferencer, public sourcePath: string, public targetLink: string, public displayText: string) {
        super(containerEl);
        this.targetFile = this.plugin.app.metadataCache.getFirstLinkpathDest(getLinkpath(this.targetLink), this.sourcePath);
        this.mathLinkEl = this.containerEl.cloneNode(true) as HTMLElement;
        this.mathLinkEl.textContent = "";
        this.containerEl.parentNode?.insertBefore(this.mathLinkEl, this.containerEl.nextSibling);
        this.mathLinkEl.classList.add("mathLink-internal-link");
        this.containerEl.classList.add("original-internal-link");
        this.containerEl.classList.remove("internal-link"); // fix incompatibility with Strange New Worlds
        this.containerEl.style.display = "none";
        this.getMathLink = this.setMathLinkGetter();
    }

    onload(): void {
        this.update();

        // 1. when an API user updates its metadata
        this.registerEvent(this.plugin.app.metadataCache.on("mathlinks:update" as any, (changedFile: TFile) => {
            if (!this.targetFile || this.targetFile == changedFile) {
                this.update();
            }
        }));

        // 2. when an API account is deleted
        this.registerEvent(this.plugin.app.metadataCache.on("mathlinks:update-all" as any, () => {
            this.update();
        }));
    }

    setMathLinkGetter(): () => string {
        let getter = () => "";
        if (this.displayText != this.targetLink && this.displayText != translateLink(this.targetLink)) {
            // [[note|display]] -> use display as mathLink
            getter = () => this.displayText;
        } else {
            if (this.displayText == this.targetFile?.name || this.displayText == this.targetFile?.basename || this.displayText == translateLink(this.targetLink)) {
                // [[note]], [[note#heading]] or [[note#^blockID]]
                getter = () => getMathLink(this.plugin, this.targetLink, this.sourcePath);
            }
        }
        return getter;
    }

    update(): void {
        const mathLink = this.getMathLink();

        if (mathLink) {
            setMathLink(mathLink, this.mathLinkEl);
        } else {
            setMathLink(this.displayText, this.mathLinkEl);
        }
        finishRenderMath();
    }
}

export function generateMathLinks(plugin: LatexReferencer, element: HTMLElement, context: MarkdownPostProcessorContext): void {
    for (let targetEl of element.querySelectorAll<HTMLElement>(".internal-link")) {
        if (targetEl.classList.contains("mathLink-internal-link")) {
            targetEl.remove();
            let queryResult = element.querySelector<HTMLElement>(".original-internal-link");
            if (queryResult) {
                targetEl = queryResult;
                targetEl.classList.remove("original-internal-link");
                targetEl.style.display = "";
            }
        }

        const targetDisplay = targetEl.textContent?.trim().replace(/\.md/, "");
        if (targetDisplay != "" && !/math-inline is-loaded/.test(targetEl.innerHTML)) {
            const targetLink = targetEl.getAttribute("data-href")?.replace(/\.md/, "");
            if (targetLink) {
                const targetFile = plugin.app.metadataCache.getFirstLinkpathDest(getLinkpath(targetLink), context.sourcePath);
                if (targetDisplay && targetFile) {
                    const child = new MathLinksRenderChild(targetEl, plugin, context.sourcePath, targetLink, targetDisplay);
                    context.addChild(child);
                }
            }
        }
    }
}
