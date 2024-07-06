import * as React from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Car } from "@/types/car"
import { User } from "@/types/user"
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { DialogClose } from "@radix-ui/react-dialog";
import { CarIcon } from "lucide-react";

export function UserCarDialog({ user, car }: { user: User; car: Car }) {
    return (
    <Dialog>
      <DialogTrigger asChild>
        <span>View Car Details</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex items-center gap-4">
          <CarIcon className="h-8 w-8 text-muted-foreground" />
          <DialogTitle>{user.name}'s Car Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-[auto_1fr] items-center gap-4">
            <div className="grid gap-1">
              <p className="text-lg font-medium">{car.year} {car.make} {car.model}</p>
              <p className="text-muted-foreground">
                <span className="font-medium">Make:</span> {car.make}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Model:</span> {car.model}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Year:</span> {car.year}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}