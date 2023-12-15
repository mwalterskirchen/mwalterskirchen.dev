import Image from 'next/image'

export const Avatar = () => (
    <Image
        src={'/avatar.png'}
        alt={''}
        width={200}
        height={200}
        className={'rounded-full mb-4'}
    />
)
