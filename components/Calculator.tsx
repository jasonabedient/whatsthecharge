"use client"

import { useState, FormEvent, useEffect } from "react"
import { Zap, Clock, DollarSign, Mail, Battery, Plug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
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
  cardRadius: "1.875rem",
  inputBg: "rgba(255, 255, 255, 0.05)",
  inputBorder: "1px solid rgba(34, 211, 238, 0.2)",
  inputRadius: "0.75rem",
}

const labelStyle: React.CSSProperties = {
  color: styles.textSecondary,
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: "0.5rem",
  display: "block",
}

const inputStyle: React.CSSProperties = {
  backgroundColor: styles.inputBg,
  border: styles.inputBorder,
  borderRadius: styles.inputRadius,
  color: styles.textPrimary,
}

export interface CalculatorProps {
  initialYear?: string
  initialMake?: string
  initialModel?: string
  initialTrim?: string
}

export function Calculator({
  initialYear = "",
  initialMake = "",
  initialModel = "",
  initialTrim = "",
}: CalculatorProps) {
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
  // Single-slider charging range (start–end pair)
  const [chargingRange, setChargingRange] = useState<[number, number]>([20, 80])
  // Mirror string inputs so users can type freely (including clearing the field) before committing on blur/Enter
  const [startInput, setStartInput] = useState<string>("20")
  const [endInput, setEndInput] = useState<string>("80")
  const [email, setEmail] = useState<string>("")
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [showEmailPrompt, setShowEmailPrompt] = useState(false)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [inputsChangedSinceCalculate, setInputsChangedSinceCalculate] = useState(false)

  // Get available makes / models / trims for cascading selects
  const availableMakes = year ? Object.keys(evData[year] || {}) : []
  const availableModels = year && make ? Object.keys(evData[year]?.[make] || {}) : []
  const availableTrims = year && make && model ? Object.keys(evData[year]?.[make]?.[model] || {}) : []
  const batteryCapacity = year && make && model && trim ? evData[year]?.[make]?.[model]?.[trim] : null

  // Auto-update electricity rate when state or TOU mode changes (unless user overrode)
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

  // Mark inputs as changed when relevant fields change
  const markInputsChanged = () => {
    if (hasCalculated) setInputsChangedSinceCalculate(true)
  }

  // Energy needed in kWh based on charging range — independent of charger speed
  const energyNeededKwh = (() => {
    if (!batteryCapacity) return null
    const [startPct, endPct] = chargingRange
    if (endPct <= startPct) return null
    const energyNeeded = batteryCapacity * ((endPct - startPct) / 100)
    return energyNeeded / CHARGING_EFFICIENCY
  })()

  // Compute results for the primary selected charger (used by /api/lead and email/cost flow)
  const calculateCharging = () => {
    if (energyNeededKwh === null) return null
    const rate = parseFloat(electricityRate)
    if (isNaN(rate)) return null
    const chargingTime = energyNeededKwh / chargerPower
    const cost = energyNeededKwh * rate
    return {
      energyNeeded: energyNeededKwh.toFixed(1),
      chargingTime: chargingTime.toFixed(1),
      cost: cost.toFixed(2),
    }
  }

  const currentResults = calculateCharging()
  const canCalculate = currentResults !== null

  const handleCalculate = () => {
    if (!currentResults) return
    if (!emailSubmitted) {
      setShowEmailPrompt(true)
    }
    setHasCalculated(true)
    setInputsChangedSinceCalculate(false)
  }

  const isButtonDisabled = !canCalculate || (hasCalculated && !inputsChangedSinceCalculate && emailSubmitted)
  const buttonText = emailSubmitted ? "Recalculate" : "Calculate"

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    setEmailSubmitted(true)
    setShowEmailPrompt(false)
    try {
      const rateNum = Number.parseFloat(electricityRate)
      const costNum = currentResults ? Number.parseFloat(currentResults.cost) : null
      const energyNum = currentResults ? Number.parseFloat(currentResults.energyNeeded) : null
      const hoursNum = currentResults ? Number.parseFloat(currentResults.chargingTime) : null

      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          vehicle: [year, make, model, trim].filter(Boolean).join(" "),
          batteryKwh: batteryCapacity ?? null,
          state: stateCode,
          ratePlan: touMode,
          electricityRate: Number.isFinite(rateNum) ? rateNum : null,
          estCost: costNum,
          kwhNeeded: energyNum,
          hours: hoursNum,
        }),
      })
    } catch (err) {
      console.error("Lead submit failed", err)
    }
  }

  // Keep input mirrors in sync when the slider moves (drag, etc.)
  useEffect(() => {
    setStartInput(String(chargingRange[0]))
    setEndInput(String(chargingRange[1]))
  }, [chargingRange])

  // Commit handlers: clamp on blur / Enter, fall back to current value if invalid
  const commitStartInput = () => {
    const raw = parseInt(startInput, 10)
    if (Number.isNaN(raw)) {
      setStartInput(String(chargingRange[0]))
      return
    }
    const next = Math.max(0, Math.min(raw, chargingRange[1]))
    setChargingRange([next, chargingRange[1]])
    setStartInput(String(next))
    markInputsChanged()
  }

  const commitEndInput = () => {
    const raw = parseInt(endInput, 10)
    if (Number.isNaN(raw)) {
      setEndInput(String(chargingRange[1]))
      return
    }
    const next = Math.min(100, Math.max(raw, chargingRange[0]))
    setChargingRange([chargingRange[0], next])
    setEndInput(String(next))
    markInputsChanged()
  }

  const handleYearChange = (value: string) => {
    setYear(value)
    setMake("")
    setModel("")
    setTrim("")
    markInputsChanged()
  }
  const handleMakeChange = (value: string) => {
    setMake(value)
    setModel("")
    setTrim("")
    markInputsChanged()
  }
  const handleModelChange = (value: string) => {
    setModel(value)
    setTrim("")
    markInputsChanged()
  }

  // Result tiles: kWh needed is independent of charger speed,
  // so show the same kWh value across the three tiles (matches Figma — three "55.9 kWh needed" tiles).
  // We also include the per-charger time underneath each tile as helpful context.

  return (
    <div
      style={{
        backgroundColor: styles.background,
        minHeight: "100vh",
        color: styles.textPrimary,
      }}
    >
      {/* Secondary header bar: "EV Charging Calculator" */}
      <header
        style={{
          padding: "1rem clamp(0.75rem, 3vw, 2rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(34, 211, 238, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
          <Zap size={24} style={{ color: styles.cyan, flexShrink: 0 }} />
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

      {/* Hero */}
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
          What&apos;s The <span style={{ color: styles.cyan }}>Charge?</span>
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
          maxWidth: "1200px",
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
              padding: "0.625rem clamp(0.875rem, 3vw, 2rem)",
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

          <CardContent style={{ padding: "1.5rem clamp(1rem, 3vw, 2rem) 1.5rem" }}>
            {/* Two-column layout: form (left) + results panel (right) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                gap: "clamp(1.5rem, 3vw, 2.5rem)",
                alignItems: "start",
              }}
              className="wtc-two-col"
            >
              {/* LEFT: Form */}
              <div style={{ minWidth: 0 }}>
                {/* Year */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <Label style={labelStyle}>Year</Label>
                  <Select value={year} onValueChange={handleYearChange}>
                    <SelectTrigger style={{ ...inputStyle, width: "100%" }}>
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

                {/* Make */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <Label style={labelStyle}>Make</Label>
                  <Select value={make} onValueChange={handleMakeChange} disabled={!year}>
                    <SelectTrigger style={{ ...inputStyle, width: "100%" }}>
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

                {/* Model */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <Label style={labelStyle}>Model</Label>
                  <Select value={model} onValueChange={handleModelChange} disabled={!make}>
                    <SelectTrigger style={{ ...inputStyle, width: "100%" }}>
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

                {/* Trim */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <Label style={labelStyle}>Trim</Label>
                  <Select
                    value={trim}
                    onValueChange={(v) => {
                      setTrim(v)
                      markInputsChanged()
                    }}
                    disabled={!model}
                  >
                    <SelectTrigger style={{ ...inputStyle, width: "100%" }}>
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

                {/* Charger Power */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <Label style={labelStyle}>Charger Power</Label>
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
                    <SelectTrigger style={{ ...inputStyle, width: "100%" }}>
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
                        if (!isNaN(val) && val > 0) setChargerPower(val)
                        markInputsChanged()
                      }}
                      style={{ ...inputStyle, marginTop: "0.75rem" }}
                    />
                  )}
                </div>

                {/* State */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <Label style={labelStyle}>State</Label>
                  <Select
                    value={stateCode}
                    onValueChange={(v) => {
                      setStateCode(v)
                      setRateOverridden(false)
                      markInputsChanged()
                    }}
                  >
                    <SelectTrigger style={{ ...inputStyle, width: "100%" }}>
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

                {/* Rate Plan */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <Label style={labelStyle}>Rate Plan</Label>
                  <Select
                    value={touMode}
                    onValueChange={(v) => {
                      setTouMode(v)
                      setRateOverridden(false)
                      markInputsChanged()
                    }}
                  >
                    <SelectTrigger style={{ ...inputStyle, width: "100%" }}>
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

                {/* Electric Rate + Post Code (Figma) */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <Label style={labelStyle}>Electric Rate ($/kWh)</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={electricityRate}
                    onChange={(e) => {
                      setElectricityRate(e.target.value)
                      setRateOverridden(true)
                      markInputsChanged()
                    }}
                    style={inputStyle}
                  />
                  <p style={{ fontSize: "0.75rem", color: styles.textSecondary, marginTop: "0.5rem" }}>
                    {rateOverridden
                      ? "Custom rate (edit cleared by changing state or plan)"
                      : `Auto-set from ${getRateByCode(stateCode)?.state ?? stateCode} — ${
                          touMode === "offpeak" ? "Off-Peak" : touMode === "peak" ? "Peak" : "Standard"
                        }`}
                  </p>
                </div>

                {/* Charging Range slider with editable number inputs at each end */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <Label style={labelStyle}>Charging Range</Label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={startInput}
                      onChange={(e) => setStartInput(e.target.value)}
                      onBlur={() => commitStartInput()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          commitStartInput()
                          ;(e.target as HTMLInputElement).blur()
                        }
                      }}
                      aria-label="Starting battery percentage"
                      style={{
                        ...inputStyle,
                        width: "4.5rem",
                        textAlign: "center",
                        flexShrink: 0,
                        padding: "0.4rem 0.5rem",
                      }}
                    />
                    <div className="wtc-slider" style={{ flex: 1, padding: "0.25rem 0" }}>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={chargingRange}
                        onValueChange={(v) => {
                          if (Array.isArray(v) && v.length === 2) {
                            setChargingRange([v[0], v[1]] as [number, number])
                            markInputsChanged()
                          }
                        }}
                      />
                    </div>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={endInput}
                      onChange={(e) => setEndInput(e.target.value)}
                      onBlur={() => commitEndInput()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          commitEndInput()
                          ;(e.target as HTMLInputElement).blur()
                        }
                      }}
                      aria-label="Target battery percentage"
                      style={{
                        ...inputStyle,
                        width: "4.5rem",
                        textAlign: "center",
                        flexShrink: 0,
                        padding: "0.4rem 0.5rem",
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
                    borderRadius: styles.inputRadius,
                    fontWeight: 600,
                    padding: "1rem 1.5rem",
                    fontSize: "1rem",
                    cursor: !isButtonDisabled ? "pointer" : "not-allowed",
                  }}
                >
                  {buttonText}
                </Button>
              </div>

              {/* RIGHT: Results panel */}
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: styles.textPrimary,
                    marginBottom: "1.25rem",
                  }}
                >
                  Charging Results!
                </h3>

                {/* Battery Detected pill (moved to right column) */}
                {batteryCapacity && (
                  <div
                    style={{
                      backgroundColor: "rgba(34, 211, 238, 0.1)",
                      border: "1px solid rgba(34, 211, 238, 0.3)",
                      borderRadius: "1rem",
                      padding: "0.75rem 1rem",
                      marginBottom: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <Battery size={20} style={{ color: styles.cyan }} />
                    <div>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: styles.textSecondary,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: "0.15rem",
                        }}
                      >
                        Battery Detected (Usable)
                      </p>
                      <p style={{ fontSize: "1rem", fontWeight: 700, color: styles.cyan }}>
                        {batteryCapacity} kWh
                      </p>
                    </div>
                  </div>
                )}

                {/* Charging Estimate panel — matches live site */}
                {currentResults && (
                  <div
                    style={{
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: "1rem",
                      padding: "1.25rem 1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: styles.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "1rem",
                      }}
                    >
                      Charging Estimate
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: "clamp(0.5rem, 2vw, 1.5rem)",
                      }}
                    >
                      {[
                        { Icon: Zap, value: currentResults.energyNeeded, label: "kWh Needed" },
                        { Icon: Clock, value: currentResults.chargingTime, label: "Hours" },
                        { Icon: DollarSign, value: `$${currentResults.cost}`, label: "Est. Cost" },
                      ].map((tile) => (
                        <div key={tile.label} style={{ textAlign: "center", minWidth: 0 }}>
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
                            <tile.Icon size={24} style={{ color: styles.cyan }} />
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
                            {tile.value}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: styles.textSecondary,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {tile.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email gate */}
                {showEmailPrompt && !emailSubmitted && (
                  <div
                    style={{
                      backgroundColor: "rgba(34, 211, 238, 0.05)",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: "1rem",
                      padding: "1.25rem",
                      textAlign: "center",
                    }}
                  >
                    <Mail size={28} style={{ color: styles.cyan, margin: "0 auto 0.75rem" }} />
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: styles.textPrimary,
                        marginBottom: "0.5rem",
                      }}
                    >
                      Get charging tips in your inbox
                    </h4>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: styles.textSecondary,
                        marginBottom: "1rem",
                      }}
                    >
                      We&apos;ll never sell or share your info.
                    </p>
                    <form
                      onSubmit={handleEmailSubmit}
                      style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                    >
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ ...inputStyle, flex: "1 1 180px", minWidth: 0 }}
                      />
                      <Button
                        type="submit"
                        style={{
                          backgroundColor: styles.cyan,
                          color: styles.background,
                          borderRadius: styles.inputRadius,
                          fontWeight: 600,
                          padding: "0.6rem 1rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Subscribe
                      </Button>
                    </form>
                  </div>
                )}

                {emailSubmitted && (
                  <div
                    style={{
                      backgroundColor: "rgba(34, 211, 238, 0.1)",
                      border: "1px solid rgba(34, 211, 238, 0.3)",
                      borderRadius: "1rem",
                      padding: "0.85rem 1rem",
                      textAlign: "center",
                      color: styles.cyan,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    Thanks for subscribing! Check your inbox for Charging Tips!
                  </div>
                )}
              </div>
            </div>

            {/* Responsive: stack on narrow screens + cyan slider */}
            <style>{`
              @media (max-width: 860px) {
                .wtc-two-col {
                  grid-template-columns: minmax(0, 1fr) !important;
                }
              }
              /* Use high specificity (double class) so we beat the Tailwind utility classes on the slider primitives. */
              .wtc-slider.wtc-slider [data-slot="slider-track"],
              .wtc-slider.wtc-slider .bg-muted {
                background-color: rgba(34, 211, 238, 0.15) !important;
              }
              .wtc-slider.wtc-slider [data-slot="slider-range"],
              .wtc-slider.wtc-slider [data-slot="slider-range"].bg-primary {
                background-color: #22d3ee !important;
              }
              .wtc-slider.wtc-slider [data-slot="slider-thumb"],
              .wtc-slider.wtc-slider [data-slot="slider-thumb"].bg-white,
              .wtc-slider.wtc-slider [data-slot="slider-thumb"].border-primary {
                background-color: #22d3ee !important;
                border-color: #22d3ee !important;
                box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.4), 0 0 12px rgba(34, 211, 238, 0.4) !important;
              }
              .wtc-slider.wtc-slider [data-slot="slider-thumb"]:focus-visible {
                outline: 2px solid #22d3ee !important;
                outline-offset: 2px !important;
              }
              /* Hide the number-input spinner arrows for a cleaner look */
              .wtc-two-col input[type="number"]::-webkit-outer-spin-button,
              .wtc-two-col input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }
              .wtc-two-col input[type="number"] {
                -moz-appearance: textfield;
              }
            `}</style>
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
  )
}
