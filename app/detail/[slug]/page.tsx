import React from 'react'

export default function Page({ params }: { params: { slug: string } }) {
  return <div>Detail Page: {params.slug}</div>
}