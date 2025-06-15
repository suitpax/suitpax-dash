import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SmartBankPage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="w-[400px] mx-auto">
        <CardHeader>
          <CardTitle>Smart Bank</CardTitle>
          <CardDescription>Manage your finances smartly.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" placeholder="Enter amount" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Enter description" />
              </div>
            </div>
            <Button className="w-full mt-4">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
