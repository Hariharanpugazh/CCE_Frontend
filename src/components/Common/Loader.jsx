import { createContext, useContext, useEffect } from "react"

export const LoaderContext = createContext()

export function LoaderLayout() {
    const { isLoading } = useContext(LoaderContext)

    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }, [isLoading])

    return (
        <section className="dots-container z-[9000] bg-gray-200 backdrop-blur-sm" hidden={!isLoading}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </section>
    )
}