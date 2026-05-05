"use client"

import { useState, FormEvent } from "react"
import { ArrowLeft, Zap, Clock, DollarSign, Mail, Battery, Plug } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// EV Battery Data
const evData: Record<string, Record<string, Record<string, number>>> = {
  "2024": {
    // Tesla
    "Tesla Model 3": {
      "Standard Range RWD": 60,
      "Long Range AWD": 78.4,
      "Performance AWD": 78.4,
    },
    "Tesla Model Y": {
      "Standard Range RWD": 60,
      "Long Range AWD": 78.4,
      "Performance AWD": 78.4,
    },
    "Tesla Model S": {
      "Long Range AWD": 100,
      "Plaid AWD": 100,
    },
    "Tesla Model X": {
      "Long Range AWD": 100,
      "Plaid AWD": 100,
    },
    "Tesla Cybertruck": {
      "Dual Motor AWD": 123,
      "Tri Motor AWD": 123,
    },
    // Rivian
    "Rivian R1S": {
      "Standard AWD": 105,
      "Large AWD": 131,
      "Max AWD": 149,
    },
    "Rivian R1T": {
      "Standard AWD": 105,
      "Large AWD": 131,
      "Max AWD": 149,
    },
    // Ford
    "Ford Mustang Mach-E": {
      "Select RWD": 70,
      "Premium RWD": 91,
      "Premium AWD": 91,
      "GT AWD": 91,
    },
    "Ford F-150 Lightning": {
      "Standard Range": 98,
      "Extended Range": 131,
    },
    // Hyundai
    "Hyundai Ioniq 5": {
      "SE Standard Range RWD": 58,
      "SE Long Range RWD": 77.4,
      "SEL Long Range AWD": 77.4,
      "Limited Long Range AWD": 77.4,
    },
    "Hyundai Ioniq 6": {
      "SE Standard Range RWD": 53,
      "SE Long Range RWD": 77.4,
      "SEL Long Range AWD": 77.4,
      "Limited Long Range AWD": 77.4,
    },
    "Hyundai Kona Electric": {
      "SE RWD": 64.8,
      "SEL RWD": 64.8,
      "Limited RWD": 64.8,
    },
    // Kia
    "Kia EV6": {
      "Light RWD": 58,
      "Wind RWD": 77.4,
      "Wind AWD": 77.4,
      "GT-Line AWD": 77.4,
      "GT AWD": 77.4,
    },
    "Kia EV9": {
      "Light RWD": 76.1,
      "Wind AWD": 99.8,
      "GT-Line AWD": 99.8,
    },
    "Kia Niro EV": {
      "Wind RWD": 64.8,
      "Wave RWD": 64.8,
    },
    // BMW
    "BMW i4": {
      "eDrive35": 70.2,
      "eDrive40": 83.9,
      "M50 xDrive": 83.9,
    },
    "BMW iX": {
      "xDrive50": 105,
      "M60 xDrive": 111.5,
    },
    // Mercedes
    "Mercedes EQS": {
      "450+ RWD": 108,
      "580 4MATIC": 120,
    },
    "Mercedes EQE": {
      "350+ RWD": 90.6,
      "500 4MATIC": 90.6,
      "AMG 53 4MATIC": 90.6,
    },
    // Chevrolet
    "Chevrolet Blazer EV": {
      "LT RWD": 85,
      "RS RWD": 102,
      "RS AWD": 102,
      "SS AWD": 102,
    },
    "Chevrolet Equinox EV": {
      "1LT RWD": 85,
      "2LT RWD": 85,
      "2RS RWD": 85,
      "3RS AWD": 85,
    },
    "Chevrolet Bolt EUV": {
      "1LT FWD": 65,
      "Premier FWD": 65,
    },
    "Chevrolet Bolt EV": {
      "1LT FWD": 65,
      "2LT FWD": 65,
    },
    // Volkswagen
    "Volkswagen ID.4": {
      "Standard RWD": 62,
      "Pro RWD": 77,
      "Pro S RWD": 82,
      "Pro S Plus AWD": 82,
    },
    "Volkswagen ID.Buzz": {
      "Pro S RWD": 77,
      "Pro S Plus RWD": 77,
    },
    // Polestar
    "Polestar 2": {
      "Standard Range Single Motor": 69,
      "Long Range Single Motor": 78,
      "Long Range Dual Motor": 82,
    },
    "Polestar 3": {
      "Long Range Dual Motor": 111,
      "Performance Pack": 111,
    },
    "Polestar 4": {
      "Long Range Single Motor": 101,
      "Long Range Dual Motor": 101,
    },
    // Audi
    "Audi e-tron GT": {
      "Premium Plus": 93.4,
      "Prestige": 93.4,
      "RS": 93.4,
    },
    "Audi Q4 e-tron": {
      "40 Premium RWD": 77,
      "50 Premium Plus AWD": 77,
      "55 Prestige AWD": 77,
    },
    "Audi Q8 e-tron": {
      "Premium Plus": 106,
      "Prestige": 106,
      "SQ8 e-tron": 106,
    },
    // Lucid
    "Lucid Air": {
      "Pure RWD": 88,
      "Touring AWD": 112,
      "Grand Touring AWD": 118,
    },
    // Volvo
    "Volvo EX90": {
      "Plus Twin Motor": 107,
      "Ultra Twin Motor": 117,
    },
    "Volvo EX30": {
      "Single Motor": 64,
      "Twin Motor": 69,
    },
    "Volvo C40 Recharge": {
      "Core Single Motor": 69,
      "Plus Twin Motor": 78,
      "Ultimate Twin Motor": 78,
    },
    "Volvo XC40 Recharge": {
      "Core Single Motor": 69,
      "Plus Twin Motor": 78,
      "Ultimate Twin Motor": 78,
    },
    // Genesis
    "Genesis GV60": {
      "Advanced RWD": 77.4,
      "Performance AWD": 77.4,
    },
    "Genesis Electrified GV70": {
      "Advanced AWD": 77.4,
      "Prestige AWD": 77.4,
    },
    // Cadillac
    "Cadillac Lyriq": {
      "Tech RWD": 102,
      "Luxury RWD": 102,
      "Sport AWD": 102,
    },
    // Porsche
    "Porsche Taycan": {
      "RWD": 79.2,
      "4S AWD": 93.4,
      "Turbo AWD": 93.4,
      "Turbo S AWD": 93.4,
    },
  },
  "2023": {
    // Tesla
    "Tesla Model 3": {
      "Standard Range+ RWD": 60,
      "Long Range AWD": 78.4,
      "Performance AWD": 78.4,
    },
    "Tesla Model Y": {
      "Long Range AWD": 78.4,
      "Performance AWD": 78.4,
    },
    "Tesla Model S": {
      "Long Range AWD": 100,
      "Plaid AWD": 100,
    },
    "Tesla Model X": {
      "Long Range AWD": 100,
      "Plaid AWD": 100,
    },
    // Rivian
    "Rivian R1S": {
      "Large AWD": 131,
      "Max AWD": 149,
    },
    "Rivian R1T": {
      "Large AWD": 131,
      "Max AWD": 149,
    },
    // Ford
    "Ford Mustang Mach-E": {
      "Select RWD": 70,
      "Premium RWD": 91,
      "Premium AWD": 91,
      "GT AWD": 91,
    },
    "Ford F-150 Lightning": {
      "Standard Range": 98,
      "Extended Range": 131,
    },
    // Hyundai
    "Hyundai Ioniq 5": {
      "SE Standard Range RWD": 58,
      "SE Long Range RWD": 77.4,
      "SEL Long Range AWD": 77.4,
      "Limited Long Range AWD": 77.4,
    },
    "Hyundai Ioniq 6": {
      "SE Long Range RWD": 77.4,
      "SEL Long Range AWD": 77.4,
      "Limited Long Range AWD": 77.4,
    },
    "Hyundai Kona Electric": {
      "SEL RWD": 64,
      "Limited RWD": 64,
    },
    // Kia
    "Kia EV6": {
      "Light RWD": 58,
      "Wind RWD": 77.4,
      "Wind AWD": 77.4,
      "GT-Line AWD": 77.4,
      "GT AWD": 77.4,
    },
    "Kia Niro EV": {
      "Wind RWD": 64.8,
      "Wave RWD": 64.8,
    },
    // BMW
    "BMW i4": {
      "eDrive35": 70.2,
      "eDrive40": 83.9,
      "M50 xDrive": 83.9,
    },
    "BMW iX": {
      "xDrive50": 105,
      "M60 xDrive": 111.5,
    },
    // Mercedes
    "Mercedes EQS": {
      "450+ RWD": 108,
      "580 4MATIC": 120,
    },
    "Mercedes EQE": {
      "350+ RWD": 90.6,
      "500 4MATIC": 90.6,
    },
    // Chevrolet
    "Chevrolet Bolt EUV": {
      "1LT FWD": 65,
      "Premier FWD": 65,
    },
    "Chevrolet Bolt EV": {
      "1LT FWD": 65,
      "2LT FWD": 65,
    },
    // Volkswagen
    "Volkswagen ID.4": {
      "Standard RWD": 62,
      "Pro RWD": 77,
      "Pro S RWD": 82,
      "Pro S Plus AWD": 82,
    },
    // Polestar
    "Polestar 2": {
      "Standard Range Single Motor": 69,
      "Long Range Single Motor": 78,
      "Long Range Dual Motor": 82,
    },
    // Audi
    "Audi e-tron GT": {
      "Premium Plus": 93.4,
      "Prestige": 93.4,
      "RS": 93.4,
    },
    "Audi Q4 e-tron": {
      "40 Premium RWD": 77,
      "50 Premium Plus AWD": 77,
    },
    "Audi Q8 e-tron": {
      "Premium Plus": 106,
      "Prestige": 106,
    },
    // Lucid
    "Lucid Air": {
      "Pure RWD": 88,
      "Touring AWD": 112,
      "Grand Touring AWD": 118,
    },
    // Volvo
    "Volvo C40 Recharge": {
      "Core Single Motor": 69,
      "Plus Twin Motor": 78,
      "Ultimate Twin Motor": 78,
    },
    "Volvo XC40 Recharge": {
      "Core Single Motor": 69,
      "Plus Twin Motor": 78,
      "Ultimate Twin Motor": 78,
    },
    // Genesis
    "Genesis GV60": {
      "Advanced RWD": 77.4,
      "Performance AWD": 77.4,
    },
    "Genesis Electrified GV70": {
      "Advanced AWD": 77.4,
      "Prestige AWD": 77.4,
    },
    // Cadillac
    "Cadillac Lyriq": {
      "Tech RWD": 102,
      "Luxury RWD": 102,
    },
    // Porsche
    "Porsche Taycan": {
      "RWD": 79.2,
      "4S AWD": 93.4,
      "Turbo AWD": 93.4,
      "Turbo S AWD": 93.4,
    },
  },
  "2022": {
    // Tesla
    "Tesla Model 3": {
      "Standard Range+ RWD": 60,
      "Long Range AWD": 78.4,
      "Performance AWD": 78.4,
    },
    "Tesla Model Y": {
      "Long Range AWD": 78.4,
      "Performance AWD": 78.4,
    },
    "Tesla Model S": {
      "Long Range AWD": 100,
      "Plaid AWD": 100,
    },
    "Tesla Model X": {
      "Long Range AWD": 100,
      "Plaid AWD": 100,
    },
    // Rivian
    "Rivian R1S": {
      "Large AWD": 131,
    },
    "Rivian R1T": {
      "Large AWD": 131,
    },
    // Ford
    "Ford Mustang Mach-E": {
      "Select RWD": 70,
      "Premium RWD": 91,
      "Premium AWD": 91,
      "GT AWD": 91,
    },
    "Ford F-150 Lightning": {
      "Standard Range": 98,
      "Extended Range": 131,
    },
    // Hyundai
    "Hyundai Ioniq 5": {
      "SE Standard Range RWD": 58,
      "SE Long Range RWD": 77.4,
      "SEL Long Range AWD": 77.4,
      "Limited Long Range AWD": 77.4,
    },
    "Hyundai Kona Electric": {
      "SEL RWD": 64,
      "Limited RWD": 64,
    },
    // Kia
    "Kia EV6": {
      "Light RWD": 58,
      "Wind RWD": 77.4,
      "Wind AWD": 77.4,
      "GT-Line AWD": 77.4,
    },
    "Kia Niro EV": {
      "EX RWD": 64.8,
    },
    // BMW
    "BMW i4": {
      "eDrive40": 83.9,
      "M50 xDrive": 83.9,
    },
    "BMW iX": {
      "xDrive50": 105,
      "M60 xDrive": 111.5,
    },
    // Mercedes
    "Mercedes EQS": {
      "450+ RWD": 108,
      "580 4MATIC": 120,
    },
    // Chevrolet
    "Chevrolet Bolt EUV": {
      "1LT FWD": 65,
      "Premier FWD": 65,
    },
    "Chevrolet Bolt EV": {
      "1LT FWD": 65,
      "2LT FWD": 65,
    },
    // Volkswagen
    "Volkswagen ID.4": {
      "Pro RWD": 77,
      "Pro S RWD": 82,
      "Pro S AWD": 82,
    },
    // Polestar
    "Polestar 2": {
      "Standard Range Single Motor": 69,
      "Long Range Single Motor": 78,
      "Long Range Dual Motor": 78,
    },
    // Audi
    "Audi e-tron GT": {
      "Premium Plus": 93.4,
      "RS": 93.4,
    },
    "Audi Q4 e-tron": {
      "40 Premium RWD": 77,
      "50 Premium Plus AWD": 77,
    },
    // Lucid
    "Lucid Air": {
      "Pure RWD": 88,
      "Touring AWD": 112,
      "Grand Touring AWD": 118,
      "Dream Edition": 118,
    },
    // Volvo
    "Volvo C40 Recharge": {
      "Twin Motor": 78,
    },
    "Volvo XC40 Recharge": {
      "Twin Motor": 78,
    },
    // Genesis
    "Genesis GV60": {
      "Advanced RWD": 77.4,
      "Performance AWD": 77.4,
    },
    // Porsche
    "Porsche Taycan": {
      "RWD": 79.2,
      "4S AWD": 93.4,
      "Turbo AWD": 93.4,
      "Turbo S AWD": 93.4,
    },
  },
}

