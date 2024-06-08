import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import Image, { type ImageProps } from 'next/image'

import { getWriteup } from '@/util/get-all-writeups'
import { CopyButton } from '@/components/copy-button'

import type { MDXComponents } from 'mdx/types'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export default async function Page({ params }: { params: { slug: string } }) {
    const writeup = await getWriteup(params.slug)
    if (!writeup) notFound()

    const mdxComponents: MDXComponents = {
        p: function ({
            children,
            ...props
        }: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) {
            return <div {...props}>{children}</div>
        },
        blockquote: function ({
            children,
            ...props
        }: DetailedHTMLProps<HTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>) {
            return (
                <blockquote
                    {...props}
                    className={
                        'border-l-4 border-gray-800 dark:border-gray-300 bg-gray-900 dark:bg-gray-900 p-4 my-4 italic'
                    }
                >
                    {children}
                </blockquote>
            )
        },
        pre: function ({
            children,
            ...props
        }: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
            const propsObj = { ...props }
            const propsValues = Object.values(propsObj)
            const [, , dataLanguage, dataTheme, code] = propsValues
            const lang = dataLanguage || 'shell'

            return (
                <pre data-language={lang} data-theme={dataTheme} className={'py-4'}>
                    <div className="bg-gray-900 rounded-md overflow-x-auto">
                        <div
                            className={
                                'bg-gray-800 flex items-center relative px-4 py-2 text-sm font-sans justify-between rounded-t-md'
                            }
                        >
                            {lang}
                            <CopyButton text={code} />
                        </div>

                        <div className={'p-2'}>{children}</div>
                    </div>
                </pre>
            )
        },
        h2: function ({
            children,
            ...props
        }: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
            return (
                <h2 {...props} className={'text-3xl font-bold mt-8 mb-4'}>
                    {children}
                </h2>
            )
        },
        img: function ({ ...props }) {
            return (
                <div className="relative w-full h-96">
                    <Image {...(props as ImageProps)} fill />
                </div>
            )
        },
    }

    return (
        <div className="font-sans mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
            <h1 className="text-5xl font-bold">{writeup.title}</h1>
            <div>
                <span className="text-gray-500 dark:text-gray-400">
                    {format(writeup.date, 'LLLL d, yyyy')}
                </span>
            </div>

            <MDXRemote
                source={writeup.body}
                options={{
                    mdxOptions: {
                        remarkPlugins: [
                            remarkGfm,
                            remarkFrontmatter,
                            [
                                remarkToc,
                                {
                                    tight: true,
                                    maxDepth: 5,
                                },
                            ],
                        ],
                        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
                    },
                }}
                components={mdxComponents}
            />
        </div>
    )
}
