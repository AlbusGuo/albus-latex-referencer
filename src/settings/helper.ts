import { ButtonComponent, Setting, SliderComponent, TAbstractFile, TFile, TFolder, TextComponent, ToggleComponent, MarkdownRenderer, Component } from 'obsidian';

import LatexReferencer from 'main';
import { THEOREM_LIKE_ENV_IDs, THEOREM_LIKE_ENVs, TheoremLikeEnvID } from 'env';
import { DEFAULT_SETTINGS, ExtraSettings, LEAF_OPTIONS, THEOREM_REF_FORMATS, THEOREM_CALLOUT_STYLES, TheoremCalloutSettings, MathContextSettings, NUMBER_STYLES, FoldOption, DEFAULT_EXTRA_SETTINGS, NUMBERING_MODES } from 'settings/settings';
import { formatTheoremCalloutType } from 'utils/format';
import { NumberKeys, BooleanKeys } from 'utils/general';
import { DEFAULT_PROFILES, ManageProfileModal } from './profile';
import { t } from 'i18n';


export class TheoremCalloutSettingsHelper {
    constructor(
        public contentEl: HTMLElement,
        public settings: TheoremCalloutSettings,
        public defaultSettings: Required<MathContextSettings> & Partial<TheoremCalloutSettings>,
        public plugin: LatexReferencer,
        public file: TFile,
    ) { }

    makeSettingPane() {
        const { contentEl } = this;
        new Setting(contentEl)
            .setName(t('settings.type'))
            .addDropdown((dropdown) => {
                for (const id of THEOREM_LIKE_ENV_IDs) {
                    const envName = formatTheoremCalloutType(this.plugin, { type: id, profile: this.defaultSettings.profile })
                    dropdown.addOption(id, envName);
                    if (this.defaultSettings.type) {
                        dropdown.setValue(String(this.defaultSettings.type));
                    }
                }

                const initType = dropdown.getValue();
                this.settings.type = initType;

                const numberSetting = new Setting(contentEl).setName(t('settings.number'));
                const numberSettingDescList = numberSetting.descEl.createEl("ul");
                numberSettingDescList.createEl(
                    "li",
                    { text: t('settings.numberDesc.auto') }
                );
                numberSettingDescList.createEl(
                    "li",
                    { text: t('settings.numberDesc.blank') }
                );
                numberSettingDescList.createEl(
                    "li",
                    { text: t('settings.numberDesc.otherwise') }
                );

                numberSetting.addText((text) => {
                    text.setValue(
                        this.defaultSettings.number ?? this.defaultSettings.numberDefault
                    );
                    this.settings.number = text.getValue();
                    text.onChange((value) => {
                        this.settings.number = value;
                    });
                })

                const titlePane = new Setting(contentEl)
                    .setName(t('settings.title'))
                    .setDesc(t('settings.titleDesc'));

                const labelPane = this.plugin.extraSettings.setLabelInModal ? new Setting(contentEl).setName(t('settings.pandocLabel')) : undefined;
                const labelPrefixEl = labelPane?.controlEl.createDiv({
                    text: THEOREM_LIKE_ENVs[this.settings.type as TheoremLikeEnvID].prefix + ":" + (this.defaultSettings.labelPrefix ?? "")
                });

                titlePane.addText((text) => {
                    text.inputEl.classList.add("math-booster-title-form");
                    if (this.defaultSettings.title) {
                        text.setValue(this.defaultSettings.title);
                    }

                    let labelTextComp: TextComponent | undefined;
                    labelPane?.addText((text) => {
                        labelTextComp = text;
                        text.inputEl.classList.add("math-booster-label-form");
                        if (this.defaultSettings.label) {
                            text.setValue(this.defaultSettings.label);
                        }
                        text.onChange((value) => {
                            this.settings.label = value;
                        });
                    });

                    text
                        .setPlaceholder(t('settings.titlePlaceholder'))
                        .onChange((value) => {
                            this.settings.title = value;
                            if (this.plugin.extraSettings.setLabelInModal) {
                                let labelInit = this.settings.title.replaceAll(' ', '-').replaceAll("'s", '').toLowerCase();
                                labelInit = labelInit.replaceAll(/[^a-z0-1\-]/g, '');
                                labelTextComp?.setValue(labelInit);
                                this.settings.label = labelInit;
                            }
                        })
                });

                dropdown.onChange((value) => {
                    this.settings.type = value;
                    if (labelPrefixEl) {
                        labelPrefixEl.textContent = THEOREM_LIKE_ENVs[this.settings.type as TheoremLikeEnvID].prefix + ":";
                        if (this.defaultSettings.labelPrefix) {
                            labelPrefixEl.textContent += this.defaultSettings.labelPrefix;
                        }
                    }
                });
            });

        addFoldOptionSetting(contentEl, t('settings.fold'), (fold) => { this.settings.fold = fold }, this.defaultSettings.fold ?? this.plugin.extraSettings.foldDefault);
    }
}


