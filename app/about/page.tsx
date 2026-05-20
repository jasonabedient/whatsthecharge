import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "About — What's The Charge | EV Charging Calculator",
  description:
    "What's The Charge is an independent EV charging calculator and Learn hub built by a Rivian owner. Real-world numbers, transparent methodology, and honest affiliate disclosure.",
  alternates: { canonical: 'https://whatsthecharge.com/about' },
  openGraph: {
    title: "About — What's The Charge",
    description:
      'Independent EV charging calculator built by a real EV owner. Methodology, sources, and contact.',
    url: 'https://whatsthecharge.com/about',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <header className="mb-12 sm:mb-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
          About
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Honest answers for real EV owners
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Owning an EV is full of small details that nobody really explains up
          front — how fast your home charger actually charges, why range per
          hour matters more than kW, what a public session really costs, when
          to plug in to save money. What's The Charge exists to make those
          details easy to understand and easy to plan around.
        </p>
      </header>

      <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-2xl prose-h3:text-xl prose-a:text-cyan-500 hover:prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline">
        <p>
          EV charging has more nuance than most owners are told. Two cars on
          the same charger can add range at very different speeds. A "Level 2"
          charger can mean 5 kW or 11 kW. "Fast charging" can mean 50 kW or
          350 kW, and the difference is an hour of your life. This site exists
          to surface that nuance with real data, transparent math, and numbers
          measured from actual cars in an actual garage.
        </p>

        <h2>What this site does</h2>
        <p>
          The <Link href="/">What's The Charge calculator</Link> estimates how
          long it will take to charge a specific EV at a specific kW rate — at
          home or in public — so you can plan your day around a real number
          instead of a marketing one. The <Link href="/learn">Learn section</Link>{' '}
          publishes guides backed by firsthand testing.
        </p>

        <h2>We're independent</h2>
        <p>
          What's The Charge is an independent project. It is not affiliated
          with any automaker, charging network, or utility company.
        </p>

        <h2>Methodology & data sources</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vehicle specs (battery, efficiency, max charge rate)</td>
              <td>EPA + manufacturer published specifications</td>
            </tr>
            <tr>
              <td>Electricity rates</td>
              <td>U.S. Energy Information Administration (EIA)</td>
            </tr>
            <tr>
              <td>Public charging prices</td>
              <td>
                Published network pricing (Tesla Supercharger, Electrify
                America, EVgo, ChargePoint)
              </td>
            </tr>
            <tr>
              <td>Firsthand charging numbers</td>
              <td>
                Measured by Jason on a Rivian, Ioniq 6, and Silverado EV using
                Emporia 24A and 48A Level 2 chargers
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Affiliate disclosure</h2>
        <p>
          Some links on this site are affiliate links. If you click through and
          make a purchase, we may earn a commission at no extra cost to you.
          This does not influence calculator results or Learn content. Products
          and services are only recommended when they're genuinely useful for EV
          owners — usually because Jason already uses them.
        </p>

        <h2>Disclaimer</h2>
        <p>
          The calculations and information on this site are for educational and
          planning purposes only. They are not financial, legal, or professional
          advice. Real-world costs and charging times depend on your utility
          rate, battery age, climate, driving style, charger condition, and
          other factors. Always verify rates with your local utility and
          consult qualified professionals for important financial decisions.
        </p>

        <h2 id="contact">Contact</h2>
        <p>
          For affiliate inquiries, partnership opportunities, corrections, or
          general feedback:
        </p>
        <p>
          <a href="mailto:inquiries@whatsthecharge.com">
            inquiries@whatsthecharge.com
          </a>
        </p>
        <p className="text-sm text-muted-foreground">
          Please include "Affiliate," "Partnership," "Correction," or "Feedback"
          in your subject line so I can route it correctly.
        </p>
      </div>
    </main>
  )
}
