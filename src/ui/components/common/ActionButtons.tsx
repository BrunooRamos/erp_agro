interface ActionButtonsProps {
    onCancel: () => void;
    onSubmit: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    isSubmitting?: boolean;
}

export const ActionButtons = ({
    onCancel,
    onSubmit,
    submitLabel = 'Guardar',
    cancelLabel = 'Cancelar',
    isSubmitting = false
}: ActionButtonsProps) => {
    return (
        <div className="col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 focus:outline-none transition-colors"
                >
                    {cancelLabel}
                </button>
                <button
                    type="submit"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-zinc-800 text-white rounded-sm hover:bg-zinc-900 focus:outline-none transition-colors disabled:bg-zinc-400"
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
}; 