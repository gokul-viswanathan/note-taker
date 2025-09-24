export default function PathStyle({ path }: { path: string }) {
    const pathSplit = path.split("/").filter(Boolean)
    return (
        <div className="w-auto px-3 py-1 flex items-center justify-center">
            {pathSplit.map((eachFile, index) => (
                <div
                    key={index}
                >
                    <span className="mx-2">/</span>
                    <span className="font-bold text-sm">{eachFile}</span>
                </div>
            ))}
        </div>
    );
}
