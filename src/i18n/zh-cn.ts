import { TranslationKeys } from './en';

// 中文翻译
export const zhCN: TranslationKeys = {
	// 命令
	commands: {
		insertDisplayMath: '插入行间公式',
		insertTheoremCallout: '插入定理标注',
		search: '搜索',
		openLocalSettings: '打开当前笔记的局部设置',
		insertProof: '插入证明',
		convertEquationNumber: '将当前笔记的公式编号转换为静态 \\tag{}',
		migrateFromV1: '从版本 1 迁移',
	},

	// 设置选项卡
	settings: {
		global: '全局设置',
		local: '局部设置',
		restoreDefaults: '恢复默认值',
		clear: '清除',
		localSettings: '局部设置',
		localSettingsDesc: '你可以设置局部（即特定文件或文件夹）设置，它们的优先级高于全局设置。局部设置可以通过多种方式配置：在插件设置中、在文件管理器中右键点击、使用"打开当前笔记的局部设置"命令，以及在定理标注设置弹窗中的"打开当前笔记的局部设置"按钮。',
		searchFilesAndFolders: '搜索文件和文件夹',
		excludedFiles: '排除的文件',
		excludedFilesDesc: '你可以通过排除某些文件或文件夹来让搜索结果更清晰。',
		manage: '管理',
		
		// 定理标注设置
		type: '类型',
		number: '编号',
		numberDesc: {
			auto: '"auto" - 自动编号',
			blank: '留空 - 不编号',
			otherwise: '其他 - 原样使用',
		},
		title: '标题',
		titleDesc: '你可以在标题中使用行内公式。',
		pandocLabel: 'Pandoc 标签',
		titlePlaceholder: '例：$\\sigma$-代数',
		fold: '折叠',
		
		// 配置文件设置
		profile: '配置文件',
		manageProfiles: '管理配置文件',
		addProfile: '添加配置文件',
		editProfile: '编辑配置文件',
		deleteProfile: '删除配置文件',
		profileName: '名称',
		profileTags: '标签',
		profileTagsDesc: '逗号分隔的标签列表。只允许使用小写字母或连字符。每个标签会被转换为 CSS 类".theorem-callout-<标签>"。',
		profileTagsError: '标签只能包含小写字母或连字符。',
		theoremLikeEnvironments: '类定理环境',
		proofs: '证明',
		beginningOfProof: '证明开头',
		endingOfProof: '证明结尾',
		prefix: '前缀',
		suffix: '后缀',
		linkedProofs: '链接的证明',
		linkedProofsDesc: '例如，你可以将 `\\begin{proof}`@[[定理 1 的链接]] 渲染为"定理 1 的证明"。',
		
		// 通用设置
		equationsGeneral: '公式 - 通用',
		theoremCalloutStyle: '定理标注样式',
		excludeExampleCallout: '排除示例标注',
		showEditButton: '显示定理标注编辑按钮',
		foldDefault: '默认折叠',
		setOnlyTheoremAsMain: '仅将定理设为主要',
		setLabelInModal: '在弹窗中设置标签',
		labelPrefix: '标签前缀',
		noteTitleInTheoremLink: '定理链接中的笔记标题',
		refFormat: '引用格式',
		noteTitleInEquationLink: '公式链接中的笔记标题',
		eqRefSuffix: '公式引用后缀',
		insertSpace: '插入空格',
		searchMethod: '搜索方式',
		
		// 额外设置
		enableProof: '启用证明',
		suggestNumber: '建议数量',
		
		// MathContextSettings - 详细设置
		theoremCalloutsGeneral: '定理标注 - 通用',
		style: '样式',
		styleDesc: '在自定义样式和预设样式之间选择。你可能需要重新打开笔记或重新加载应用才能看到更改。有关如何自定义定理标注外观，请参阅文档。推荐使用"自定义"，因为它能提供最大的控制权。你可以在文档或 GitHub 的 README 中查看所有预设样式的 CSS 代码片段。预设样式仅供试用，可能无法与某些非默认主题很好地配合使用。',
		theoremCalloutFontInherit: '使用预设样式时不覆盖应用的字体设置',
		theoremCalloutFontInheritDesc: '你需要重新加载笔记才能看到更改。',
		titleSuffix: '标题后缀',
		titleSuffixDesc: '例：""  > 定义 2 (群) / "."  > 定义 2 (群).',
		labelPrefixDesc: '用于确保标签不冲突。例如：当"Pandoc 标签前缀"= "foo:" 时，一个"Pandoc 标签"= "bar" 的定理会被分配为 "thm:foo:bar"。',
		
		theoremCalloutsNumbering: '定理标注 - 编号',
		numberingMode: '编号模式',
		numberingModeDesc: '选择定理标注的编号方式：“统一编号”（默认）- 所有类型共用一个计数器（定理 1、定义 2、引理 3、...）；“分开编号”- 每种类型有自己的计数器（定理 1、定义 1、引理 1、...）；“详细编号”- 预留以供未来使用。',
		inferNumberPrefix: '从笔记标题或属性推断前缀',
		inferNumberPrefixDesc: '自动从笔记标题或属性推断前缀。请参阅文档（设置 > 前缀推断）中的示例。',
		inferNumberPrefixFromProperty: '使用属性作为来源',
		inferNumberPrefixFromPropertyDesc: '如果设置，使用此属性作为前缀推断的来源。如果未设置，将使用笔记标题作为来源。',
		inferNumberPrefixRegExp: '解析用正则表达式',
		manualPrefix: '手动前缀',
		manualPrefixDesc: '即使"从笔记标题或属性推断前缀"已启用，推断的前缀也会被此处设置的值覆盖。',
		numberSuffix: '后缀',
		numberInit: '初始计数',
		numberStyle: '样式',
		numberDefaultDesc: '"插入定理标注"模态框中"编号"字段的默认值',
		
		theoremCalloutsReferencing: '定理标注 - 引用',
		format: '格式',
		noteMathLinkFormat: '具有"主要"定理标注的笔记的格式',
		noteMathLinkFormatDesc: '当通过 markdown 注释 "%% main %%" 将定理标注设置为主要时，将使用此格式来显示指向包含该定理标注的笔记的链接。',
		ignoreMainTheoremCalloutWithoutTitle: '忽略没有自己标题的"主要"定理标注',
		
		equationsNumbering: '公式 - 编号',
		numberOnlyReferencedEquations: '仅对引用的公式编号',
		inferEqNumberPrefix: '从笔记标题或属性推断前缀',
		inferEqNumberPrefixDesc: '自动从笔记标题或属性推断前缀。请参阅文档（设置 > 前缀推断）中的示例。',
		inferEqNumberPrefixFromProperty: '使用属性作为来源',
		inferEqNumberPrefixFromPropertyDesc: '如果设置，使用此属性作为前缀推断的来源。如果未设置，将使用笔记标题作为来源。',
		inferEqNumberPrefixRegExp: '解析用正则表达式',
		eqManualPrefix: '手动前缀',
		eqManualPrefixDesc: '即使"从笔记标题推断前缀"已启用，推断的前缀也会被此处设置的值覆盖。',
		eqNumberSuffix: '后缀',
		eqNumberInit: '初始计数',
		eqNumberStyle: '样式',
		lineByLine: '在 align 中逐行编号',
		
		equationsReferencing: '公式 - 引用',
		eqRefPrefix: '前缀',
		
		proofsExperimental: '证明（实验性）',
		beginProof: '证明开头',
		endProof: '证明结尾',
		
		searchLinkAutocompletionGeneral: '搜索与链接自动补全 - 通用',
		searchLinkAutocompletionNote: '**注意：** 如果你安装了 [**Quick Preview**](https://github.com/RyotaUshio/obsidian-quick-preview) 插件，按住 `Alt`/`Option` _(默认)_ 将触发所选建议及其周围上下文的快速预览。',
		insertSpaceDesc: '在插入的链接后附加空格',
		
		profileDesc: '配置文件定义每个环境的显示名称。',
		
		// 额外设置详细
		foldDefaultDesc: '使用"插入定理标注"命令时的默认可折叠性',
		noteTitleInTheoremLinkDesc: '如果启用，指向"定理 1"的链接将显示为"笔记标题 > 定理 1"。',
		noteTitleInEquationLinkDesc: '如果启用，指向"公式(1)"的链接将显示为"笔记标题 > 公式(1)"。',
		excludeExampleCalloutDesc: '如果启用，形如 "> [!example]" 的标注将被视为 Obsidian 的内置"示例"标注，你需要输入 "> [!exm]" 来插入"示例"类型的定理标注。',
		showEditButtonDesc: '在定理标注上显示编辑按钮',
		setOnlyTheoremAsMainDesc: '无论此设置如何，在定理标注中放置 "%% main %%" 或 "%% main: true %%" 都会将其设置为笔记的主要定理，这意味着任何指向该笔记的链接都将显示定理的标题。启用此选项会在定理标注是笔记中唯一的定理时隐式地将其设置为主要定理。',
		setLabelInModalDesc: '在定理标注插入/编辑模态框中显示 LaTeX/Pandoc 标签输入表单',
		enableProofDesc: '例如，你可以用样式化文本替换一对内联代码。你可以使用 CSS 代码片段进行样式设置。请参阅文档了解详情。',
		
		suggestNumberDesc: '指定一次建议多少项。如果在渲染数学公式的方程式建议时遇到性能问题，请将其设置为较小的值。',
		renderMathInSuggestion: '在公式建议中渲染数学公式',
		renderMathInSuggestionDesc: '如果遇到性能问题且减少建议数量无法解决，请关闭此选项。',
		searchMethodDesc: '模糊搜索更灵活，但简单搜索更轻量。',
		searchLabel: '将定理标注标签包含在搜索目标中',
		upWeightRecent: '对最近打开的笔记增加权重',
		upWeightRecentDesc: '仅在"仅搜索最近打开的笔记"关闭时生效。',
		modifierToJump: '跳转到建议的修饰键',
		modifierToJumpDesc: '按 Enter 和此修饰键跳转到当前选定的建议。更改此选项需要重新加载插件才能生效。',
		modifierToNoteLink: '插入笔记链接的修饰键',
		modifierToNoteLinkDesc: '按 Enter 和此修饰键插入指向包含当前选定项的笔记的链接。更改此选项需要重新加载插件才能生效。',
		showModifierInstruction: '显示修饰键说明',
		showModifierInstructionDesc: '在建议框底部显示修饰键的说明。更改此选项需要重新加载插件才能生效。',
		modifierNote1: 'Mod 在 MacOS 上是 Cmd，在其他操作系统上是 Ctrl。',
		modifierNote2: 'Meta 在 MacOS 上是 Cmd，在 Windows 上是 Win 键。',
		openingOption: '打开选项',
		openingOptionDesc: '指定如何打开选定的建议。',
		
		enhanceBuiltinLinkAutocompletion: '增强 Obsidian 内置链接自动补全（实验性）',
		enhanceBuiltinLinkAutocompletionDesc: '配置此插件如何修改 Obsidian 内置链接自动补全的外观（输入"[["时弹出的那个）。此功能深入 Obsidian 内部，因此在 Obsidian 更新时可能会出现问题。如果遇到任何问题，请在 GitHub 上报告。',
		showTheoremTitleinBuiltin: '显示定理标题',
		showTheoremContentinBuiltin: '显示定理内容',
		showTheoremContentinBuiltinDesc: '仅在"显示定理标题"启用时有效。',
		
		configureCustomEditorLinkAutocompletion: '配置此插件的自定义编辑器链接自动补全',
		configureCustomEditorLinkAutocompletionDesc: '建议关闭不必要的自动补全以提高性能。',
		autocompleteDvQuery: '用于编辑器链接自动补全的 Dataview 查询',
		autocompleteDvQueryDesc: '仅支持 LIST 查询。',
		
		theoremEquationSuggestion: '定理与公式建议',
		fromEntireVault: '来自整个仓库',
		enable: '启用',
		trigger: '触发器',
		fromRecentlyOpenedNotes: '来自最近打开的笔记',
		fromActiveNote: '来自当前笔记',
		fromDataviewQuery: '来自 Dataview 查询',
		
		theoremSuggestion: '定理建议',
		equationSuggestion: '公式建议',
		
		indexing: '索引',
		indexerThreads: '索引器线程',
		indexerThreadsDesc: '用于索引的最大线程数。',
		indexerCpuUtilization: '索引器 CPU 利用率',
		indexerCpuUtilizationDesc: '索引器线程应使用的 CPU 利用率。',
	},

	// 模态框
	modals: {
		// 定理标注模态框
		insert: '插入',
		save: '保存',
		cancel: '取消',
		confirm: '确认',
		delete: '删除',
		open: '打开',
		add: '添加',
		editTheoremCallout: '编辑定理标注设置',
		
		// 局部设置模态框
		localSettingsFor: '局部设置：',
		localSettingsNote: '如果你想让更改应用于整个仓库，请前往插件设置。',
		openLocalSettingsButton: '打开当前笔记的局部设置',
		
		// 配置文件模态框
		confirmDelete: '确定要删除配置文件',
		updateProfiles: '更新配置文件',
		updateProfilesDesc: '以下局部设置受到配置文件删除的影响',
		updateProfilesDesc2: '请为它们选择一个新的配置文件。',
		enterName: '输入名称...',
		
		// 排除文件模态框
		excludedFilesTitle: '排除的文件/文件夹',
		excludedFilesNote: '此列表中的文件/文件夹及其子项将不会出现在局部设置的建议中。',
		vaultRoot: '（仓库根目录）',
	},

	// 搜索模态框
	search: {
		queryType: '查询类型',
		queryTypes: {
			both: '定理和公式',
			theorem: '定理',
			equation: '公式',
		},
		searchRange: '搜索范围',
		searchRanges: {
			vault: '仓库',
			recent: '最近笔记',
			active: '当前笔记',
			dataview: 'Dataview 查询',
		},
		dataviewQuery: 'Dataview 查询',
		dataviewQueryDesc: '仅支持 LIST 查询。',
		dataviewQueryPlaceholder: 'LIST ...',
		dataviewDisabled: '启用 Dataview 后重试。',
		typePlaceholder: '在此输入...',
	},

	// 通知
	notices: {
		failedToFetchMetadata: '获取文件元数据失败',
		failedToReadCache: '读取缓存失败。稍后重试。',
		couldNotFindLineNumber: '找不到要覆盖的行号。稍后重试。',
		obsidianIndexing: 'Obsidian 仍在索引仓库。请在缓存完全初始化后重试。',
		failedToPatchLinkCompletion: '修补 Obsidian 内置链接补全失败。请重新加载',
		failedPDFExport: '获取 PDF 导出的元数据失败；公式编号将不会显示在导出的 PDF 中。',
		unexpectedPDFExport: '预处理 PDF 导出时发生意外。公式编号可能无法在导出的 PDF 中正确显示。',
		unexpectedPDFExportDetails: '预处理 PDF 导出时发生意外。请查看开发者控制台了解详情。公式编号可能无法在导出的 PDF 中正确显示。',
	},
};