export abstract class SettingsHelper<SettingsType = MathContextSettings | ExtraSettings> extends Component {
    settingRefs: Record<keyof SettingsType, Setting>;

    constructor(
        public contentEl: HTMLElement,
        public settings: Partial<SettingsType>,
        public defaultSettings: Required<SettingsType>,
        public plugin: LatexReferencer,
        public allowUnset: boolean,
        public addClear: boolean,
    ) {
        super();
        this.settingRefs = {} as Record<keyof SettingsType, Setting>;
    }

    addClearButton(name: keyof SettingsType, setting: Setting, additionalCallback: () => void) {
        setting.addButton((button) => {
            button.setButtonText(t('settings.clear')).onClick(async () => {
                delete this.settings[name];
                additionalCallback();
            })
        });
    }

    addDropdownSetting(name: keyof SettingsType, options: readonly string[], prettyName: string, description?: string, defaultValue?: string, additionalOnChange?: () => void) {
        const setting = new Setting(this.contentEl).setName(prettyName);
        if (description) {
            setting.setDesc(description);
        }
        setting.addDropdown((dropdown) => {
            if (this.allowUnset) {
                dropdown.addOption("", "");
            }
            for (const option of options) {
                dropdown.addOption(option, option);
            }
            dropdown.setValue(
                defaultValue ?? (
                    this.allowUnset
                        ? (this.settings[name] ? this.settings[name] as unknown as string : "")
                        : (this.settings[name] ?? this.defaultSettings[name]) as unknown as string
                )
            );
            dropdown.onChange(async (value: string): Promise<void> => {
                if (this.allowUnset && !value) {
                    delete this.settings[name];
                } else {
                    Object.assign(this.settings, { [name]: value });
                }
                additionalOnChange?.();
            })
        });
        this.settingRefs[name] = setting;
        return setting;
    }

    addTextSetting(name: keyof SettingsType, prettyName: string, description?: string, number: boolean = false): Setting {
        const setting = new Setting(this.contentEl).setName(prettyName);
        if (description) {
            setting.setDesc(description);
        }
        let textComponent: TextComponent;
        setting.addText((text) => {
            textComponent = text;
            text.setPlaceholder(String(this.defaultSettings[name] ?? ""))
                .setValue(String(this.settings[name] ?? ""))
                .onChange((value: string) => {
                    if (number) {
                        Object.assign(this.settings, { [name]: +value });
                    } else {
                        Object.assign(this.settings, { [name]: value });
                    }
                })
        });
        if (this.addClear) {
            this.addClearButton(name, setting, () => {
                textComponent.setPlaceholder(String(this.defaultSettings[name] ?? "")).setValue("")
            });
        }
        this.settingRefs[name] = setting;
        return setting;
    }

    addToggleSetting(name: BooleanKeys<SettingsType>, prettyName: string, description?: string, additionalOnChange?: () => void): Setting {
        const setting = new Setting(this.contentEl).setName(prettyName);
        if (description) {
            setting.setDesc(description);
        }
        let toggleComponent: ToggleComponent;
        setting.addToggle((toggle) => {
            toggleComponent = toggle;
            toggle.setValue(this.defaultSettings[name] as unknown as boolean);
            if (typeof this.settings[name] == "boolean") {
                toggle.setValue(this.settings[name] as unknown as boolean);
            }
            toggle.onChange((value) => {
                Object.assign(this.settings, { [name]: value });
                additionalOnChange?.();
            });
        });
        if (this.addClear) {
            this.addClearButton(name, setting, () => {
                toggleComponent.setValue(this.defaultSettings[name] as unknown as boolean)
            });
        }
        this.settingRefs[name] = setting;
        return setting;
    }

