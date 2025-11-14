export function getSelectedItem<T>(suggestions: { values: T[], selectedItem: number }): T | undefined {
    return suggestions.values[suggestions.selectedItem];
}
