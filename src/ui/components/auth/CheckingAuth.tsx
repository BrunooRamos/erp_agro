
export const CheckingAuth = () => {
    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
            <div className="flex justify-center">
                {/* Replace CircularProgress with a simple loading spinner */}
                <div className="w-8 h-8 border-4 border-warning border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    )
}