// English translations
export const en = {
	// Commands
	commands: {
		insertDisplayMath: 'Insert display math',
		insertTheoremCallout: 'Insert theorem callout',
		search: 'Search',
		openLocalSettings: 'Open local settings for the current note',
		insertProof: 'Insert proof',
		convertEquationNumber: 'Convert equation numbers in the current note to static \\tag{}',
		migrateFromV1: 'Migrate from version 1',
	},

	// Settings Tab
	settings: {
		global: 'Global',
		local: 'Local',
		restoreDefaults: 'Restore defaults',
		clear: 'Clear',
		localSettings: 'Local settings',
		localSettingsDesc: 'You can set up local (i.e. file-specific or folder-specific) settings, which have more precedence than the global settings. Local settings can be configured in various ways; here in the plugin settings, right-clicking in the file explorer, the "Open local settings for the current file" command, and the "Open local settings for the current file" button in the theorem callout settings pop-ups.',
		searchFilesAndFolders: 'Search files & folders',
		excludedFiles: 'Excluded files',
		excludedFilesDesc: 'You can make your search results more visible by excluding certain files or folders.',
		manage: 'Manage',
		
		// Theorem Callout Settings
		type: 'Type',
		number: 'Number',
		numberDesc: {
			auto: '"auto" - automatically numbered',
			blank: 'blank - unnumbered',
			otherwise: 'otherwise - used as is',
		},
		title: 'Title',
		titleDesc: 'You can include inline math in the title.',
		pandocLabel: 'Pandoc label',
		titlePlaceholder: 'Ex) $\\sigma$-algebra',
		fold: 'Fold',
		
		// Profile Settings
		profile: 'Profile',
		manageProfiles: 'Manage profiles',
		addProfile: 'Add profile',
		editProfile: 'Edit profile',
		deleteProfile: 'Delete profile',
		profileName: 'Name',
		profileTags: 'Tags',
		profileTagsDesc: 'Comma-separated list of tags. Only lower-case alphabets or hyphens are allowed. Each tag is converted into a CSS class ".theorem-callout-<tag>".',
		profileTagsError: 'A tag can only contain lower-case alphabets or hyphens.',
		theoremLikeEnvironments: 'Theorem-like environments',
		proofs: 'Proofs',
		beginningOfProof: 'Beginning of proof',
		endingOfProof: 'Ending of proof',
		prefix: 'Prefix',
		suffix: 'Suffix',
		linkedProofs: 'Linked proofs',
		linkedProofsDesc: 'For example, you can render `\\begin{proof}`@[[link to Theorem 1]] as "Proof of Theorem 1".',
		
		// General Settings
		equationsGeneral: 'Equations - general',
		theoremCalloutStyle: 'Theorem callout style',
		excludeExampleCallout: 'Exclude example callout',
		showEditButton: 'Show theorem callout edit button',
		foldDefault: 'Fold default',
		setOnlyTheoremAsMain: 'Set only theorem as main',
		setLabelInModal: 'Set label in modal',
		labelPrefix: 'Label prefix',
		noteTitleInTheoremLink: 'Note title in theorem link',
		refFormat: 'Reference format',
		noteTitleInEquationLink: 'Note title in equation link',
		eqRefSuffix: 'Equation reference suffix',
		insertSpace: 'Insert space',
		searchMethod: 'Search method',
		
		// Extra Settings
		enableProof: 'Enable proof',
		suggestNumber: 'Number of suggestions',
		
		// MathContextSettings - detailed settings
		theoremCalloutsGeneral: 'Theorem callouts - general',
		style: 'Style',
		styleDesc: 'Choose between your custom style and preset styles. You might need to reopen the notes or reload the app to see the changes. See the documentation for how to customize the appearance of theorem callouts. "Custom" is recommended, since it will give you the most control. You can view the CSS snippets for all the preset styles in the documentation or README on GitHub. The preset styles are only for a trial purpose, and they might not work well with some non-default themes.',
		theoremCalloutFontInherit: 'Don\'t override the app\'s font setting when using preset styles',
		theoremCalloutFontInheritDesc: 'You will need to reload the note to see the changes.',
		titleSuffix: 'Title suffix',
		titleSuffixDesc: 'Ex) "" > Definition 2 (Group) / "." > Definition 2 (Group).',
		labelPrefixDesc: 'Useful for ensuring no label collision. Ex) When "Pandoc label prefix" = "foo:", A theorem with "Pandoc label" = "bar" is assigned "thm:foo:bar."',
		
		theoremCalloutsNumbering: 'Theorem callouts - numbering',
		numberingMode: 'Numbering mode',
		numberingModeDesc: 'Choose how theorem callouts are numbered: "Unified" (default) - all types share one counter (Theorem 1, Definition 2, Lemma 3, ...); "Separate" - each type has its own counter (Theorem 1, Definition 1, Lemma 1, ...); "Detailed" - adds section numbers based on H1 headings, with separate counters per type (Theorem 1.1, Definition 1.1, Theorem 2.1, ...).',
		inferNumberPrefix: 'Infer prefix from note title or properties',
		inferNumberPrefixDesc: 'Automatically infer a prefix from the note title or properties. See the documentation (Settings > Prefix inference) for an example.',
		inferNumberPrefixFromProperty: 'Use property as source',
		inferNumberPrefixFromPropertyDesc: 'If set, use this property as the source of prefix inference. If not set, the note title will be used as the source.',
		inferNumberPrefixRegExp: 'Regular expression for parsing',
		manualPrefix: 'Manual prefix',
		manualPrefixDesc: 'Even if "Infer prefix from note title or properties" is turned on, the inferred prefix will be overwritten by the value set here.',
		numberSuffix: 'Suffix',
		numberInit: 'Initial count',
		numberStyle: 'Style',
		numberDefaultDesc: 'Default value for the "Number" field of "Insert theorem callout" modal',
		
		theoremCalloutsReferencing: 'Theorem callouts - referencing',
		format: 'Format',
		noteMathLinkFormat: 'Format for a note that has its "main" theorem callout',
		noteMathLinkFormatDesc: 'When a theorem callout is set as main by a markdown comment "%% main %%", this format will be used for links to the note containing that theorem callout.',
		ignoreMainTheoremCalloutWithoutTitle: 'Ignore a "main" theorem callout without its own title',
		
		equationsNumbering: 'Equations - numbering',
		numberOnlyReferencedEquations: 'Number only referenced equations',
		inferEqNumberPrefix: 'Infer prefix from note title or properties',
		inferEqNumberPrefixDesc: 'Automatically infer a prefix from the note title or properties. See the documentation (Settings > Prefix inference) for an example.',
		inferEqNumberPrefixFromProperty: 'Use property as source',
		inferEqNumberPrefixFromPropertyDesc: 'If set, use this property as the source of prefix inference. If not set, the note title will be used as the source.',
		inferEqNumberPrefixRegExp: 'Regular expression for parsing',
		eqManualPrefix: 'Manual prefix',
		eqManualPrefixDesc: 'Even if "Infer prefix from note title" is turned on, the inferred prefix will be overwritten by the value set here.',
		eqNumberSuffix: 'Suffix',
		eqNumberInit: 'Initial count',
		eqNumberStyle: 'Style',
		lineByLine: 'Number line by line in align',
		
		equationsReferencing: 'Equations - referencing',
		eqRefPrefix: 'Prefix',
		
		proofsExperimental: 'Proofs (experimental)',
		beginProof: 'Beginning of a proof',
		endProof: 'End of a proof',
		
		searchLinkAutocompletionGeneral: 'Search & link auto-completion - general',
		searchLinkAutocompletionNote: '**NOTE:** If you have the [**Quick Preview**](https://github.com/RyotaUshio/obsidian-quick-preview) plugin installed, holding down `Alt`/`Option` _(by default)_ will trigger a quick preview of the selected suggestion with the context around it.',
		insertSpaceDesc: 'Append whitespace after inserted link',
		
		profileDesc: 'A profile defines the displayed name of each environment.',
		
		// ExtraSettings
		foldDefaultDesc: 'Default collapsibility when using the "Insert theorem callout" command',
		noteTitleInTheoremLinkDesc: 'If turned on, a link to "Theorem 1" will look like "Note title > Theorem 1".',
		noteTitleInEquationLinkDesc: 'If turned on, a link to "Eq.(1)" will look like "Note title > Eq.(1)".',
		excludeExampleCalloutDesc: 'If turned on, a callout of the form "> [!example]" will be treated as Obsidian\'s built-in "Example" callout, and you will need to type "> [!exm]" instead to insert a theorem callout of "Example" type.',
		showEditButtonDesc: 'Show an edit button on a theorem callout',
		setOnlyTheoremAsMainDesc: 'Regardless of this setting, putting "%% main %%" or "%% main: true %%" in a theorem callout will set it as main one of the note, which means any link to that note will be displayed with the theorem\'s title. Enabling this option implicitly sets a theorem callout as main when it\'s the only one in the note.',
		setLabelInModalDesc: 'Show LaTeX/Pandoc label input form in theorem callout insert/edit modal',
		enableProofDesc: 'For example, you can replace a pair of inline codes with styled text. You can style it with CSS snippets. See the documentation for the details.',
		
		suggestNumberDesc: 'Specify how many items are suggested at one time. Set it to a smaller value if you have a performance issue when equation suggestions with math rendering on.',
		renderMathInSuggestion: 'Render math in equation suggestions',
		renderMathInSuggestionDesc: 'Turn this off if you have a performance issue and reducing the number of suggestions doesn\'t fix it.',
		searchMethodDesc: 'Fuzzy search is more flexible, but simple search is lighter-weight.',
		searchLabel: 'Include theorem callout label for search target',
		upWeightRecent: 'Up-weight recently opened notes by',
		upWeightRecentDesc: 'It takes effect only if "Search only recently opened notes" is turned off.',
		modifierToJump: 'Modifier key for jumping to suggestion',
		modifierToJumpDesc: 'Press Enter and this modifier key to jump to the currently selected suggestion. Changing this option requires to reloading the plugin to take effect.',
		modifierToNoteLink: 'Modifier key for insert link to note',
		modifierToNoteLinkDesc: 'Press Enter and this modifier key to insert a link to the note containing the currently selected item. Changing this option requires to reloading the plugin to take effect.',
		showModifierInstruction: 'Show modifier key instruction',
		showModifierInstructionDesc: 'Show the instruction for the modifier key at the bottom of suggestion box. Changing this option requires to reloading the plugin to take effect.',
		modifierNote1: 'Mod is Cmd on MacOS and Ctrl on other OS.',
		modifierNote2: 'Meta is Cmd on MacOS and Win key on Windows.',
		openingOption: 'Opening option',
		openingOptionDesc: 'Specify how to open the selected suggestion.',
		
		enhanceBuiltinLinkAutocompletion: 'Enhance Obsidian\'s built-in link auto-completion (experimental)',
		enhanceBuiltinLinkAutocompletionDesc: 'Configure how this plugin modifies the appearance of Obsidian\'s built-in link auto-completion (the one that pops up when you type "[["). This feature dives deep into Obsidian\'s internals, so it might break when Obsidian is updated. If you encounter any issue, please report it on GitHub.',
		showTheoremTitleinBuiltin: 'Show theorem title',
		showTheoremContentinBuiltin: 'Show theorem content',
		showTheoremContentinBuiltinDesc: 'Only effective when "Show theorem title" is turned on.',
		
		configureCustomEditorLinkAutocompletion: 'Configure this plugin\'s custom editor link auto-completion',
		configureCustomEditorLinkAutocompletionDesc: 'It is recommended to turn off unnecessary auto-completions to improve performance.',
		autocompleteDvQuery: 'Dataview query for editor link auto-completion',
		autocompleteDvQueryDesc: 'Only LIST queries are supported.',
		
		theoremEquationSuggestion: 'Theorem & equation suggestion',
		fromEntireVault: 'From entire vault',
		enable: 'Enable',
		trigger: 'Trigger',
		fromRecentlyOpenedNotes: 'From recently opened notes',
		fromActiveNote: 'From active note',
		fromDataviewQuery: 'From Dataview query',
		
		theoremSuggestion: 'Theorem suggestion',
		equationSuggestion: 'Equation suggestion',
		
		indexing: 'Indexing',
		indexerThreads: 'Indexer threads',
		indexerThreadsDesc: 'The maximum number of thread used for indexing.',
		indexerCpuUtilization: 'Indexer CPU utilization',
		indexerCpuUtilizationDesc: 'The CPU utilization that indexer threads should use.',
	},

	// Modals
	modals: {
		// Theorem Callout Modal
		insert: 'Insert',
		save: 'Save',
		cancel: 'Cancel',
		confirm: 'Confirm',
		delete: 'Delete',
		open: 'Open',
		add: 'Add',
		editTheoremCallout: 'Edit theorem callout settings',
		
		// Local Settings Modal
		localSettingsFor: 'Local settings for ',
		localSettingsNote: 'If you want the change to apply to the entire vault, go to the plugin settings.',
		openLocalSettingsButton: 'Open local settings for the current note',
		
		// Profile Modals
		confirmDelete: 'Are you sure you want to delete the profile',
		updateProfiles: 'Update profiles',
		updateProfilesDesc: 'The following local setting(s) are affected by the deletion of profile',
		updateProfilesDesc2: 'Select a new profile to be applied for them.',
		enterName: 'Enter name...',
		
		// Excluded Files Modal
		excludedFilesTitle: 'Excluded files/folders',
		excludedFilesNote: 'The files/folders in this list and their descendants will be excluded from suggestion for local settings.',
		vaultRoot: '(Vault root)',
	},

	// Search Modal
	search: {
		queryType: 'Query type',
		queryTypes: {
			both: 'Theorems and equations',
			theorem: 'Theorems',
			equation: 'Equations',
		},
		searchRange: 'Search range',
		searchRanges: {
			vault: 'Vault',
			recent: 'Recent notes',
			active: 'Active note',
			dataview: 'Dataview query',
		},
		dataviewQuery: 'Dataview query',
		dataviewQueryDesc: 'Only LIST queries are supported.',
		dataviewQueryPlaceholder: 'LIST ...',
		dataviewDisabled: 'Retry after enabling Dataview.',
		typePlaceholder: 'Type here...',
	},

	// Notices
	notices: {
		failedToFetchMetadata: 'Failed to fetch the metadata of file',
		failedToReadCache: 'Failed to read cache. Retry again later.',
		couldNotFindLineNumber: 'Could not find the line number to overwrite. Retry later.',
		obsidianIndexing: 'Obsidian is still indexing the vault. Try again after the cache is fully initialized.',
		failedToPatchLinkCompletion: 'Failed to patch Obsidian\'s built-in link completion. Please reload',
		failedPDFExport: 'Failed to fetch the metadata for PDF export; equation numbers will not be displayed in the exported PDF.',
		unexpectedPDFExport: 'Something unexpected occured while preprocessing for PDF export. Equation numbers might not be displayed properly in the exported PDF.',
		unexpectedPDFExportDetails: 'Something unexpected occured while preprocessing for PDF export. See the developer console for the details. Equation numbers might not be displayed properly in the exported PDF.',
	},
};

export type TranslationKeys = typeof en;
