import { createContext, useContext, useEffect } from "react"

export const LoaderContext = createContext()

export function LoaderLayout() {
    const { isLoading } = useContext(LoaderContext)

    useEffect(() => {
        console.log(isLoading)

        if (isLoading) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }, [isLoading])

    return (
        <section className="dots-container" hidden={!isLoading}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </section>
    )
}