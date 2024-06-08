import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

import { getWriteup } from '@/util/get-all-writeups'
import mdxComponents from '@/util/markdown-components'

export default async function Page({ params }: { params: { slug: string } }) {
    const writeup = await getWriteup(params.slug)
    if (!writeup) notFound()

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
