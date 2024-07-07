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
import { useEffect, useState } from "react"

const trips = [
  {
    "tripId": "0255d3ea-8008-4b6a-a2c0-186855550499",
    "userId": "06844306-850c-4e1c-9013-8ffff22788bd",
    "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
    "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
    "startTime": "2024-02-25T07:13:50.039033+00:00",
    "endTime": "2024-02-25T07:44:50.039033+00:00",
    "distance": 48.85,
    "duration": 31,
    "riskScore": 23.74
},
{
    "tripId": "5cde1293-5c38-4772-859b-88da3a696277",
    "userId": "06844306-850c-4e1c-9013-8ffff22788bd",
    "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
    "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
    "startTime": "2024-05-25T09:02:21.8743+00:00",
    "endTime": "2024-05-25T09:42:21.8743+00:00",
    "distance": 20.14,
    "duration": 40,
    "riskScore": 42.01
},
{
    "tripId": "1d0aadf0-b975-4fae-87c3-c37d209e3511",
    "userId": "06844306-850c-4e1c-9013-8ffff22788bd",
    "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
    "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
    "startTime": "2024-02-24T17:42:02.949257+00:00",
    "endTime": "2024-02-24T18:54:02.949257+00:00",
    "distance": 46.15,
    "duration": 72,
    "riskScore": 85.53
},
{
    "tripId": "3dd3059f-1e8c-4385-ab75-1602abb2784c",
    "userId": "06844306-850c-4e1c-9013-8ffff22788bd",
    "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
    "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
    "startTime": "2024-06-20T21:44:13.089483+00:00",
    "endTime": "2024-06-20T22:38:13.089483+00:00",
    "distance": 20.22,
    "duration": 54,
    "riskScore": 42.57
},
{
    "tripId": "b1b14662-882f-4bc1-8241-0477ef597bcc",
    "userId": "06844306-850c-4e1c-9013-8ffff22788bd",
    "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
    "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
    "startTime": "2024-03-13T05:16:23.547136+00:00",
    "endTime": "2024-03-13T05:36:23.547136+00:00",
    "distance": 38.93,
    "duration": 20,
    "riskScore": 48.07
},
{
    "tripId": "66aafc9b-04a8-4ca3-bf04-e679602b3498",
    "userId": "06844306-850c-4e1c-9013-8ffff22788bd",
    "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
    "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
    "startTime": "2024-06-24T04:32:06.368429+00:00",
    "endTime": "2024-06-24T06:25:06.368429+00:00",
    "distance": 28.07,
    "duration": 113,
    "riskScore": 44.35
},
{
    "tripId": "b02d35a7-d0ce-43ae-9f19-1861ca93b3b8",
    "userId": "06844306-850c-4e1c-9013-8ffff22788bd",
    "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
    "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
    "startTime": "2024-02-01T17:54:13.513451+00:00",
    "endTime": "2024-02-01T19:34:13.513451+00:00",
    "distance": 10.79,
    "duration": 100,
    "riskScore": 57.33
},
{
    "tripId": "6038d3e4-88fc-4294-8d63-b236db688e95",
    "userId": "06844306-850c-4e1c-9013-8ffff22788bd",
    "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
    "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
    "startTime": "2024-03-23T18:47:33.312024+00:00",
    "endTime": "2024-03-23T20:22:33.312024+00:00",
    "distance": 9.14,
    "duration": 95,
    "riskScore": 55.32
},
{
    "tripId": "58f2a92b-ec57-4c11-8b4d-1af6f78061e4",
    "userId": "06844306-850c-4e1c-9013-8ffff22788bd",
    "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
    "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
    "startTime": "2024-01-22T22:58:06.432645+00:00",
    "endTime": "2024-01-23T00:13:06.432645+00:00",
    "distance": 44.04,
    "duration": 75,
    "riskScore": .89
},
]

export function UserTripDialog({ user }: { user: User}) {

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
                  <span className="truncate">{"Southern Sun Cape Sun"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Locate className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="font-medium block">Destination</span>
                  <span className="truncate">{"The Bantry Bay Aparthotel"}</span>
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