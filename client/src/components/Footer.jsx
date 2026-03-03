import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="inner">
        © {new Date().getFullYear()} FSR Fitness. All rights reserved.
      </div>
    </footer>
  )
}