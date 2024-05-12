import Link from "next/link"

export default function Marketing() {
    return (
        <div className="flex flex-col dark:bg-gray-950 dark:text-gray-50 w-full">
            <main className="flex-1">
                <section className="w-full py-4 md:py-24 lg:py-13">
                    <div className="container px-4 md:px-6 flex justify-center">
                        <div className="flex w-[50%] text-center">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none dark:text-gray-50">
                                        Presenting <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text">Vivum</span>, <div>your Research Assistant</div>
                                    </h1>
                                    <p className="w-full text-gray-500 md:text-lg text-sm dark:text-gray-400 py-10">
                                        Vivum revolutionizes medical literature search and manuscript creation through an AI-powered platform. Seamlessly access and explore the extensive PubMed database with precision and efficiency.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                                        href="/signup"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                                        href="https://docs.google.com/forms/d/e/1FAIpQLSdJpnAF2mHULcLtFYLQzz9xl8Wb8WwGKbVIP0H86DRLahhGnw/viewform"
                                    >
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 humen All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link
                        className="text-xs hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
                        href="#"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        className="text-xs hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
                        href="#"
                    >
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}
