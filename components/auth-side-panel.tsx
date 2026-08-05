"use client"

import { useState, useEffect } from "react"

const messages = [
  {
    title: "Secure & Reliable",
    description: "Experience top-notch security with our advanced encryption and authentication systems.",
  },
  {
    title: "Simple & Modern",
    description: "A clean and intuitive interface designed to make your journey smooth and enjoyable.",
  },
  {
    title: "Salamapay Pride",
    description: "Built with passion and local context to serve the needs of our community perfectly.",
  },
]

export function AuthSidePanel() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length)
        setFade(true)
      }, 500) // Half second for fade out
    }, 5000) // Change message every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative hidden bg-muted lg:block overflow-hidden">
      <img
        src="/34979.jpg"
        alt="Authentication"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-10000 hover:scale-110"
      />
      
      {/* Nice fading overlay: darker at the bottom where the text is */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />

      {/* Text positioned at the bottom */}
      <div className="absolute inset-x-0 bottom-0 p-12 text-white">
        <div 
          className={`max-w-lg transition-opacity duration-500 ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } transform`}
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {messages[currentMessage].title}
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            {messages[currentMessage].description}
          </p>
        </div>
        
        {/* Progress indicators */}
        <div className="flex gap-2 mt-8">
          {messages.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentMessage ? "w-8 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
