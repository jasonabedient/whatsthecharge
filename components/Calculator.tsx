"use client"

import { useState, FormEvent, useEffect } from "react"
import { ArrowLeft, Zap, Clock, DollarSign, Mail, Battery, Plug } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { evData } from "@/lib/ev-data"
import { stateRates, getRateByCode } from "@/lib/rates-data"

// Charger presets in kW
const chargerPresets = [
  { label: "1.4 kW (Level 1 Basic)", value: 1.4 },
  { label: "5.8 kW (Level 2 - 24A)", value: 5.8 },
  { label: "11.5 kW (Level 2 - 48A)", value: 11.5 },
]

// TOU mode — selects which rate column to pull from the state's rates
const touModes = [
  { label: "Standard", value: "standard" },
  { label: "Off-Peak / Overnight", value: "offpeak" },
  { label: "Peak", value: "peak" },
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

export interface CalculatorProps { initialYear?: string; initialMake?: string; initialModel?: string; initialTrim?: string; }

export function Calculator({ initialYear = "", initialMake = "", initialModel = "", initialTrim = "" }: CalculatorProps) {
  const [year, setYear] = useState<string>(initialYear)
  const [make, setMake] = useState<string>(initialMake)
  const [model, setModel] = useState<string>(initialModel)
  const [trim, setTrim] = useState<string>(initialTrim)

  useEffect(() => {
    if (initialYear) setYear(initialYear)
    if (initialMake) setMake(initialMake)
    if (initialModel) setModel(initialModel)
    if (initialTrim) setTrim(initialTrim)
  }, [initialYear, initialMake, initialModel, initialTrim])
  const [chargerPower, setChargerPower] = useState<number>(5.8)
  const [chargerSelection, setChargerSelection] = useState<string>("5.8")
  const [customChargerPower, setCustomChargerPower] = useState<string>("")
  const [touMode, setTouMode] = useState<string>("standard")
  const [stateCode, setStateCode] = useState<string>("CA")
  const [electricityRate, setElectricityRate] = useState<string>("0.320")
  const [rateOverridden, setRateOverridden] = useState<boolean>(false)
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

  // Get available models for selected make
  const availableModels = year && make ? Object.keys(evData[year]?.[make] || {}) : []

  // Get available trims for selected model
  const availableTrims = year && make && model ? Object.keys(evData[year]?.[make]?.[model] || {}) : []

  // Get battery capacity
  const batteryCapacity = year && make && model && trim ? evData[year]?.[make]?.[model]?.[trim] : null

  // Auto-update electricity rate when state or TOU mode changes (unless user manually overrode)
  useEffect(() => {
    if (rateOverridden) return
    const r = getRateByCode(stateCode)
    if (!r) return
    let newRate: number
    if (touMode === "offpeak") newRate = r.offPeakRate
    else if (touMode === "peak") newRate = r.peakRate
    else newRate = r.standardRate
    setElectricityRate(newRate.toFixed(3))
  }, [stateCode, touMode, rateOverridden])

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
    const cost = actualEnergyNeeded * rate

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
    setModel("")
    setTrim("")
  }

  const handleMakeChange = (value: string) => {
    setMake(value)
    setModel("")
    setTrim("")
  }

  const handleModelChange = (value: string) => {
    setModel(value)
    setTrim("")
  }

  return (
    <>
      
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
          padding: "1rem clamp(0.75rem, 3vw, 2rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(34, 211, 238, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            minWidth: 0,
          }}
        >
          <Zap
            size={24}
            style={{ color: styles.cyan, flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: "clamp(1.05rem, 4vw, 1.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              whiteSpace: "nowrap",
            }}
          >
            EV Charging Calculator
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem) clamp(1.5rem, 4vw, 3rem)",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >

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
          padding: "0 clamp(0.75rem, 3vw, 2rem) clamp(2rem, 5vw, 4rem)",
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
              padding: "1rem clamp(0.875rem, 3vw, 2rem)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", minWidth: 0 }}>
              <Plug size={22} style={{ color: styles.cyan, flexShrink: 0 }} />
              <CardTitle
                style={{
                  color: styles.textPrimary,
                  fontSize: "clamp(1.05rem, 4.2vw, 1.5rem)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                }}
              >
                Charging Cost Calculator
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent style={{ padding: "1.25rem clamp(1rem, 3vw, 2rem) 1.5rem" }}>
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
                    {Object.keys(evData)
                      .sort((a, b) => Number(b) - Number(a))
                      .map((y) => (
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
                  Make
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
                  Model
                </Label>
                <Select value={model} onValueChange={handleModelChange} disabled={!make}>
                  <SelectTrigger
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: "0.75rem",
                      color: styles.textPrimary,
                    }}
                  >
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((m) => (
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
                <Select value={trim} onValueChange={setTrim} disabled={!model}>
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
                  State
                </Label>
                <Select
                  value={stateCode}
                  onValueChange={(v) => {
                    setStateCode(v)
                    setRateOverridden(false)
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
                    {stateRates.map((r) => (
                      <SelectItem key={r.stateCode} value={r.stateCode}>
                        {r.state}
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
                  Rate Plan
                </Label>
                <Select
                  value={touMode}
                  onValueChange={(v) => {
                    setTouMode(v)
                    setRateOverridden(false)
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
                    {touModes.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
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
                  Electricity Rate ($/kWh)
                </Label>
                <Input
                  type="number"
                  step="0.001"
                  value={electricityRate}
                  onChange={(e) => {
                    setElectricityRate(e.target.value)
                    setRateOverridden(true)
                    markInputsChanged()
                  }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(34, 211, 238, 0.2)",
                    borderRadius: "0.75rem",
                    color: styles.textPrimary,
                  }}
                />
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: styles.textSecondary,
                    marginTop: "0.5rem",
                  }}
                >
                  {rateOverridden
                    ? "Custom rate (edit cleared by changing state or plan)"
                    : `Auto-set from ${getRateByCode(stateCode)?.state ?? stateCode} — ${touMode === "offpeak" ? "Off-Peak" : touMode === "peak" ? "Peak" : "Standard"}`}
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
                  padding: "clamp(1.25rem, 4vw, 2rem)",
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
                    flexWrap: "wrap",
                    gap: "0.75rem",
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
                      flex: "1 1 200px",
                      minWidth: 0,
                      width: "100%",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: "0.75rem",
                      color: styles.textPrimary,
                    }}
                  />
                  <Button
                    type="submit"
                    style={{
                      flex: "1 1 auto",
                      backgroundColor: styles.cyan,
                      color: styles.background,
                      borderRadius: "0.75rem",
                      fontWeight: 600,
                      padding: "0.75rem 1.5rem",
                      whiteSpace: "nowrap",
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
                  Your email is safe with us â€” we never sell or share your info.
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
                  padding: "clamp(1rem, 3vw, 2rem)",
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
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "clamp(0.5rem, 2vw, 1.5rem)",
                  }}
                >
                  <div style={{ textAlign: "center", minWidth: 0 }}>
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
                        fontSize: "clamp(1.25rem, 5vw, 1.75rem)",
                        fontWeight: 700,
                        color: styles.cyan,
                        marginBottom: "0.25rem",
                        wordBreak: "break-word",
                        lineHeight: 1.1,
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

                  <div style={{ textAlign: "center", minWidth: 0 }}>
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
                        fontSize: "clamp(1.25rem, 5vw, 1.75rem)",
                        fontWeight: 700,
                        color: styles.cyan,
                        marginBottom: "0.25rem",
                        wordBreak: "break-word",
                        lineHeight: 1.1,
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

                  <div style={{ textAlign: "center", minWidth: 0 }}>
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
                        fontSize: "clamp(1.25rem, 5vw, 1.75rem)",
                        fontWeight: 700,
                        color: styles.cyan,
                        marginBottom: "0.25rem",
                        wordBreak: "break-word",
                        lineHeight: 1.1,
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
        <p>&copy; 2026 What&apos;s The Charge?</p>
      </footer>
    </div>
    </>
  )
}


