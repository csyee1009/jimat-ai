import { NextResponse } from "next/server";

// Mock data to ensure successful dashboard generation
const MOCK_DATA = {
  usageHistory: [
    { month: "Jun", usage: 450, cost: 120 },
    { month: "Jul", usage: 480, cost: 135 },
    { month: "Aug", usage: 520, cost: 150 },
    { month: "Sep", usage: 490, cost: 140 },
    { month: "Oct", usage: 460, cost: 125 },
    { month: "Nov", usage: 430, cost: 115 },
  ],
  billSummary: {
    totalAmount: 115.50,
    billingPeriod: "1 Nov 2024 - 30 Nov 2024",
    dueDate: "15 Dec 2024",
  },
  metrics: {
    averageUsage: 471,
    dailyUsage: 14.3,
    generationCost: 0.25,
    networkCharge: 0.15,
    capacityCharge: 0.05,
    greenIncentive: -0.02,
  },
  costBreakdown: [
    { name: "Generation", value: 65.5, color: "#3b82f6" },
    { name: "Network", value: 35.2, color: "#8b5cf6" },
    { name: "Capacity", value: 10.5, color: "#f59e0b" },
    { name: "Green Rebate", value: -5.7, color: "#10b981" },
  ],
};

export async function POST(request: Request) {
  console.log("Analyze bill API called (MOCK MODE)");

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("No file uploaded");
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    console.log(`File received: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Returning mock data");
    return NextResponse.json(MOCK_DATA);
  } catch (error: any) {
    console.error("Error in mock analysis:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze bill" },
      { status: 500 }
    );
  }
}
