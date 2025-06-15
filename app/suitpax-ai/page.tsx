import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SuitPaxAI() {
  return (
    <div className="container mx-auto py-10">
      <Card className="w-[400px] mx-auto">
        <CardHeader>
          <CardTitle>SuitPax AI</CardTitle>
          <CardDescription>Get personalized travel recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Destination</Label>
                <Input id="location" placeholder="Where are you going?" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="interests">Interests</Label>
                <Input id="interests" placeholder="What are you interested in?" />
              </div>
            </div>
            <Button className="w-full mt-4">Get Recommendations</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
