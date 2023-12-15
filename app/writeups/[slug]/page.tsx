import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

import { CopyButton } from '@/components/copy-button'
import { getWriteup } from '@/util/get-all-writeups'

import type { MDXComponents } from 'mdx/types'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
export default async function Page({ params }: { params: { slug: string } }) {
    const writeup = await getWriteup(params.slug)

    console.log('writeup', writeup)

    if (!writeup) notFound()

    const mdxComponents: MDXComponents = {
        // Override the default <pre> element
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
                    <div className="bg-gray-50 rounded-md overflow-x-auto">
                        <div
                            className={
                                'bg-gray-200 dark:text-black flex items-center relative px-4 py-2 text-sm font-sans justify-between rounded-t-md'
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
    }

    return (
        <div className="font-sans mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
            <h1 className="text-xl">{writeup.title}</h1>
            <p>
                <span className="text-gray-500 dark:text-gray-400">
                    {format(writeup.date, 'LLLL d, yyyy')}
                </span>
            </p>
            <article>
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
            </article>
        </div>
    )
}
