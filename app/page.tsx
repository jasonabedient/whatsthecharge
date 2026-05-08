import { Calculator } from "@/components/Calculator"

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "EV Charging Cost Calculator",
                "url": "https://whatsthecharge.com",
                "applicationCategory": "CalculatorApplication",
                "operatingSystem": "All",
                "description": "Calculate exact EV charging costs based on your vehicle, charger speed, and local electricity rates."
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How much does it cost to charge an EV?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "At average residential rates ($0.17/kWh), a full charge costs between $8 and $19 depending on battery size. Home charging is typically 60-70% cheaper than gasoline."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is DC Fast Charging more expensive than home charging?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, DC fast charging averages $0.45-$0.55 per kWh, which is roughly 3x the cost of home charging. A full charge at a fast charger costs $27-$33 on average."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />
      <Calculator />
    </>
  )
}
