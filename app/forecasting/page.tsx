"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PiTrendUp, PiPlus } from "react-icons/pi"

export default function ForecastingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tighter">Travel Forecasting</h1>
            <p className="text-muted-foreground text-sm font-light">Predict future travel trends and costs</p>
          </div>
          <Button className="font-light">
            <PiPlus className="h-4 w-4 mr-2" />
            Create Forecast
          </Button>
        </div>

        {/* Empty State */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="font-light tracking-tighter text-lg">Forecasting Models</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center">
              <PiTrendUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No forecasts available</h3>
              <p className="text-muted-foreground mb-4">Start tracking travel data to generate forecasting insights.</p>
              <Button>
                <PiPlus className="h-4 w-4 mr-2" />
                Create Forecast
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
