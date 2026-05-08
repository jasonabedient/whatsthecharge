import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calculator } from '@/components/Calculator'
import { getAllVehicleSlugs, getVehicleBySlug } from '@/lib/ev-data'

export async function generateStaticParams() {
  const slugs = getAllVehicleSlugs()
  return slugs.map((vehicle) => ({
    slug: vehicle.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const vehicle = getVehicleBySlug(resolvedParams.slug)
  
  if (!vehicle) {
    return {
      title: 'Vehicle Not Found',
    }
  }

  const title = `How Much Does It Cost to Charge a ${vehicle.year} ${vehicle.makeModel}?`
  const description = `Calculate the exact EV charging cost for a ${vehicle.year} ${vehicle.makeModel}. Compare home charging vs public DC fast charging using real-time electricity rates.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://whatsthecharge.com/vehicles/${vehicle.slug}`,
    },
    twitter: {
      title,
      description,
    }
  }
}

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const vehicle = getVehicleBySlug(resolvedParams.slug)

  if (!vehicle) {
    notFound()
  }

  const schemaJSON = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${vehicle.year} ${vehicle.makeModel} Charging Cost Calculator`,
    "url": `https://whatsthecharge.com/vehicles/${vehicle.slug}`,
    "applicationCategory": "CalculatorApplication",
    "description": `Calculate the exact charging cost and time for the ${vehicle.year} ${vehicle.makeModel}.`
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJSON) }}
      />
      <Calculator initialYear={vehicle.year} initialMake={vehicle.makeModel} />
    </>
  )
}
