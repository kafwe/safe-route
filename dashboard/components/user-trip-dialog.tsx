import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  CircleAlert,
  Locate,
  MapPin,
  Ruler,
} from "lucide-react"
import { Trip } from "@/types/trip"
import { User } from "@/types/user"
import { convertRiskToText } from "@/lib/utils"

export function UserTripDialog({ user, trips }: { user: User; trips: Trip[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>View Trips</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{user.name}'s Trips</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto max-h-[400px]">
          {trips.map((trip, index) => (
            <div key={index} className="grid gap-2 p-4 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="font-medium block">Start</span>
                  <span className="truncate">{trip.startLocation.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Locate className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="font-medium block">Destination</span>
                  <span className="truncate">{trip.endLocation.name}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  {new Date(trip.startTime).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-muted-foreground" />
                  {trip.distance} km
                </div>
              </div>
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                  <CircleAlert className={`w-5 h-5 ${convertRiskToText(trip.riskScore) === "High" ? "text-red-500" : convertRiskToText(trip.riskScore) === "Medium" ? "text-yellow-500" : "text-green-500"}`} />
                  <span className={`${convertRiskToText(trip.riskScore) === "High" ? "text-red-500" : convertRiskToText(trip.riskScore) === "Medium" ? "text-yellow-500" : "text-green-500"} font-bold`}>{convertRiskToText(trip.riskScore)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  {trip.duration} min
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}