    addSliderSetting(name: NumberKeys<SettingsType>, limits: { min: number, max: number, step: number | 'any' }, prettyName: string, description?: string): Setting {
        const setting = new Setting(this.contentEl).setName(prettyName);
        if (description) {
            setting.setDesc(description);
        }
        let sliderComponent: SliderComponent;
        setting.addSlider((slider) => {
            sliderComponent = slider;
            slider.setLimits(limits.min, limits.max, limits.step)
                .setDynamicTooltip()
                .setValue(this.defaultSettings[name] as unknown as number);
            if (typeof this.settings[name] == "number") {
                slider.setValue(this.settings[name] as unknown as number);
            }
            slider.onChange((value) => {
                Object.assign(this.settings, { [name]: value });
            })
        });
        if (this.addClear) {
            this.addClearButton(name, setting, () => {
                sliderComponent.setValue(this.defaultSettings[name] as unknown as number);
            });
        }
        this.settingRefs[name] = setting;
        return setting;
    }

    addHeading(text: string, cls?: string[]) {
        const setting = new Setting(this.contentEl).setName(text).setHeading();
        if (cls) setting.settingEl.classList.add(...cls);
        return setting;
    }
}


export class MathContextSettingsHelper extends SettingsHelper<MathContextSettings> {
    constructor(
        contentEl: HTMLElement,
        settings: Partial<MathContextSettings>,
        defaultSettings: Required<MathContextSettings>,
        plugin: LatexReferencer,
        public file: TAbstractFile,
    ) {
        const isRoot = file instanceof TFolder && file.isRoot();
        super(contentEl, settings, defaultSettings, plugin, !isRoot, !isRoot);
    }

    onload() {
        this.addHeading(t('settings.theoremCalloutsGeneral'));

        this.addProfileSetting();
        const styleSetting = this.addDropdownSetting("theoremCalloutStyle", THEOREM_CALLOUT_STYLES, t('settings.style'), undefined, undefined, () => this.plugin.forceRerender());
        styleSetting.descEl.replaceChildren(
            t('settings.styleDesc'),
        );
        this.addToggleSetting("theoremCalloutFontInherit", t('settings.theoremCalloutFontInherit'), t('settings.theoremCalloutFontInheritDesc'));
        this.addTextSetting("titleSuffix", t('settings.titleSuffix'), t('settings.titleSuffixDesc'));
        this.addTextSetting("labelPrefix", t('settings.labelPrefix'), t('settings.labelPrefixDesc'));

        this.addHeading(t('settings.theoremCalloutsNumbering'));

        this.addDropdownSetting("numberingMode", NUMBERING_MODES, t('settings.numberingMode'), t('settings.numberingModeDesc'));
        this.addToggleSetting(
            "inferNumberPrefix",
            t('settings.inferNumberPrefix'),
            t('settings.inferNumberPrefixDesc')
        );
        this.addTextSetting("inferNumberPrefixFromProperty", t('settings.inferNumberPrefixFromProperty'), t('settings.inferNumberPrefixFromPropertyDesc'))
        this.addTextSetting("inferNumberPrefixRegExp", t('settings.inferNumberPrefixRegExp'));
        this.addTextSetting("numberPrefix", t('settings.manualPrefix'), t('settings.manualPrefixDesc'));
        this.addTextSetting("numberSuffix", t('settings.numberSuffix'));
        this.addTextSetting("numberInit", t('settings.numberInit'));
        this.addDropdownSetting("numberStyle", NUMBER_STYLES, t('settings.numberStyle'));
        this.addTextSetting("numberDefault", t('settings.numberDefaultDesc'));

        this.addHeading(t('settings.theoremCalloutsReferencing'));

        this.addDropdownSetting("refFormat", THEOREM_REF_FORMATS, t('settings.format'));
        this.addDropdownSetting(
            "noteMathLinkFormat",
            THEOREM_REF_FORMATS,
            t('settings.noteMathLinkFormat'),
            t('settings.noteMathLinkFormatDesc')
        );
        this.addToggleSetting('ignoreMainTheoremCalloutWithoutTitle', t('settings.ignoreMainTheoremCalloutWithoutTitle'));

        this.addHeading(t('settings.equationsNumbering'), ['equation-heading']);

        this.addToggleSetting("numberOnlyReferencedEquations", t('settings.numberOnlyReferencedEquations'));
        this.addToggleSetting(
            "inferEqNumberPrefix",
            t('settings.inferEqNumberPrefix'),
            t('settings.inferEqNumberPrefixDesc')
        );
        this.addTextSetting("inferEqNumberPrefixFromProperty", t('settings.inferEqNumberPrefixFromProperty'), t('settings.inferEqNumberPrefixFromPropertyDesc'))
        this.addTextSetting("inferEqNumberPrefixRegExp", t('settings.inferEqNumberPrefixRegExp'));
        this.addTextSetting("eqNumberPrefix", t('settings.eqManualPrefix'), t('settings.eqManualPrefixDesc'));
        this.addTextSetting("eqNumberSuffix", t('settings.eqNumberSuffix'));
        this.addTextSetting("eqNumberInit", t('settings.eqNumberInit'));
        this.addDropdownSetting("eqNumberStyle", NUMBER_STYLES, t('settings.eqNumberStyle'));
        this.addToggleSetting("lineByLine", t('settings.lineByLine'));

        this.addHeading(t('settings.equationsReferencing'));

        this.addTextSetting("eqRefPrefix", t('settings.eqRefPrefix'));
        this.addTextSetting("eqRefSuffix", t('settings.eqRefSuffix'));

        this.addHeading(t('settings.proofsExperimental'), ['proof-heading']);

        this.addTextSetting("beginProof", t('settings.beginProof'));
        this.addTextSetting("endProof", t('settings.endProof'));

        this.addHeading(t('settings.searchLinkAutocompletionGeneral'))
            .then(async (setting) => {
                setting.descEl.addClass('math-booster-new-feature');
                await MarkdownRenderer.render(this.plugin.app, t('settings.searchLinkAutocompletionNote'), setting.descEl, '', this);
            })
        this.addToggleSetting("insertSpace", t('settings.insertSpace'));
    }

