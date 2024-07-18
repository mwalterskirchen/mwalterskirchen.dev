import * as fs from 'fs/promises'
import * as path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'

import type { WriteupType } from '@/types/writeup.type'

export const getAllWriteups = cache(async (): Promise<WriteupType[]> => {
    const writeups = await fs.readdir('./_writeups')

    const writeupsData = await Promise.all(
        writeups
            .filter((file) => path.extname(file) === '.mdx')
            .map(async (writeup) => {
                const fileContent = await fs.readFile(`./_writeups/${writeup}`, 'utf8')
                const { data, content } = matter(fileContent)

                if (data.published === false) {
                    return undefined
                }

                return { ...data, body: content } as WriteupType
            })
    )

    return writeupsData.filter((writeup): writeup is WriteupType => writeup !== undefined)
})

export const getWriteup = async (slug: string) => {
    const writeups = await getAllWriteups()

    return writeups.find((writeup) => writeup?.slug === slug)
}
