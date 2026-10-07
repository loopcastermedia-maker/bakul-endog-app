import test from 'node:test'
import assert from 'node:assert/strict'

import { calculateEstimatedBiji, calculateLineTotal } from './business.js'

test('calculateLineTotal multiplies kg with unit price', () => {
  assert.equal(calculateLineTotal(20, 18000), 360000)
})

test('calculateEstimatedBiji converts kg into product yield', () => {
  assert.equal(calculateEstimatedBiji(14, 20), 280)
})
