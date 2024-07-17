"use client"

import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
  CarFront,
  Car,
  TriangleAlert,
  MapPin

} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ThemeToggle } from "@/components/theme-toggle"
import { OverviewIncident } from "@/components/overview-incident-chart"
import { useEffect, useState } from "react"
import {
  fetchAverageRiskScore,
  fetchTotalIncidents,
  fetchTotalTripsPerMonth,
  fetchTotalTrips,
  fetchAndSubscribeToIncidents,
} from "@/lib/supabase"


export default function Dashboard() {
  const [totalTrips, setTotalTrips] = useState(0);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [averageRiskScore, setAverageRiskScore] = useState(0);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [totalTripsPerMonth, setTotalTripsPerMonth] = useState([]);

  console.log(totalTripsPerMonth);  
  useEffect(() => {
    async function fetchData() {
      setTotalTrips(await fetchTotalTrips());
      setTotalIncidents(await fetchTotalIncidents());
      setAverageRiskScore(await fetchAverageRiskScore());
      setTotalTripsPerMonth(await fetchTotalTripsPerMonth());
    }
    fetchData();
    fetchAndSubscribeToIncidents(setRecentIncidents);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Trips
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTrips}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <TriangleAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalIncidents}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRiskScore}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Areas</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card
            className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Incidents</CardTitle>
                <CardDescription>
                  Showing recent incidents
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {recentIncidents.map((incident) => {
                    let index = incident.address.indexOf(',', incident.address.indexOf(',') + 1);
                    let cutAddress = incident.address.substring(0, index).trim();
                    let date = new Date(incident.timestamp);

                    let hours = date.getHours();
                    let minutes = date.getMinutes();

                    // Format hours and minutes (add leading zeros if necessary)
                    let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

                        return (
                          <TableRow key={incident.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <TriangleAlert className="h-4 w-4 text-muted-foreground" />
                                <div>{incident.type}</div>
                              </div>
                            </TableCell>
                            <TableCell>{cutAddress}</TableCell> {/* Render the modified address */}
                            <TableCell>{date.toLocaleDateString()}</TableCell>
                            <TableCell>{formattedTime}</TableCell>
                          </TableRow>
                        );
                  })}

                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <OverviewIncident />
        </div>
      </main>
    </div>
  )
}




