"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/types/user"
import { UserCarDialog } from "@/components/user-car-dialog"

// Sample user data
const data: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    age: 28,
    avgTripDistance: 15.2,
    avgRiskScore: 3.5,
    totalRiskScore: 70,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    age: 32,
    avgTripDistance: 20.4,
    avgRiskScore: 2.9,
    totalRiskScore: 58,
  },
    {
        id: "3",
        name: "Alice Johnson",
        email: "",
        age: 25,
        avgTripDistance: 12.1,
        avgRiskScore: 4.2,
        totalRiskScore: 84,
    },
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        age: 28,
        avgTripDistance: 15.2,
        avgRiskScore: 3.5,
        totalRiskScore: 70,
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        age: 32,
        avgTripDistance: 20.4,
        avgRiskScore: 2.9,
        totalRiskScore: 58,
      },
        {
            id: "3",
            name: "Alice Johnson",
            email: "",
            age: 25,
            avgTripDistance: 12.1,
            avgRiskScore: 4.2,
            totalRiskScore: 84,
        },
        {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            age: 28,
            avgTripDistance: 15.2,
            avgRiskScore: 3.5,
            totalRiskScore: 70,
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            age: 32,
            avgTripDistance: 20.4,
            avgRiskScore: 2.9,
            totalRiskScore: 58,
          },
            {
                id: "3",
                name: "Alice Johnson",
                email: "",
                age: 25,
                avgTripDistance: 12.1,
                avgRiskScore: 4.2,
                totalRiskScore: 84,
            },
            {
                id: "1",
                name: "John Doe",
                email: "john.doe@example.com",
                age: 28,
                avgTripDistance: 15.2,
                avgRiskScore: 3.5,
                totalRiskScore: 70,
              },
              {
                id: "2",
                name: "Jane Smith",
                email: "jane.smith@example.com",
                age: 32,
                avgTripDistance: 20.4,
                avgRiskScore: 2.9,
                totalRiskScore: 58,
              },
                {
                    id: "3",
                    name: "Alice Johnson",
                    email: "",
                    age: 25,
                    avgTripDistance: 12.1,
                    avgRiskScore: 4.2,
                    totalRiskScore: 84,
                },
                            

]


export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",

    header: "User ID",
    cell: ({ row }) => (
      <div>{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
      const age = row.getValue("age")
      return <div className="text-center font-medium">{age}</div>
    },
  },
  {
    accessorKey: "avgTripDistance",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Avg Trip Distance (km)
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
      const avgTripDistance = row.getValue("avgTripDistance")
      return <div className="text-center font-medium">{avgTripDistance.toFixed(2)}</div>
    },
  },
  {
    accessorKey: "avgRiskScore",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Avg Risk Score
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
      const avgRiskScore = row.getValue("avgRiskScore")
      return <div className="text-center font-medium">{avgRiskScore.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "totalRiskScore",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Risk Score
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
      const totalRiskScore = row.getValue("totalRiskScore")
      return <div className="text-center font-medium">{totalRiskScore}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <UserCarDialog user={user} car={
                    {
                        make: "Toyota",
                        model: "Corolla",
                        year: 2019,
                    }
                } />
            </DropdownMenuItem>
            <DropdownMenuItem>View Trips</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-11/12 mx-auto">
      <div className="flex items-center py-4">
      <Input
          placeholder="Search by name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}




