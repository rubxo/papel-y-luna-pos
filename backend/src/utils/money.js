function toCents(value) {
  return Math.round(Number(value || 0) * 100);
}

function fromCents(value) {
  return Number((Number(value || 0) / 100).toFixed(2));
}

function roundMoney(value) {
  return fromCents(toCents(value));
}

module.exports = { toCents, fromCents, roundMoney };
