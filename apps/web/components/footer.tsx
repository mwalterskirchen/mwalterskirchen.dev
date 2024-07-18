import Image from 'next/image'

export const Footer = () => {
    return (
        <footer className="bg-zinc-900 flex items-center justify-center p-2 gap-5">
            <span>Made with ❤️ by Maximilian Walterskirchen</span>
            <span>
                <a href="https://github.com/mwalterskirchen" target="_blank">
                    <Image
                        src={'/github.svg'}
                        height={18}
                        width={18}
                        alt="@mwalterskirchen GitHub Profile"
                    />
                </a>
            </span>
            <span>
                <a href="https://www.linkedin.com/in/mwalterskirchen/" target="_blank">
                    <Image
                        src={'/linkedin.svg'}
                        height={18}
                        width={18}
                        alt="@mwalterskirchen LinkedIn Profile"
                    />
                </a>
            </span>
        </footer>
    )
}
