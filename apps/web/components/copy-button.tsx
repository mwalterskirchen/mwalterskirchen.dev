'use client'

import { useState } from 'react'
import { ClipboardDocumentIcon } from '@heroicons/react/24/solid'

type Text = {
    text: string
}
/**
 * CopyButton implements copy to clipboard functionality
 * @param text
 * @returns
 */
export const CopyButton = ({ text }: Text) => {
    const [isCopied, setIsCopied] = useState(false)

    const copy = async () => {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)

        setTimeout(() => {
            setIsCopied(false)
        }, 10000)
    }

    return (
        <button className="flex ml-auto gap-2" disabled={isCopied} onClick={copy}>
            <ClipboardDocumentIcon width={24} height={24} />
            {isCopied ? 'Copied!' : 'Copy code'}
        </button>
    )
}
