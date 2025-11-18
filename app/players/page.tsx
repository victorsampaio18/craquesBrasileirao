"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./players.module.css"

interface Player {
  id: number
  name: string
  photo: string
  position: string
  nationality: string
  flag: string
  age: number
  games: number
  clubLogo: string
  shirtNumber: number
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/players.json")
        const data = await response.json()
        setPlayers(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading players:", error)
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  if (isLoading || players.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading...</p>
      </div>
    )
  }

  const currentPlayer = players[currentIndex]
  const prevPlayer = players[(currentIndex - 1 + players.length) % players.length]
  const nextPlayer = players[(currentIndex + 1) % players.length]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % players.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + players.length) % players.length)
  }

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <Link href="/">
          <button className={styles.backButton}>← Home</button>
        </Link>

        <div className={styles.navCenter}>
          <button className={styles.arrowButton} onClick={handlePrev} title="Previous player">
            ←
          </button>

          <div className={styles.playerNames}>
            <span className={styles.prevName}>{prevPlayer.name}</span>
            <span className={styles.currentName}>{currentPlayer.name}</span>
            <span className={styles.nextName}>{nextPlayer.name}</span>
          </div>

          <button className={styles.arrowButton} onClick={handleNext} title="Next player">
            →
          </button>
        </div>

        <div className={styles.spacer} />
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.column} id="leftColumn">
          <div className={styles.dataItem}>
            <p className={styles.label}>Nacionalidade</p>
            <div className={styles.flagContainer}>
              <span className={styles.flagEmoji}>{currentPlayer.flag}</span>
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.dataItem}>
            <p className={styles.label}>Idade</p>
            <p className={styles.value}>{currentPlayer.age}</p>
          </div>

          <hr className={styles.divider} />

          <div className={styles.dataItem}>
            <p className={styles.label}>Partidas</p>
            <p className={styles.value}>{currentPlayer.games}</p>
          </div>
        </div>

        {/* Center Column */}
        <div className={styles.centerColumn}>
          <div className={`${styles.imageContainer} fade-in-up`}>
            <Image
              src={currentPlayer.photo || "/placeholder.svg"}
              alt={currentPlayer.name}
              fill
              className={styles.playerImage}
              priority
            />
            <div className={styles.nameOverlay}>
              <h2>{currentPlayer.name}</h2>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.column} id="rightColumn">
          <div className={styles.dataItem}>
            <div className={styles.logoContainer}>
              <Image
                src={currentPlayer.clubLogo || "/placeholder.svg"}
                alt="Club Logo"
                width={60}
                height={60}
                className={styles.clubLogo}
              />
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.dataItem}>
            <p className={styles.label}>Posição</p>
            <p className={styles.value}>{currentPlayer.position}</p>
          </div>

          <hr className={styles.divider} />

          <div className={styles.dataItem}>
            <p className={styles.label}>N da Camisa</p>
            <p className={styles.value}>#{currentPlayer.shirtNumber}</p>
          </div>
        </div>
      </main>
    </div>
  )
}