    addProfileSetting(defaultValue?: string): Setting {
        const profileSetting = this.addDropdownSetting("profile", Object.keys(this.plugin.extraSettings.profiles), t('settings.profile'), t('settings.profileDesc'), defaultValue);
        new ButtonComponent(profileSetting.controlEl)
            .setButtonText(t('settings.manageProfiles'))
            .onClick(() => {
                new ManageProfileModal(this.plugin, this, profileSetting).open();
            });
        profileSetting.controlEl.classList.add("math-booster-profile-setting");
        return profileSetting;
    }
}


export class ExtraSettingsHelper extends SettingsHelper<ExtraSettings> {
    onload(): void {
        this.settingRefs["foldDefault"] = addFoldOptionSetting(
            this.contentEl, t('settings.foldDefaultDesc'), (fold) => {
                this.settings.foldDefault = fold;
            }, this.defaultSettings.foldDefault);
        this.addToggleSetting("noteTitleInTheoremLink", t('settings.noteTitleInTheoremLink'), t('settings.noteTitleInTheoremLinkDesc'));
        this.addToggleSetting("noteTitleInEquationLink", t('settings.noteTitleInEquationLink'), t('settings.noteTitleInEquationLinkDesc'));
        this.addToggleSetting("excludeExampleCallout", t('settings.excludeExampleCallout'), t('settings.excludeExampleCalloutDesc'));
        this.addToggleSetting("showTheoremCalloutEditButton", t('settings.showEditButton'));
        this.addToggleSetting("setOnlyTheoremAsMain", t('settings.setOnlyTheoremAsMain'), t('settings.setOnlyTheoremAsMainDesc'));
        this.addToggleSetting("setLabelInModal", t('settings.setLabelInModal'), t('settings.setLabelInModalDesc'));
        this.addToggleSetting("enableProof", t('settings.enableProof'), t('settings.enableProofDesc'), () => this.plugin.updateEditorExtensions());

        // Suggest

        this.addSliderSetting("suggestNumber", { min: 1, max: 50, step: 1 }, t('settings.suggestNumber'), t('settings.suggestNumberDesc'));
        this.addToggleSetting("renderMathInSuggestion", t('settings.renderMathInSuggestion'), t('settings.renderMathInSuggestionDesc'));
        this.addDropdownSetting("searchMethod", ["Fuzzy", "Simple"], t('settings.searchMethod'), t('settings.searchMethodDesc'));
        this.addToggleSetting("searchLabel", t('settings.searchLabel'));
        this.addSliderSetting("upWeightRecent", { min: 0, max: 0.5, step: 0.01 }, t('settings.upWeightRecent'), t('settings.upWeightRecentDesc'));
        this.addDropdownSetting("modifierToJump", ['Mod', 'Ctrl', 'Meta', 'Shift', 'Alt'], t('settings.modifierToJump'), t('settings.modifierToJumpDesc'));
        this.addDropdownSetting("modifierToNoteLink", ['Mod', 'Ctrl', 'Meta', 'Shift', 'Alt'], t('settings.modifierToNoteLink'), t('settings.modifierToNoteLinkDesc'));
        this.addToggleSetting("showModifierInstruction", t('settings.showModifierInstruction'), t('settings.showModifierInstructionDesc'));
        const list = this.settingRefs.modifierToJump.descEl.createEl("ul");
        list.createEl("li", { text: t('settings.modifierNote1') });
        list.createEl("li", { text: t('settings.modifierNote2') });
        this.addDropdownSetting("suggestLeafOption", LEAF_OPTIONS, t('settings.openingOption'), t('settings.openingOptionDesc'))

        this.addHeading(t('settings.enhanceBuiltinLinkAutocompletion'))
            .setDesc(t('settings.enhanceBuiltinLinkAutocompletionDesc'));
        this.addToggleSetting("showTheoremTitleinBuiltin", t('settings.showTheoremTitleinBuiltin'));
        this.addToggleSetting("showTheoremContentinBuiltin", t('settings.showTheoremContentinBuiltin'), t('settings.showTheoremContentinBuiltinDesc'));

        this.addHeading(t('settings.configureCustomEditorLinkAutocompletion'))
            .setDesc(t('settings.configureCustomEditorLinkAutocompletionDesc'));

        this.addTextSetting("autocompleteDvQuery", t('settings.autocompleteDvQuery'), t('settings.autocompleteDvQueryDesc'));

        this.addHeading(t('settings.theoremEquationSuggestion'))
        this.addHeading(t('settings.fromEntireVault'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableSuggest", t('settings.enable'));
        this.addTextSetting("triggerSuggest", t('settings.trigger'));
        this.addHeading(t('settings.fromRecentlyOpenedNotes'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableSuggestRecentNotes", t('settings.enable'));
        this.addTextSetting("triggerSuggestRecentNotes", t('settings.trigger'));
        this.addHeading(t('settings.fromActiveNote'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableSuggestActiveNote", t('settings.enable'));
        this.addTextSetting("triggerSuggestActiveNote", t('settings.trigger'));
        this.addHeading(t('settings.fromDataviewQuery'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableSuggestDataview", t('settings.enable'));
        this.addTextSetting("triggerSuggestDataview", t('settings.trigger'));

        this.addHeading(t('settings.theoremSuggestion'), ['editor-suggest-setting-heading']);
        this.addHeading(t('settings.fromEntireVault'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableTheoremSuggest", t('settings.enable'));
        this.addTextSetting("triggerTheoremSuggest", t('settings.trigger'));
        this.addHeading(t('settings.fromRecentlyOpenedNotes'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableTheoremSuggestRecentNotes", t('settings.enable'));
        this.addTextSetting("triggerTheoremSuggestRecentNotes", t('settings.trigger'));
        this.addHeading(t('settings.fromActiveNote'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableTheoremSuggestActiveNote", t('settings.enable'));
        this.addTextSetting("triggerTheoremSuggestActiveNote", t('settings.trigger'));
        this.addHeading(t('settings.fromDataviewQuery'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableTheoremSuggestDataview", t('settings.enable'));
        this.addTextSetting("triggerTheoremSuggestDataview", t('settings.trigger'));

        this.addHeading(t('settings.equationSuggestion'), ['editor-suggest-setting-heading'])
        this.addHeading(t('settings.fromEntireVault'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableEquationSuggest", t('settings.enable'));
        this.addTextSetting("triggerEquationSuggest", t('settings.trigger'));
        this.addHeading(t('settings.fromRecentlyOpenedNotes'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableEquationSuggestRecentNotes", t('settings.enable'));
        this.addTextSetting("triggerEquationSuggestRecentNotes", t('settings.trigger'));
        this.addHeading(t('settings.fromActiveNote'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableEquationSuggestActiveNote", t('settings.enable'));
        this.addTextSetting("triggerEquationSuggestActiveNote", t('settings.trigger'));
        this.addHeading(t('settings.fromDataviewQuery'), ['editor-suggest-setting-indented-heading']);
        this.addToggleSetting("enableEquationSuggestDataview", t('settings.enable'));
        this.addTextSetting("triggerEquationSuggestDataview", t('settings.trigger'));

        // projects
        // this.addTextSetting("projectInfix", "Link infix", "Specify the infix to connect a project name and a theorem title or an equation number.");
        // this.addTextSetting("projectSep", "Separator for nested projects");

        // indexer/importer
        // this.contentEl.createEl("h3", { text: "Indexing" });
        this.addHeading(t('settings.indexing'));

        this.addSliderSetting('importerNumThreads', { min: 1, max: 10, step: 1 }, t('settings.indexerThreads'), t('settings.indexerThreadsDesc'));
        this.addSliderSetting('importerUtilization', { min: 0.1, max: 1.0, step: 0.01 }, t('settings.indexerCpuUtilization'), t('settings.indexerCpuUtilizationDesc'));
    }
}


// export class ProjectSettingsHelper {
//     plugin: LatexReferencer;
//     file: TAbstractFile;

//     constructor(public contentEl: HTMLElement, public parent: ContextSettingModal) {
//         this.plugin = parent.plugin;
//         this.file = parent.file;
//     }

//     makeSettingPane() {
//         const project = this.plugin.projectManager.getProject(this.file);
//         const noteOrFolder = this.file instanceof TFile ? "note" : "folder";
//         let status = "";
//         if (project) {
//             if (project.root == this.file) {
//                 status = `This ${noteOrFolder} is a project's root.`;
//             } else {
//                 status = `This ${noteOrFolder} belongs to the project "${project.name}" (root: ${project.root.path}).`;
//             }
//         } else {
//             status = `This ${noteOrFolder} doesn't belong to any project.`;
//         }

//         this.contentEl.createEl("h4", {text: "Project (experimental)"})

//         this.contentEl.createDiv({
//             text: PROJECT_DESCRIPTION + " " + status,
//             cls: ["setting-item-description", "math-booster-setting-item-description"]
//         });
//         this.addRootSetting();
//         if (project) {
//             this.addNameSetting(project);
//         }
//     }

//     addRootSetting(): Setting | undefined {
//         const prettyName = "Set as project root";
//         const description = this.file instanceof TFile
//             ? "If turned on, this file itself will be treated as a project."
//             : "If turned on, all the files under this folder will be treated as a single project.";
//         let index: AbstractFileIndex | undefined
//         if (this.file instanceof TFile) {
//             index = this.plugin.index.getNoteIndex(this.file)
//         } else if (this.file instanceof TFolder) {
//             index = this.plugin.index.getFolderIndex(this.file)
//         }
//         if (index) {
//             const setting = new Setting(this.contentEl).setName(prettyName).setDesc(description);
//             setting.addToggle((toggle) => {
//                 toggle.setValue(index!.isProjectRoot)
//                     .onChange((value) => {
//                         if (value) {
//                             this.plugin.projectManager.add(this.file);
//                         } else {
//                             this.plugin.projectManager.delete(this.file);
//                         }
//                         this.parent.close();
//                         this.parent.open();
//                     });
//             });
//             return setting;
//         }
//     }

//     addNameSetting(project: Project): Setting {
//         const prettyName = "Project name";
//         const description = "A project name can contain inline math and doesn't have to be unique.";
//         const setting = new Setting(this.contentEl).setName(prettyName).setDesc(description);

//         setting.addText((text) => {
//             text.setValue(project.name)
//                 .onChange((value) => {
//                     project.name = value;
//                 })
//         });
//         return setting;
//     }
// }


function addFoldOptionSetting(el: HTMLElement, name: string, onChange: (fold: FoldOption) => any, defaultValue?: FoldOption) {
    return new Setting(el)
        .setName(name)
        .addDropdown((dropdown) => {
            dropdown.addOption('', 'Unfoldable');
            dropdown.addOption('+', 'Foldable & expanded by default');
            dropdown.addOption('-', 'Foldable & folded by default');

            dropdown.setValue(defaultValue ?? DEFAULT_EXTRA_SETTINGS.foldDefault);

            dropdown.onChange(onChange)
        });
}