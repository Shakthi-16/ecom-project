import { getVisitCount } from "./db"

export const calculateDynamicPrice = async (basePrice: number, userId: string, productId: string): Promise<number> => {
  let visitCount = 0

  if (userId === "guest") {
    // For guest users, get visit count from localStorage
    const guestVisits = JSON.parse(localStorage.getItem("guestVisits") || "{}")
    visitCount = guestVisits[productId] || 0
  } else {
    // For authenticated users, get from Firestore
    visitCount = await getVisitCount(userId, productId)
  }

  return basePrice + visitCount * 0.5
}

export const trackGuestVisit = (productId: string): void => {
  const guestVisits = JSON.parse(localStorage.getItem("guestVisits") || "{}")
  guestVisits[productId] = (guestVisits[productId] || 0) + 1
  localStorage.setItem("guestVisits", JSON.stringify(guestVisits))
}
