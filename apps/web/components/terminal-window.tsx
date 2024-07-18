import dynamic from 'next/dynamic'

const Terminal = dynamic(() => import('@/components/terminal'), {
    ssr: false,
})

const TerminalWindow = () => {
    return (
        <div className="w-full mt-8">
            <div
                className="px-5 pt-4 shadow-lg  subpixel-antialiased
              bg-gray-800  pb-6 pt-4 rounded-lg leading-normal overflow-hidden"
            >
                <div className="top mb-2 flex">
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    <div className="ml-2 h-3 w-3 bg-orange-300 rounded-full"></div>
                    <div className="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="mt-4 flex">
                    <Terminal />
                </div>
            </div>
        </div>
    )
}

export default TerminalWindow
