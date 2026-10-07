export function calculateLineTotal(jumlahKg, hargaPerKg) {
  return Number(jumlahKg || 0) * Number(hargaPerKg || 0)
}

export function calculateEstimatedBiji(bijiPerKg, jumlahKg) {
  return Number(bijiPerKg || 0) * Number(jumlahKg || 0)
}