// Charger presets in kW
const chargerPresets = [
  { label: "1.4 kW (Level 1 Basic)", value: 1.4 },
  { label: "5.8 kW (Level 2 - 24A)", value: 5.8 },
  { label: "11.5 kW (Level 2 - 48A)", value: 11.5 },
]

// TOU rate multipliers
const touRates = [
  { label: "Anytime (100%)", value: 1.0 },
  { label: "Off-Peak (65%)", value: 0.65 },
  { label: "Peak (140%)", value: 1.4 },
]

// Charging efficiency
const CHARGING_EFFICIENCY = 0.9

// Styling constants
const styles = {
  background: "#09090b",
  cyan: "#22d3ee",
  textPrimary: "#fafafa",
  textSecondary: "#a1a1aa",
  cardRadius: "2.5rem",
}

export default function VoltChargePage() {
  const [year, setYear] = useState<string>("")
  const [make, setMake] = useState<string>("")
  const [trim, setTrim] = useState<string>("")
  const [chargerPower, setChargerPower] = useState<number>(5.8)
  const [chargerSelection, setChargerSelection] = useState<string>("5.8")
  const [customChargerPower, setCustomChargerPower] = useState<string>("")
  const [touRate, setTouRate] = useState<number>(1.0)
  const [electricityRate, setElectricityRate] = useState<string>("0.12")
  const [batteryPercent, setBatteryPercent] = useState<string>("20")
  const [targetPercent, setTargetPercent] = useState<string>("80")
  const [email, setEmail] = useState<string>("")
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showEmailPrompt, setShowEmailPrompt] = useState(false)
  const [calculatedResults, setCalculatedResults] = useState<{
    energyNeeded: string
    chargingTime: string
    cost: string
  } | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [inputsChangedSinceCalculate, setInputsChangedSinceCalculate] = useState(false)

  // Get available makes for selected year
  const availableMakes = year ? Object.keys(evData[year] || {}) : []

  // Get available trims for selected make
  const availableTrims = year && make ? Object.keys(evData[year]?.[make] || {}) : []

  // Get battery capacity
  const batteryCapacity = year && make && trim ? evData[year]?.[make]?.[trim] : null

  // Calculate charging metrics
  const calculateCharging = () => {
    if (!batteryCapacity) return null

    const startPercent = parseFloat(batteryPercent) / 100
    const endPercent = parseFloat(targetPercent) / 100
    const rate = parseFloat(electricityRate)

    if (isNaN(startPercent) || isNaN(endPercent) || isNaN(rate)) return null

    const energyNeeded = batteryCapacity * (endPercent - startPercent)
    const actualEnergyNeeded = energyNeeded / CHARGING_EFFICIENCY
    const chargingTime = actualEnergyNeeded / chargerPower
    const cost = actualEnergyNeeded * rate * touRate

    return {
      energyNeeded: actualEnergyNeeded.toFixed(1),
      chargingTime: chargingTime.toFixed(1),
      cost: cost.toFixed(2),
    }
  }

  const currentResults = calculateCharging()
  const canCalculate = currentResults !== null

  // Mark inputs as changed when relevant fields change
  const markInputsChanged = () => {
    if (hasCalculated) {
      setInputsChangedSinceCalculate(true)
    }
  }

  const handleCalculate = () => {
    if (currentResults) {
      setCalculatedResults(currentResults)
      // If email already submitted, skip prompt and show results directly
      if (emailSubmitted) {
        setShowResults(true)
        setShowEmailPrompt(false)
      } else {
        setShowEmailPrompt(true)
        setShowResults(false)
      }
      setHasCalculated(true)
      setInputsChangedSinceCalculate(false)
    }
  }

  // Button state: disabled if already calculated and no changes made, or if can't calculate
  const isButtonDisabled = !canCalculate || (hasCalculated && !inputsChangedSinceCalculate)
  // Button shows "Calculate" only on first use, then permanently "Recalculate" after first results
  const buttonText = emailSubmitted ? "Recalculate" : "Calculate"

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (email) {
      console.log("[v0] Lead captured:", { email, vehicle: `${year} ${make} ${trim}`, results: calculatedResults })
      setEmailSubmitted(true)
      setShowEmailPrompt(false)
      setShowResults(true)
    }
  }

  const handleYearChange = (value: string) => {
    setYear(value)
    setMake("")
    setTrim("")
  }

  const handleMakeChange = (value: string) => {
    setMake(value)
    setTrim("")
  }

  return (
    <div
      style={{
        backgroundColor: styles.background,
        minHeight: "100vh",
        color: styles.textPrimary,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(34, 211, 238, 0.1)",
        }}
      >
        <Link
          href="/adventure"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: styles.textSecondary,
            textDecoration: "none",
            fontSize: "0.875rem",
            transition: "color 0.2s",
          }}
        >
          <ArrowLeft size={18} />
          Back
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Zap
            size={28}
            style={{ color: styles.cyan }}
          />
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            EV Charging Calculator
          </span>
        </div>
        <div style={{ width: "60px" }} />
      </header>

      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "4rem 2rem 3rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <a
          href="https://adventure.bedo.studio"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Badge
            style={{
              backgroundColor: "rgba(34, 211, 238, 0.1)",
              color: styles.cyan,
              border: `1px solid ${styles.cyan}`,
              marginBottom: "1.5rem",
              padding: "0.5rem 1rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            Bedo Adventure
          </Badge>
        </a>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "1rem",
            letterSpacing: "-0.025em",
          }}
        >
          What&apos;s The{" "}
          <span style={{ color: styles.cyan }}>Charge?</span>
        </h1>
        <p
          style={{
            color: styles.textSecondary,
            fontSize: "1.125rem",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Calculate your EV home charging time and costs. Optimize your charging schedule and save on electricity.
        </p>
      </section>

      {/* Calculator Card */}
      <section
        style={{
          padding: "0 2rem 4rem",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <Card
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(34, 211, 238, 0.2)",
            borderRadius: styles.cardRadius,
            boxShadow: "0 0 60px rgba(34, 211, 238, 0.08)",
            overflow: "hidden",
          }}
        >
          <CardHeader
            style={{
              borderBottom: "1px solid rgba(34, 211, 238, 0.1)",
              padding: "1.25rem 2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Plug size={24} style={{ color: styles.cyan }} />
              <CardTitle
                style={{
                  color: styles.textPrimary,
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                Charging Cost Calculator
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent style={{ padding: "1.5rem 2rem 2rem" }}>
            {/* Vehicle Selection */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <Label
                  style={{
                    color: styles.textSecondary,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Year
                </Label>
                <Select value={year} onValueChange={handleYearChange}>
                  <SelectTrigger
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: "0.75rem",
                      color: styles.textPrimary,
                    }}
                  >
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(evData).map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  style={{
                    color: styles.textSecondary,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Make / Model
                </Label>
                <Select value={make} onValueChange={handleMakeChange} disabled={!year}>
                  <SelectTrigger
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: "0.75rem",
                      color: styles.textPrimary,
                    }}
                  >
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMakes.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  style={{
                    color: styles.textSecondary,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Trim
                </Label>
                <Select value={trim} onValueChange={setTrim} disabled={!make}>
                  <SelectTrigger
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: "0.75rem",
                      color: styles.textPrimary,
                    }}
                  >
                    <SelectValue placeholder="Select trim" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTrims.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Battery Detected Display */}
            {batteryCapacity && (
              <div
                style={{
                  backgroundColor: "rgba(34, 211, 238, 0.1)",
                  border: "1px solid rgba(34, 211, 238, 0.3)",
                  borderRadius: "1rem",
                  padding: "1rem 1.5rem",
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Battery size={24} style={{ color: styles.cyan }} />
                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: styles.textSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Battery Detected (Usable)
                  </p>
                  <p
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: styles.cyan,
                    }}
                  >
                    {batteryCapacity} kWh
                  </p>
                </div>
              </div>
            )}

            {/* Charging Parameters */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <Label
                  style={{
                    color: styles.textSecondary,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Charger Power
                </Label>
                <Select
                  value={chargerSelection}
                  onValueChange={(v) => {
                    setChargerSelection(v)
                    if (v !== "custom") {
                      setChargerPower(parseFloat(v))
                      setCustomChargerPower("")
                    }
                    markInputsChanged()
                  }}
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: "0.75rem",
                      color: styles.textPrimary,
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chargerPresets.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value.toString()}>
                        {preset.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {chargerSelection === "custom" && (
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="Enter kW"
                    value={customChargerPower}
                    onChange={(e) => {
                      setCustomChargerPower(e.target.value)
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val) && val > 0) {
                        setChargerPower(val)
                      }
                      markInputsChanged()
                    }}
                    style={{
                      marginTop: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: "0.75rem",
                      color: styles.textPrimary,
                    }}
                  />
                )}
              </div>

              <div>
                <Label
                  style={{
                    color: styles.textSecondary,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Electricity Rate ($/kWh)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={electricityRate}
                  onChange={(e) => {
                    setElectricityRate(e.target.value)
                    markInputsChanged()
                  }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(34, 211, 238, 0.2)",
                    borderRadius: "0.75rem",
                    color: styles.textPrimary,
                  }}
                />
              </div>

              <div>
                <Label
                  style={{
                    color: styles.textSecondary,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  TOU Rate
                </Label>
                <Select
                  value={touRate.toString()}
                  onValueChange={(v) => {
                    setTouRate(parseFloat(v))
                    markInputsChanged()
                  }}
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: "0.75rem",
                      color: styles.textPrimary,
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {touRates.map((rate) => (
                      <SelectItem key={rate.value} value={rate.value.toString()}>
                        {rate.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: styles.textSecondary,
                    marginTop: "0.5rem",
                  }}
                >
                  Effective rate: ${(parseFloat(electricityRate) * touRate).toFixed(3)}/kWh
                </p>
              </div>
            </div>

            {/* Battery Percentage */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <Label
                  style={{
                    color: styles.textSecondary,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Current Battery %
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={batteryPercent}
                  onChange={(e) => {
                    setBatteryPercent(e.target.value)
                    markInputsChanged()
                  }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(34, 211, 238, 0.2)",
                    borderRadius: "0.75rem",
                    color: styles.textPrimary,
                  }}
                />
              </div>

              <div>
                <Label
                  style={{
                    color: styles.textSecondary,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Target Battery %
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={targetPercent}
                  onChange={(e) => {
                    setTargetPercent(e.target.value)
                    markInputsChanged()
                  }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(34, 211, 238, 0.2)",
                    borderRadius: "0.75rem",
                    color: styles.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Calculate Button */}
            <Button
              onClick={handleCalculate}
              disabled={isButtonDisabled}
              style={{
                width: "100%",
                backgroundColor: !isButtonDisabled ? styles.cyan : "rgba(34, 211, 238, 0.3)",
                color: styles.background,
                borderRadius: "0.75rem",
                fontWeight: 600,
                padding: "1rem 1.5rem",
                fontSize: "1rem",
                marginBottom: "2rem",
                cursor: !isButtonDisabled ? "pointer" : "not-allowed",
              }}
            >
              {buttonText}
            </Button>

            {/* Email Prompt */}
            {showEmailPrompt && !emailSubmitted && (
              <div
                style={{
                  backgroundColor: "rgba(34, 211, 238, 0.05)",
                  border: "1px solid rgba(34, 211, 238, 0.2)",
                  borderRadius: "1.5rem",
                  padding: "2rem",
                  marginBottom: "2rem",
                  textAlign: "center",
                }}
              >
                <Mail size={32} style={{ color: styles.cyan, margin: "0 auto 1rem" }} />
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: styles.textPrimary,
                    marginBottom: "0.5rem",
                  }}
                >
                  Enter your email to see your charging estimate
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: styles.textSecondary,
                    marginBottom: "1.5rem",
                  }}
                >
                  We&apos;ll also send you charging tips and updates.
                </p>
                <form
                  onSubmit={handleEmailSubmit}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    maxWidth: "400px",
                    margin: "0 auto",
                  }}
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: "0.75rem",
                      color: styles.textPrimary,
                    }}
                  />
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: styles.cyan,
                      color: styles.background,
                      borderRadius: "0.75rem",
                      fontWeight: 600,
                      padding: "0 1.5rem",
                    }}
                  >
                    See Results
                  </Button>
                </form>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: styles.textSecondary,
                    marginTop: "1rem",
                  }}
                >
                  Your email is safe with us — we never sell or share your info.
                </p>
              </div>
            )}

            {/* Results */}
            {showResults && calculatedResults && (
              <div
                style={{
                  backgroundColor: "rgba(34, 211, 238, 0.05)",
                  border: "1px solid rgba(34, 211, 238, 0.2)",
                  borderRadius: "1.5rem",
                  padding: "2rem",
                  marginBottom: "2rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: styles.textSecondary,
                    marginBottom: "1.5rem",
                  }}
                >
                  Charging Estimate
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1.5rem",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(34, 211, 238, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 0.75rem",
                      }}
                    >
                      <Zap size={24} style={{ color: styles.cyan }} />
                    </div>
                    <p
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        color: styles.cyan,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {calculatedResults.energyNeeded}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: styles.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      kWh Needed
                    </p>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(34, 211, 238, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 0.75rem",
                      }}
                    >
                      <Clock size={24} style={{ color: styles.cyan }} />
                    </div>
                    <p
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        color: styles.cyan,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {calculatedResults.chargingTime}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: styles.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Hours
                    </p>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(34, 211, 238, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 0.75rem",
                      }}
                    >
                      <DollarSign size={24} style={{ color: styles.cyan }} />
                    </div>
                    <p
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        color: styles.cyan,
                        marginBottom: "0.25rem",
                      }}
                    >
                      ${calculatedResults.cost}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: styles.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Est. Cost
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            {showResults && (
              <div
                style={{
                  borderTop: "1px solid rgba(34, 211, 238, 0.1)",
                  paddingTop: "2rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <Mail size={20} style={{ color: styles.cyan }} />
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: styles.textPrimary,
                    }}
                  >
                    Get Charging Tips & Updates
                  </h3>
                </div>
                <div
                  style={{
                    backgroundColor: "rgba(34, 211, 238, 0.1)",
                    border: "1px solid rgba(34, 211, 238, 0.3)",
                    borderRadius: "1rem",
                    padding: "1rem",
                    textAlign: "center",
                    color: styles.cyan,
                  }}
                >
                  Thanks for subscribing! Check your inbox for charging tips.
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "2rem",
          borderTop: "1px solid rgba(34, 211, 238, 0.1)",
          color: styles.textSecondary,
          fontSize: "0.875rem",
        }}
      >
        <p>&copy; 2026 Bedo.Studio</p>
      </footer>
    </div>
  )
}
