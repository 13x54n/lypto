import ccxt from 'ccxt';

// Cache prices for 30 seconds to avoid rate limiting
let cachedPrices: {
  solCad: number;
  usdCad: number;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 30000; // 30 seconds

/**
 * Fetch real-time exchange rates for SOL/CAD and USD/CAD
 */
export async function getExchangeRates(): Promise<{
  solCad: number;
  usdCad: number;
}> {
  try {
    // Return cached prices if still valid
    if (cachedPrices && Date.now() - cachedPrices.timestamp < CACHE_DURATION) {
      return {
        solCad: cachedPrices.solCad,
        usdCad: cachedPrices.usdCad,
      };
    }

    // Fetch fresh prices
    const exchange = new ccxt.binance();
    
    // Fetch SOL/USDT and USDT/CAD (or use CAD pairs if available)
    const [solUsdt, usdtCad] = await Promise.all([
      exchange.fetchTicker('SOL/USDT').catch(() => null),
      exchange.fetchTicker('USDT/CAD').catch(() => null),
    ]);

    let solCad = 0;
    let usdCad = 1.35; // Fallback approximate USD/CAD rate

    // Calculate SOL/CAD
    if (solUsdt?.last && usdtCad?.last) {
      solCad = solUsdt.last * usdtCad.last;
      usdCad = usdtCad.last;
    } else if (solUsdt?.last) {
      // If no USDT/CAD, use approximate rate
      solCad = solUsdt.last * usdCad;
    }

    // Cache the results
    cachedPrices = {
      solCad,
      usdCad,
      timestamp: Date.now(),
    };

    console.log(`[Prices] SOL/CAD: ${solCad.toFixed(2)}, USD/CAD: ${usdCad.toFixed(2)}`);

    return { solCad, usdCad };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Return fallback rates
    return {
      solCad: 200, // Approximate SOL price in CAD
      usdCad: 1.35, // Approximate USD/CAD rate
    };
  }
}

/**
 * Convert amounts to CAD
 */
export async function convertToCad(amounts: {
  sol?: number;
  usdc?: number;
}): Promise<{
  solCad: number;
  usdcCad: number;
  totalCad: number;
}> {
  const rates = await getExchangeRates();
  
  const solCad = (amounts.sol || 0) * rates.solCad;
  const usdcCad = (amounts.usdc || 0) * rates.usdCad;
  const totalCad = solCad + usdcCad;

  return {
    solCad,
    usdcCad,
    totalCad,
  };
}

