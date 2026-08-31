'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

export default function ProjectImageCarousel({ images, title }: { images: string[], title: string }) {
  const [index, setIndex] = useState(0)
  const list = images && images.length > 0 ? images : ['/images/placeholder.png']
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const resetAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setIndex(i => (i === list.length - 1 ? 0 : i + 1))
    }, 10000)
  }, [list.length])

  useEffect(() => {
    resetAutoSlide()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [resetAutoSlide])

  const prev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIndex(i => (i === 0 ? list.length - 1 : i - 1))
    resetAutoSlide()
  }

  const next = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIndex(i => (i === list.length - 1 ? 0 : i + 1))
    resetAutoSlide()
  }

  return (
    <div className="relative flex w-full scale-[.99] items-center justify-center rounded-lg border-2 border-primary bg-primary opacity-50 shadow-lg transition ease-in hover:scale-100 hover:opacity-100 md:w-140">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden rounded-lg bg-black/20">
        <Image
          className="h-full w-full rounded-lg object-contain"
          src={list[index]}
          alt={`Project - ${title} - image ${index + 1}`}
          draggable="false"
          fill
          sizes="(max-width: 768px) 100vw, 560px"
        />
      </div>

      {list.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/80 p-4 text-white hover:bg-black hover:scale-110 transition-all shadow-lg border-2 border-white/20"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/80 p-4 text-white hover:bg-black hover:scale-110 transition-all shadow-lg border-2 border-white/20"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1">
            {list.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
