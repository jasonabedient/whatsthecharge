// EV Battery Data
export const evData: Record<string, Record<string, Record<string, number>>> = {
  "2026": {
    // Tesla
    "Tesla Model 3": {
      "Standard Range RWD": 60.0,
      "Long Range AWD": 78.0,
      "Performance AWD": 78.0,
    },
    "Tesla Model Y": {
      "Standard Range RWD": 60.0,
      "Long Range AWD": 75.0,
      "Performance AWD": 75.0,
    },
    "Tesla Model S": {
      "Long Range AWD": 95.0,
      "Plaid AWD": 95.0,
    },
    "Tesla Model X": {
      "Long Range AWD": 95.0,
      "Plaid AWD": 95.0,
    },
    "Tesla Cybertruck": {
      "Dual Motor AWD": 123.0,
      "Tri Motor AWD": 123.0,
    },
    // Rivian
    "Rivian R1S": {
      "Dual Standard AWD": 92.5,
      "Dual Large AWD": 108.5,
      "Dual Max AWD": 140.0,
      "Tri Max AWD": 140.0,
      "Quad Max AWD": 140.0,
    },
    "Rivian R1T": {
      "Dual Standard AWD": 92.5,
      "Dual Large AWD": 108.5,
      "Dual Max AWD": 140.0,
      "Tri Max AWD": 140.0,
      "Quad Max AWD": 140.0,
    },
    "Rivian R2": {
      "Long Range AWD": 87.9,
    },
    // Ford
    "Ford Mustang Mach-E": {
      "Select RWD": 73.0,
      "Select AWD": 73.0,
      "Premium RWD": 73.0,
      "Premium AWD": 88.0,
      "GT AWD": 91.0,
    },
    "Ford F-150 Lightning": {
      "Standard Range": 98.0,
      "Extended Range": 131.0,
    },
    // Hyundai
    "Hyundai Ioniq 5": {
      "SE Standard Range RWD": 63.0,
      "SE RWD": 84.0,
      "SE AWD": 84.0,
      "SEL RWD": 84.0,
      "SEL AWD": 84.0,
      "Limited RWD": 84.0,
      "Limited AWD": 84.0,
      "XRT AWD": 84.0,
    },
    "Hyundai Ioniq 6": {
      "SE Standard Range RWD": 53.0,
      "SE RWD": 77.4,
      "SEL RWD": 77.4,
      "SEL AWD": 77.4,
      "Limited RWD": 77.4,
      "Limited AWD": 77.4,
    },
    "Hyundai Ioniq 9": {
      "S RWD": 110.3,
      "SE AWD": 110.3,
      "SEL AWD": 110.3,
      "Performance AWD": 110.3,
    },
    "Hyundai Kona Electric": {
      "SE": 48.6,
      "SEL": 64.8,
      "N Line": 64.8,
      "Limited": 64.8,
    },
    // Kia
    "Kia EV6": {
      "Light RWD": 63.0,
      "Wind RWD": 77.4,
      "Wind AWD": 77.4,
      "GT-Line RWD": 77.4,
      "GT-Line AWD": 77.4,
      "GT AWD": 80.0,
    },
    "Kia EV9": {
      "Light": 73.0,
      "Light Long Range": 96.0,
      "Wind AWD": 96.0,
      "Land AWD": 96.0,
      "GT-Line AWD": 96.0,
    },
    "Kia Niro EV": {
      "Wind": 64.8,
      "Wave": 64.8,
    },
    // BMW
    "BMW i4": {
      "eDrive35": 66.0,
      "eDrive40": 81.5,
      "xDrive40": 81.5,
      "M50": 81.5,
    },
    "BMW iX": {
      "xDrive45": 100.1,
      "xDrive50": 105.2,
      "xDrive60": 113.4,
      "M70": 112.6,
    },
    // Mercedes
    "Mercedes EQS": {
      "EQS 450+": 118.0,
      "EQS 450 4Matic": 118.0,
      "EQS 580": 118.0,
    },
    "Mercedes EQE": {
      "EQE 350+": 90.6,
      "EQE 350 4Matic": 90.6,
      "AMG EQE": 90.6,
    },
    // Chevrolet
    "Chevrolet Blazer EV": {
      "LT FWD": 85.0,
      "LT AWD": 85.0,
      "RS AWD": 85.0,
      "SS AWD": 102.0,
    },
    "Chevrolet Equinox EV": {
      "1LT RWD": 85.0,
      "2LT RWD": 85.0,
      "2RS RWD": 85.0,
      "3RS AWD": 85.0,
    },
    "Chevrolet Bolt EUV": {
      "LT": 65.0,
      "Premier": 65.0,
    },
    "Chevrolet Bolt EV": {
      "1LT": 65.0,
      "2LT": 65.0,
    },
    // Volkswagen
    "Volkswagen ID.4": {
      "Pro RWD": 77.0,
      "Pro S RWD": 77.0,
      "Pro AWD": 77.0,
    },
    "Volkswagen ID.Buzz": {
      "RWD": 86.0,
      "AWD": 86.0,
    },
    // Polestar
    "Polestar 2": {
      "Standard Range": 67.0,
      "Long Range Single Motor": 79.0,
      "Long Range Dual Motor": 79.0,
      "Long Range Performance": 79.0,
    },
    "Polestar 3": {
      "Long Range Dual Motor": 107.0,
      "Performance": 107.0,
    },
    "Polestar 4": {
      "Long Range RWD": 100.0,
      "Long Range AWD": 100.0,
    },
    // Audi
    "Audi e-tron GT": {
      "e-tron GT": 97.0,
      "S e-tron GT": 97.0,
      "RS e-tron GT": 97.0,
    },
    "Audi Q4 e-tron": {
      "45 RWD": 77.0,
      "55 AWD": 77.0,
    },
    "Audi Q8 e-tron": {
      "50": 89.0,
      "55": 106.0,
      "SQ8": 106.0,
    },
    // Lucid
    "Lucid Air": {
      "Pure RWD": 84.0,
      "Touring AWD": 92.0,
      "Grand Touring AWD": 117.0,
    },
    "Lucid Gravity": {
      "Touring AWD": 89.0,
      "Grand Touring AWD": 123.0,
    },
    // Volvo
    "Volvo EX90": {
      "Single Motor": 92.0,
      "Twin Motor": 102.0,
      "Twin Motor Performance": 102.0,
    },
    "Volvo EX30": {
      "Core": 64.0,
      "Plus": 64.0,
      "Ultra": 64.0,
    },
    "Volvo C40 Recharge": {
      "Core Twin Motor": 75.0,
      "Plus Twin Motor": 75.0,
      "Ultimate Twin Motor": 75.0,
    },
    "Volvo XC40 Recharge": {
      "Core Twin Motor": 75.0,
      "Plus Twin Motor": 75.0,
      "Ultimate Twin Motor": 75.0,
    },
    // Genesis
    "Genesis GV60": {
      "Standard RWD": 77.4,
      "Performance AWD": 77.4,
    },
    "Genesis Electrified GV70": {
      "Standard AWD": 77.4,
    },
    // Cadillac
    "Cadillac Lyriq": {
      "Luxury RWD": 102.0,
      "Sport AWD": 102.0,
    },
    // Porsche
    "Porsche Taycan": {
      "4 RWD": 82.3,
      "4S AWD": 97.0,
      "Turbo AWD": 97.0,
      "Turbo S AWD": 97.0,
    },
  },
  "2025": {
    // Tesla
    "Tesla Model 3": {
      "Standard Range RWD": 60.0,
      "Long Range AWD": 78.0,
      "Performance AWD": 78.0,
    },
    "Tesla Model Y": {
      "Standard Range RWD": 60.0,
      "Long Range AWD": 75.0,
      "Performance AWD": 75.0,
    },
    "Tesla Model S": {
      "Long Range AWD": 95.0,
      "Plaid AWD": 95.0,
    },
    "Tesla Model X": {
      "Long Range AWD": 95.0,
      "Plaid AWD": 95.0,
    },
    "Tesla Cybertruck": {
      "Dual Motor AWD": 123.0,
      "Tri Motor AWD": 123.0,
    },
    // Rivian
    "Rivian R1S": {
      "Dual Standard AWD": 92.5,
      "Dual Large AWD": 108.5,
      "Dual Max AWD": 140.0,
      "Tri Max AWD": 140.0,
      "Quad Max AWD": 140.0,
    },
    "Rivian R1T": {
      "Dual Standard AWD": 92.5,
      "Dual Large AWD": 108.5,
      "Dual Max AWD": 140.0,
      "Tri Max AWD": 140.0,
      "Quad Max AWD": 140.0,
    },
    "Rivian R2": {
      "Long Range AWD": 87.9,
    },
    // Ford
    "Ford Mustang Mach-E": {
      "Select RWD": 73.0,
      "Select AWD": 73.0,
      "Premium RWD": 73.0,
      "Premium AWD": 88.0,
      "GT AWD": 91.0,
    },
    "Ford F-150 Lightning": {
      "Standard Range": 98.0,
      "Extended Range": 131.0,
    },
    // Hyundai
    "Hyundai Ioniq 5": {
      "SE Standard Range RWD": 63.0,
      "SE RWD": 84.0,
      "SE AWD": 84.0,
      "SEL RWD": 84.0,
      "SEL AWD": 84.0,
      "Limited RWD": 84.0,
      "Limited AWD": 84.0,
      "XRT AWD": 84.0,
    },
    "Hyundai Ioniq 6": {
      "SE Standard Range RWD": 53.0,
      "SE RWD": 77.4,
      "SEL RWD": 77.4,
      "SEL AWD": 77.4,
      "Limited RWD": 77.4,
      "Limited AWD": 77.4,
    },
    "Hyundai Ioniq 9": {
      "S RWD": 110.3,
      "SE AWD": 110.3,
      "SEL AWD": 110.3,
      "Performance AWD": 110.3,
    },
    "Hyundai Kona Electric": {
      "SE": 48.6,
      "SEL": 64.8,
      "N Line": 64.8,
      "Limited": 64.8,
    },
    // Kia
    "Kia EV6": {
      "Light RWD": 63.0,
      "Wind RWD": 77.4,
      "Wind AWD": 77.4,
      "GT-Line RWD": 77.4,
      "GT-Line AWD": 77.4,
      "GT AWD": 80.0,
    },
    "Kia EV9": {
      "Light": 73.0,
      "Light Long Range": 96.0,
      "Wind AWD": 96.0,
      "Land AWD": 96.0,
      "GT-Line AWD": 96.0,
    },
    "Kia Niro EV": {
      "Wind": 64.8,
      "Wave": 64.8,
    },
    // BMW
    "BMW i4": {
      "eDrive35": 66.0,
      "eDrive40": 81.5,
      "xDrive40": 81.5,
      "M50": 81.5,
    },
    "BMW iX": {
      "xDrive45": 100.1,
      "xDrive50": 105.2,
      "xDrive60": 113.4,
      "M70": 112.6,
    },
    // Mercedes
    "Mercedes EQS": {
      "EQS 450+": 118.0,
      "EQS 450 4Matic": 118.0,
      "EQS 580": 118.0,
    },
    "Mercedes EQE": {
      "EQE 350+": 90.6,
      "EQE 350 4Matic": 90.6,
      "AMG EQE": 90.6,
    },
    // Chevrolet
    "Chevrolet Blazer EV": {
      "LT FWD": 85.0,
      "LT AWD": 85.0,
      "RS AWD": 85.0,
      "SS AWD": 102.0,
    },
    "Chevrolet Equinox EV": {
      "1LT RWD": 85.0,
      "2LT RWD": 85.0,
      "2RS RWD": 85.0,
      "3RS AWD": 85.0,
    },
    "Chevrolet Bolt EUV": {
      "LT": 65.0,
      "Premier": 65.0,
    },
    "Chevrolet Bolt EV": {
      "1LT": 65.0,
      "2LT": 65.0,
    },
    // Volkswagen
    "Volkswagen ID.4": {
      "Pro RWD": 77.0,
      "Pro S RWD": 77.0,
      "Pro AWD": 77.0,
    },
    "Volkswagen ID.Buzz": {
      "RWD": 86.0,
      "AWD": 86.0,
    },
    // Polestar
    "Polestar 2": {
      "Standard Range": 67.0,
      "Long Range Single Motor": 79.0,
      "Long Range Dual Motor": 79.0,
      "Long Range Performance": 79.0,
    },
    "Polestar 3": {
      "Long Range Dual Motor": 107.0,
      "Performance": 107.0,
    },
    "Polestar 4": {
      "Long Range RWD": 100.0,
      "Long Range AWD": 100.0,
    },
    // Audi
    "Audi e-tron GT": {
      "e-tron GT": 97.0,
      "S e-tron GT": 97.0,
      "RS e-tron GT": 97.0,
    },
    "Audi Q4 e-tron": {
      "45 RWD": 77.0,
      "55 AWD": 77.0,
    },
    "Audi Q8 e-tron": {
      "50": 89.0,
      "55": 106.0,
      "SQ8": 106.0,
    },
    // Lucid
    "Lucid Air": {
      "Pure RWD": 84.0,
      "Touring AWD": 92.0,
      "Grand Touring AWD": 117.0,
    },
    "Lucid Gravity": {
      "Touring AWD": 89.0,
      "Grand Touring AWD": 123.0,
    },
    // Volvo
    "Volvo EX90": {
      "Single Motor": 92.0,
      "Twin Motor": 102.0,
      "Twin Motor Performance": 102.0,
    },
    "Volvo EX30": {
      "Core": 64.0,
      "Plus": 64.0,
      "Ultra": 64.0,
    },
    "Volvo C40 Recharge": {
      "Core Twin Motor": 75.0,
      "Plus Twin Motor": 75.0,
      "Ultimate Twin Motor": 75.0,
    },
    "Volvo XC40 Recharge": {
      "Core Twin Motor": 75.0,
      "Plus Twin Motor": 75.0,
      "Ultimate Twin Motor": 75.0,
    },
    // Genesis
    "Genesis GV60": {
      "Standard RWD": 77.4,
      "Performance AWD": 77.4,
    },
    "Genesis Electrified GV70": {
      "Standard AWD": 77.4,
    },
    // Cadillac
    "Cadillac Lyriq": {
      "Luxury RWD": 102.0,
      "Sport AWD": 102.0,
    },
    // Porsche
    "Porsche Taycan": {
      "4 RWD": 82.3,
      "4S AWD": 97.0,
      "Turbo AWD": 97.0,
      "Turbo S AWD": 97.0,
    },
  },
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



export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}

export interface VehicleParam {
  year: string;
  makeModel: string;
  slug: string;
}

export function getAllVehicleSlugs(): VehicleParam[] {
  const params: VehicleParam[] = [];
  
  for (const [year, makes] of Object.entries(evData)) {
    for (const [makeModel, trims] of Object.entries(makes)) {
      params.push({
        year,
        makeModel,
        slug: slugify(makeModel)
      });
    }
  }
  
  // Deduplicate by slug
  const uniqueParams = Array.from(new Map(params.map(item => [item.slug, item])).values());
  return uniqueParams;
}

export function getVehicleBySlug(slug: string): VehicleParam | undefined {
  return getAllVehicleSlugs().find(v => v.slug === slug);
}
