'use client'
import { Player } from '@lottiefiles/react-lottie-player'

export default function LottiePlayer() {
    return (
        <Player
            autoplay
            loop
            src="/robot.json"
            style={{ height: '500px', width: '500px' }}
        />
    )
}
