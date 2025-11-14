import { App, Component, PluginSettingTab, Setting } from "obsidian";

import LatexReferencer, { VAULT_ROOT } from "../main";
import { DEFAULT_EXTRA_SETTINGS, DEFAULT_SETTINGS } from "./settings";
import { ExtraSettingsHelper, MathContextSettingsHelper } from "./helper";
import { ExcludedFileManageModal, LocalContextSettingsSuggestModal } from "settings/modals";
import { t } from "i18n";
// import { PROJECT_DESCRIPTION } from "project";


export class MathSettingTab extends PluginSettingTab {
    component: Component;

    constructor(app: App, public plugin: LatexReferencer) {
        super(app, plugin);
        this.component = new Component();
    }

    addRestoreDefaultsButton() {
        new Setting(this.containerEl)
            .addButton((btn) => {
                btn.setButtonText(t('settings.restoreDefaults'));
                btn.onClick(async () => {
                    Object.assign(this.plugin.settings[VAULT_ROOT], DEFAULT_SETTINGS);
                    Object.assign(this.plugin.extraSettings, DEFAULT_EXTRA_SETTINGS);
                    this.display();
                })
            });
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        this.component.load();

        containerEl.createEl("h4", { text: t('settings.global') });

        const root = this.app.vault.getRoot();
        const globalHelper = new MathContextSettingsHelper(
            this.containerEl,
            this.plugin.settings[VAULT_ROOT],
            DEFAULT_SETTINGS,
            this.plugin,
            root
        );
        this.component.addChild(globalHelper);

        const extraHelper = new ExtraSettingsHelper(
            this.containerEl,
            this.plugin.extraSettings,
            this.plugin.extraSettings,
            this.plugin,
            false, 
            false
        );
        this.component.addChild(extraHelper);

        const heading = extraHelper.addHeading('Equations - general');
        const numberingHeading = this.containerEl.querySelector<HTMLElement>('.equation-heading')!;
        this.containerEl.insertBefore(
            heading.settingEl,
            numberingHeading
        );
        this.containerEl.insertAfter(
            extraHelper.settingRefs.enableProof.settingEl,
            this.containerEl.querySelector('.proof-heading')!
        );
        this.containerEl.insertAfter(
            extraHelper.settingRefs.showTheoremCalloutEditButton.settingEl, 
            globalHelper.settingRefs.profile.settingEl
        );
        this.containerEl.insertAfter(
            extraHelper.settingRefs.excludeExampleCallout.settingEl, 
            globalHelper.settingRefs.profile.settingEl
        );
        this.containerEl.insertBefore(
            extraHelper.settingRefs.foldDefault.settingEl, 
            globalHelper.settingRefs.labelPrefix.settingEl
        );
        this.containerEl.insertBefore(
            extraHelper.settingRefs.setOnlyTheoremAsMain.settingEl, 
            globalHelper.settingRefs.labelPrefix.settingEl
        );
        this.containerEl.insertBefore(
            extraHelper.settingRefs.setLabelInModal.settingEl, 
            globalHelper.settingRefs.labelPrefix.settingEl
        );
        this.containerEl.insertAfter(
            extraHelper.settingRefs.noteTitleInTheoremLink.settingEl, 
            globalHelper.settingRefs.refFormat.settingEl
        );
        this.containerEl.insertAfter(
            extraHelper.settingRefs.noteTitleInEquationLink.settingEl, 
            globalHelper.settingRefs.eqRefSuffix.settingEl
        );

        this.containerEl.insertBefore(
            globalHelper.settingRefs.insertSpace.settingEl,
            extraHelper.settingRefs.searchMethod.settingEl,
        );

        // const projectHeading = containerEl.createEl("h3", { text: "Projects (experimental)" });
        // const projectDesc = containerEl.createDiv({
        //     text: PROJECT_DESCRIPTION,
        //     cls: ["setting-item-description", "math-booster-setting-item-description"]
        // });

        // this.containerEl.insertBefore(
        //     projectHeading,
        //     extraHelper.settingRefs.projectInfix.settingEl
        // );
        // this.containerEl.insertAfter(
        //     projectDesc,
        //     projectHeading,
        // );

        this.addRestoreDefaultsButton();

        containerEl.createEl("h4", { text: t('settings.local') });
        new Setting(containerEl).setName(t('settings.localSettings'))
            .setDesc(t('settings.localSettingsDesc'))
            .addButton((btn) => {
                btn.setButtonText(t('settings.searchFilesAndFolders'))
                    .onClick(() => {
                        new LocalContextSettingsSuggestModal(this.app, this.plugin, this).open();
                    });
            });

        new Setting(containerEl)
            .setName(t('settings.excludedFiles'))
            .setDesc(t('settings.excludedFilesDesc'))
            .addButton((btn) => {
                btn.setButtonText(t('settings.manage'))
                    .onClick(() => {
                        new ExcludedFileManageModal(this.app, this.plugin).open();
                    });
            });
    }

    async hide() {
        super.hide();
        await this.plugin.saveSettings();
        this.plugin.indexManager.trigger('global-settings-updated');
        this.plugin.updateLinkAutocomplete();
        this.component.unload();
    }
}
