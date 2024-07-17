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
import { UserTripDialog } from "@/components/user-trip-dialog"
import { Trip } from "@/types/trip"
import { fetchAllTrips, fetchTripsByUserId, fetchUsers } from "@/lib/supabase"
import { useEffect, useState } from "react"

const data = [
  {
      "userId": "06844306-850c-4e1c-9013-8ffff22788bd",
      "name": "Alan Cline",
      "email": "alancline@gmail.com",
      "carMake": "Toyota",
      "carModel": "Corolla",
      "carYear": 1975
  },
  {
      "userId": "35082fbf-7a98-4899-962c-475054623842",
      "name": "Alexander Brown",
      "email": "alexanderbrown@hotmail.com",
      "carMake": "Mercedes",
      "carModel": "E-Class",
      "carYear": 1978
  },
  {
      "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
      "name": "Kevin Larson",
      "email": "kevinlarson@gmail.com",
      "carMake": "BMW",
      "carModel": "3 Series",
      "carYear": 1990
  },
  {
      "userId": "9d93ff9b-e6d2-4e56-9516-981c95562740",
      "name": "Whitney Miller",
      "email": "whitneymiller@yahoo.com",
      "carMake": "Volkswagen",
      "carModel": "Polo",
      "carYear": 2000
  },
  {
      "userId": "5e6181c2-38fa-40e6-b052-f0cdce33d7ae",
      "name": "James Kaiser",
      "email": "jameskaiser@gmail.com",
      "carMake": "Mercedes",
      "carModel": "E-Class",
      "carYear": 1999
  },
  {
      "userId": "df647e30-8ed8-4b86-99d6-bff76900b70d",
      "name": "Jeffrey Howard",
      "email": "jeffreyhoward@yahoo.com",
      "carMake": "Mercedes",
      "carModel": "GLA",
      "carYear": 1986
  },
  {
      "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
      "name": "Misty Chang",
      "email": "mistychang@yahoo.com",
      "carMake": "Toyota",
      "carModel": "RAV4",
      "carYear": 1989
  },
  {
      "userId": "2df38d1a-28ed-4c06-a441-d8f592a54b99",
      "name": "Ana Castillo",
      "email": "anacastillo@hotmail.com",
      "carMake": "Ford",
      "carModel": "Focus",
      "carYear": 2021
  },
  {
      "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
      "name": "Anita Potter",
      "email": "anitapotter@gmail.com",
      "carMake": "Toyota",
      "carModel": "Fortuner",
      "carYear": 1976
  },
  {
      "userId": "3705830f-1bae-4021-831e-069cf3d0f640",
      "name": "Michael Turner",
      "email": "michaelturner@hotmail.com",
      "carMake": "Toyota",
      "carModel": "RAV4",
      "carYear": 1978
  },
  {
      "userId": "93ae18b5-a9ff-44f0-854e-a2caf146b6de",
      "name": "Roger Duran",
      "email": "rogerduran@hotmail.com",
      "carMake": "Ford",
      "carModel": "Focus",
      "carYear": 1971
  },
  {
      "userId": "d7507210-be2c-4b25-a8c3-c3f507921d75",
      "name": "Christine Fox",
      "email": "christinefox@hotmail.com",
      "carMake": "Toyota",
      "carModel": "RAV4",
      "carYear": 2019
  },
  {
      "userId": "5c20b954-5ec4-49c4-993c-456a73f43c36",
      "name": "Meghan Roberts",
      "email": "meghanroberts@yahoo.com",
      "carMake": "Ford",
      "carModel": "Focus",
      "carYear": 2020
  },
  {
      "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
      "name": "Kyle Case",
      "email": "kylecase@yahoo.com",
      "carMake": "BMW",
      "carModel": "3 Series",
      "carYear": 2020
  },
  {
      "userId": "a5a53dd2-a4de-4655-9587-beee3e1a90e3",
      "name": "Cameron Hale DVM",
      "email": "cameronhaledvm@gmail.com",
      "carMake": "Volkswagen",
      "carModel": "Polo",
      "carYear": 1985
  },
  {
      "userId": "80504f10-b8ca-45bd-a4ab-d0fbcd0309f2",
      "name": "Jeffery Cowan",
      "email": "jefferycowan@yahoo.com",
      "carMake": "Toyota",
      "carModel": "Corolla",
      "carYear": 1980
  },
  {
      "userId": "e91651c8-e2d1-49df-bc29-eaab4266a36a",
      "name": "Alexander Mathews",
      "email": "alexandermathews@gmail.com",
      "carMake": "Mercedes",
      "carModel": "E-Class",
      "carYear": 1994
  },
  {
      "userId": "8f331419-2d22-43d6-b0fe-98262d6d51b2",
      "name": "Janice Walker",
      "email": "janicewalker@hotmail.com",
      "carMake": "Volkswagen",
      "carModel": "Golf",
      "carYear": 2005
  },
  {
      "userId": "0dce1675-c589-4c1e-a4b6-4fc6f0ba5091",
      "name": "Stacey Ingram",
      "email": "staceyingram@gmail.com",
      "carMake": "Mercedes",
      "carModel": "GLA",
      "carYear": 2002
  },
  {
      "userId": "6979a93f-2eb8-43cd-87ed-a654f6a1c490",
      "name": "Stacey Brown",
      "email": "staceybrown@yahoo.com",
      "carMake": "Toyota",
      "carModel": "Fortuner",
      "carYear": 2018
  },
  {
      "userId": "cfafd9c0-ec35-43d2-8c96-32515bd279d5",
      "name": "Kyle Mullins",
      "email": "kylemullins@hotmail.com",
      "carMake": "Volkswagen",
      "carModel": "Passat",
      "carYear": 2003
  },
  {
      "userId": "4f23bbe6-cb55-4981-9c41-07a4dabc54f7",
      "name": "Aaron Vaughan",
      "email": "aaronvaughan@gmail.com",
      "carMake": "Toyota",
      "carModel": "Corolla",
      "carYear": 2003
  },
  {
      "userId": "e188ec1c-ed06-4f55-891f-9c1dfe2522cd",
      "name": "Sandra Guzman",
      "email": "sandraguzman@hotmail.com",
      "carMake": "Ford",
      "carModel": "Focus",
      "carYear": 2023
  },
  {
      "userId": "93dafc9c-f2ac-4d23-88ee-cfdf560e5403",
      "name": "John Weaver",
      "email": "johnweaver@yahoo.com",
      "carMake": "Ford",
      "carModel": "Focus",
      "carYear": 2022
  },
  {
      "userId": "c8a6f342-b198-4bd1-81be-7ef56fef4510",
      "name": "Joseph Stanley",
      "email": "josephstanley@yahoo.com",
      "carMake": "Volkswagen",
      "carModel": "Polo",
      "carYear": 1982
  },
  {
      "userId": "888708ec-954e-49c2-adfa-00ac2ee504cd",
      "name": "David Morris",
      "email": "davidmorris@hotmail.com",
      "carMake": "Ford",
      "carModel": "Focus",
      "carYear": 1995
  },
  {
      "userId": "40db692b-08b7-4558-808f-441467fbba4c",
      "name": "Jennifer Cameron",
      "email": "jennifercameron@hotmail.com",
      "carMake": "Volkswagen",
      "carModel": "Passat",
      "carYear": 1974
  },
  {
      "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
      "name": "Danielle Campbell",
      "email": "daniellecampbell@gmail.com",
      "carMake": "BMW",
      "carModel": "X5",
      "carYear": 1990
  },
  {
      "userId": "f8981be0-ba21-4d1c-a480-910a724d48fd",
      "name": "Morgan Jackson",
      "email": "morganjackson@yahoo.com",
      "carMake": "Mercedes",
      "carModel": "C-Class",
      "carYear": 1995
  },
  {
      "userId": "bed9e7c8-dec3-4a2a-8220-cf8d5ea21ffd",
      "name": "James Johnson",
      "email": "jamesjohnson@gmail.com",
      "carMake": "Volkswagen",
      "carModel": "Passat",
      "carYear": 1971
  },
  {
      "userId": "27760b16-dd1a-4653-9c83-be59d2e1b20a",
      "name": "Matthew Ferrell",
      "email": "matthewferrell@hotmail.com",
      "carMake": "Ford",
      "carModel": "Focus",
      "carYear": 1999
  },
  {
      "userId": "1c62e6a5-12a7-4028-8ba4-560c565d9052",
      "name": "Dana Moore",
      "email": "danamoore@hotmail.com",
      "carMake": "Ford",
      "carModel": "Fiesta",
      "carYear": 2022
  },
  {
      "userId": "37e808bb-8f47-4a64-bb96-84a3df7b4550",
      "name": "Victor Phillips",
      "email": "victorphillips@yahoo.com",
      "carMake": "Volkswagen",
      "carModel": "Tiguan",
      "carYear": 2017
  },
  {
      "userId": "c9864a17-ffa9-444f-ab2b-811da8ac6f83",
      "name": "Thomas Harrison",
      "email": "thomasharrison@yahoo.com",
      "carMake": "Toyota",
      "carModel": "Fortuner",
      "carYear": 1984
  },
  {
      "userId": "38a9d17b-8ffc-4c56-a5dc-095275184bed",
      "name": "Zachary Allen",
      "email": "zacharyallen@yahoo.com",
      "carMake": "Mercedes",
      "carModel": "E-Class",
      "carYear": 2019
  },
  {
      "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
      "name": "James Perkins",
      "email": "jamesperkins@yahoo.com",
      "carMake": "Ford",
      "carModel": "Fiesta",
      "carYear": 1976
  },
  {
      "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
      "name": "Steven Avery",
      "email": "stevenavery@hotmail.com",
      "carMake": "Mercedes",
      "carModel": "GLA",
      "carYear": 2023
  },
  {
      "userId": "2ebb4a64-4af8-47de-9d5c-8b0e95461457",
      "name": "Kathryn Spencer",
      "email": "kathrynspencer@yahoo.com",
      "carMake": "Mercedes",
      "carModel": "E-Class",
      "carYear": 2019
  },
  {
      "userId": "8e2f7343-2b80-4dc7-ac78-c6ec00d11e9b",
      "name": "Kelly Wilson",
      "email": "kellywilson@gmail.com",
      "carMake": "Ford",
      "carModel": "Fiesta",
      "carYear": 2009
  },
  {
      "userId": "c1b40588-1749-48e4-886a-82e126311f13",
      "name": "Edward Clark",
      "email": "edwardclark@hotmail.com",
      "carMake": "Volkswagen",
      "carModel": "Passat",
      "carYear": 1999
  },
  {
      "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
      "name": "Elijah Park",
      "email": "elijahpark@hotmail.com",
      "carMake": "Toyota",
      "carModel": "Corolla",
      "carYear": 1995
  },
  {
      "userId": "3608b5e9-7436-459f-83ae-21c345741c7c",
      "name": "Jennifer Johnson",
      "email": "jenniferjohnson@yahoo.com",
      "carMake": "Toyota",
      "carModel": "RAV4",
      "carYear": 2016
  },
  {
      "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
      "name": "Alex Lopez",
      "email": "alexlopez@hotmail.com",
      "carMake": "BMW",
      "carModel": "X5",
      "carYear": 2016
  },
  {
      "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
      "name": "Anthony Miller",
      "email": "anthonymiller@gmail.com",
      "carMake": "Ford",
      "carModel": "Fiesta",
      "carYear": 1973
  },
  {
      "userId": "fc03d54c-c125-4f57-8719-b14b7743d4df",
      "name": "Laura Kane",
      "email": "laurakane@gmail.com",
      "carMake": "BMW",
      "carModel": "3 Series",
      "carYear": 1971
  },
  {
      "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
      "name": "Stephanie Powell",
      "email": "stephaniepowell@hotmail.com",
      "carMake": "Ford",
      "carModel": "Fiesta",
      "carYear": 1984
  },
  {
      "userId": "d4c938b6-b4ff-47cc-ad41-0ba38e99bbc3",
      "name": "Mark Rodgers",
      "email": "markrodgers@hotmail.com",
      "carMake": "Mercedes",
      "carModel": "GLA",
      "carYear": 1977
  },
  {
      "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
      "name": "Robert Huber",
      "email": "roberthuber@gmail.com",
      "carMake": "Ford",
      "carModel": "Fiesta",
      "carYear": 2021
  },
  {
      "userId": "da1e5574-6b5f-4bfd-84fe-eb45971fd267",
      "name": "Mary Scott",
      "email": "maryscott@gmail.com",
      "carMake": "Ford",
      "carModel": "Focus",
      "carYear": 2010
  },
  {
      "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
      "name": "Jennifer Holmes",
      "email": "jenniferholmes@hotmail.com",
      "carMake": "Mercedes",
      "carModel": "GLA",
      "carYear": 2020
  }
]

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
        "riskScore": 43.74
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
        "riskScore": 55.53
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
        "riskScore": 60.89
    },
    {
        "tripId": "5bbef3f7-3277-4478-8e7a-505b1d52ae18",
        "userId": "35082fbf-7a98-4899-962c-475054623842",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-03-15T13:58:43.363675+00:00",
        "endTime": "2024-03-15T15:01:43.363675+00:00",
        "distance": 40.24,
        "duration": 63,
        "riskScore": 42.41
    },
    {
        "tripId": "d8a3d70f-c703-4df1-9ac2-d2bed6e816af",
        "userId": "35082fbf-7a98-4899-962c-475054623842",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-06-05T17:49:01.888762+00:00",
        "endTime": "2024-06-05T18:11:01.888762+00:00",
        "distance": 11.79,
        "duration": 22,
        "riskScore": 59.53
    },
    {
        "tripId": "1d415d56-23e0-48c6-b1f7-2bb7dbf0ac58",
        "userId": "35082fbf-7a98-4899-962c-475054623842",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-03-05T23:29:05.616093+00:00",
        "endTime": "2024-03-06T01:21:05.616093+00:00",
        "distance": 7.34,
        "duration": 112,
        "riskScore": 53.63
    },
    {
        "tripId": "ad13671c-eafb-4947-8bf4-d1c7e8d2c143",
        "userId": "35082fbf-7a98-4899-962c-475054623842",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-06-28T12:53:49.111685+00:00",
        "endTime": "2024-06-28T13:08:49.111685+00:00",
        "distance": 1.33,
        "duration": 15,
        "riskScore": 61.79
    },
    {
        "tripId": "9f533be4-d4ed-4e75-8371-3279bda0d6cd",
        "userId": "35082fbf-7a98-4899-962c-475054623842",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-05-02T08:36:02.354069+00:00",
        "endTime": "2024-05-02T08:54:02.354069+00:00",
        "distance": 33.46,
        "duration": 18,
        "riskScore": 57.93
    },
    {
        "tripId": "a63c8150-1ba9-436e-9546-4c8b8f4bc699",
        "userId": "35082fbf-7a98-4899-962c-475054623842",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-06-09T20:57:41.841087+00:00",
        "endTime": "2024-06-09T21:43:41.841087+00:00",
        "distance": 20,
        "duration": 46,
        "riskScore": 50.65
    },
    {
        "tripId": "08fafaad-de11-442e-b53c-7e8e17583c76",
        "userId": "35082fbf-7a98-4899-962c-475054623842",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-02T21:33:49.550715+00:00",
        "endTime": "2024-06-02T23:13:49.550715+00:00",
        "distance": 30.31,
        "duration": 100,
        "riskScore": 45.48
    },
    {
        "tripId": "2fbfe998-803c-49b0-9f0a-d791d92ff8e2",
        "userId": "35082fbf-7a98-4899-962c-475054623842",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-05-05T08:13:11.096452+00:00",
        "endTime": "2024-05-05T09:33:11.096452+00:00",
        "distance": 18.74,
        "duration": 80,
        "riskScore": 65.95
    },
    {
        "tripId": "346e0fc9-ca67-4016-bb12-db0ca210adea",
        "userId": "35082fbf-7a98-4899-962c-475054623842",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-03-31T07:24:55.593495+00:00",
        "endTime": "2024-03-31T07:47:55.593495+00:00",
        "distance": 3.86,
        "duration": 23,
        "riskScore": 65.69
    },
    {
        "tripId": "32adf42e-8659-4996-936f-76a3dc8e76f8",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-01-16T10:04:33.674467+00:00",
        "endTime": "2024-01-16T10:20:33.674467+00:00",
        "distance": 30.13,
        "duration": 16,
        "riskScore": 54.06
    },
    {
        "tripId": "e05b0b9d-c56a-4fa2-ad0a-78320d1f24a4",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-01-18T12:18:27.488532+00:00",
        "endTime": "2024-01-18T13:24:27.488532+00:00",
        "distance": 46.67,
        "duration": 66,
        "riskScore": 47.68
    },
    {
        "tripId": "c9463483-b43b-4f06-829e-a10dc33b211b",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-19T19:24:25.135675+00:00",
        "endTime": "2024-01-19T20:50:25.135675+00:00",
        "distance": 40.24,
        "duration": 86,
        "riskScore": 53.23
    },
    {
        "tripId": "ed60b7e6-b825-4f2f-99f7-a935bb037302",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-01-19T02:25:27.480689+00:00",
        "endTime": "2024-01-19T03:14:27.480689+00:00",
        "distance": 17.02,
        "duration": 49,
        "riskScore": 67.81
    },
    {
        "tripId": "bbac2ba9-f440-4eb6-af69-433527f4a2f4",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-07-01T23:20:37.250613+00:00",
        "endTime": "2024-07-01T23:56:37.250613+00:00",
        "distance": 46.52,
        "duration": 36,
        "riskScore": 59.34
    },
    {
        "tripId": "e21603e2-c0cb-4019-ba67-2370f3e83fd1",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-02-07T07:25:34.313892+00:00",
        "endTime": "2024-02-07T09:06:34.313892+00:00",
        "distance": 24.84,
        "duration": 101,
        "riskScore": 64.02
    },
    {
        "tripId": "add91fc3-a907-4b0b-9d83-6963cc456c79",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-05-25T15:42:32.489631+00:00",
        "endTime": "2024-05-25T16:02:32.489631+00:00",
        "distance": 22.11,
        "duration": 20,
        "riskScore": 46.03
    },
    {
        "tripId": "33250ede-882b-4074-accc-cf4c91958a97",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-02-10T21:47:15.176156+00:00",
        "endTime": "2024-02-10T23:40:15.176156+00:00",
        "distance": 10.45,
        "duration": 113,
        "riskScore": 57.6
    },
    {
        "tripId": "25e7344f-2923-4c98-8557-6ba4cf71a924",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-01-14T07:20:11.434909+00:00",
        "endTime": "2024-01-14T08:13:11.434909+00:00",
        "distance": 8.27,
        "duration": 53,
        "riskScore": 64.5
    },
    {
        "tripId": "909be946-0cdd-4974-918c-252e63cb7809",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-04-07T05:35:49.80989+00:00",
        "endTime": "2024-04-07T06:52:49.80989+00:00",
        "distance": 4.39,
        "duration": 77,
        "riskScore": 57.78
    },
    {
        "tripId": "e46140c1-f50e-4279-b394-bccf4a10c253",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-03-19T08:41:59.05125+00:00",
        "endTime": "2024-03-19T10:29:59.05125+00:00",
        "distance": 9.71,
        "duration": 108,
        "riskScore": 67.11
    },
    {
        "tripId": "398d287c-c17f-4b2d-a576-5c3f64550369",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-02-18T09:56:49.610313+00:00",
        "endTime": "2024-02-18T10:51:49.610313+00:00",
        "distance": 23.58,
        "duration": 55,
        "riskScore": 53.77
    },
    {
        "tripId": "3b8be42f-3710-4037-80fc-7e5db680b096",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-10T20:26:34.910986+00:00",
        "endTime": "2024-01-10T20:47:34.910986+00:00",
        "distance": 18.51,
        "duration": 21,
        "riskScore": 69.67
    },
    {
        "tripId": "95fb697e-7256-4764-bce9-999fb4a4f942",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-03-05T13:24:06.965657+00:00",
        "endTime": "2024-03-05T14:44:06.965657+00:00",
        "distance": 25.25,
        "duration": 80,
        "riskScore": 67.1
    },
    {
        "tripId": "647eb3d2-b981-41f1-980c-21249b65e4c2",
        "userId": "69d40d74-48c7-40f9-9b30-295fd83f5045",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-05-20T23:53:50.131542+00:00",
        "endTime": "2024-05-21T00:57:50.131542+00:00",
        "distance": 8.64,
        "duration": 64,
        "riskScore": 58.66
    },
    {
        "tripId": "2b889d12-76a9-4c62-829b-2551dc674a03",
        "userId": "9d93ff9b-e6d2-4e56-9516-981c95562740",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-01-27T01:17:08.414352+00:00",
        "endTime": "2024-01-27T02:51:08.414352+00:00",
        "distance": 19.91,
        "duration": 94,
        "riskScore": 64.98
    },
    {
        "tripId": "b412497d-7b4b-40bb-a11a-f510fe033ce8",
        "userId": "9d93ff9b-e6d2-4e56-9516-981c95562740",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-29T02:02:23.691191+00:00",
        "endTime": "2024-01-29T03:53:23.691191+00:00",
        "distance": 18.46,
        "duration": 111,
        "riskScore": 41.04
    },
    {
        "tripId": "498a8772-f860-41c0-a5f7-7f67ea06a7c1",
        "userId": "9d93ff9b-e6d2-4e56-9516-981c95562740",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-06-15T00:08:41.899993+00:00",
        "endTime": "2024-06-15T02:01:41.899993+00:00",
        "distance": 21.45,
        "duration": 113,
        "riskScore": 45.34
    },
    {
        "tripId": "e875d800-a143-451c-9041-0a3f02eb51d7",
        "userId": "9d93ff9b-e6d2-4e56-9516-981c95562740",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-03-05T02:09:32.171978+00:00",
        "endTime": "2024-03-05T03:06:32.171978+00:00",
        "distance": 21.55,
        "duration": 57,
        "riskScore": 67.87
    },
    {
        "tripId": "60658e28-5654-4a41-a32b-beec53dfcc4b",
        "userId": "9d93ff9b-e6d2-4e56-9516-981c95562740",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-01-19T06:44:36.94754+00:00",
        "endTime": "2024-01-19T07:44:36.94754+00:00",
        "distance": 15.44,
        "duration": 60,
        "riskScore": 65.22
    },
    {
        "tripId": "7066e8ca-a39c-4cb1-8a88-16201ba89361",
        "userId": "9d93ff9b-e6d2-4e56-9516-981c95562740",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-06-29T06:36:23.311168+00:00",
        "endTime": "2024-06-29T07:50:23.311168+00:00",
        "distance": 36.58,
        "duration": 74,
        "riskScore": 50.54
    },
    {
        "tripId": "58785555-db7d-46a3-8fb0-98ccb3a79c80",
        "userId": "9d93ff9b-e6d2-4e56-9516-981c95562740",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-02-12T09:50:27.905589+00:00",
        "endTime": "2024-02-12T11:15:27.905589+00:00",
        "distance": 42.87,
        "duration": 85,
        "riskScore": 68.76
    },
    {
        "tripId": "3187968b-9442-4649-bc32-a2af5d53ab81",
        "userId": "9d93ff9b-e6d2-4e56-9516-981c95562740",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-04T09:24:02.915135+00:00",
        "endTime": "2024-06-04T09:45:02.915135+00:00",
        "distance": 14.74,
        "duration": 21,
        "riskScore": 45.45
    },
    {
        "tripId": "3ea5e1d3-3fdf-4262-beb2-683f917207ce",
        "userId": "5e6181c2-38fa-40e6-b052-f0cdce33d7ae",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-03-10T09:19:20.389808+00:00",
        "endTime": "2024-03-10T10:48:20.389808+00:00",
        "distance": 8.77,
        "duration": 89,
        "riskScore": 54.78
    },
    {
        "tripId": "7c8e75c1-e966-4d10-a10c-5526c81263ac",
        "userId": "5e6181c2-38fa-40e6-b052-f0cdce33d7ae",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-04-12T03:09:37.292003+00:00",
        "endTime": "2024-04-12T03:15:37.292003+00:00",
        "distance": 48.57,
        "duration": 6,
        "riskScore": 50.61
    },
    {
        "tripId": "2244873c-12f8-422a-8220-e080a40b43db",
        "userId": "df647e30-8ed8-4b86-99d6-bff76900b70d",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-02-16T04:20:44.705056+00:00",
        "endTime": "2024-02-16T04:52:44.705056+00:00",
        "distance": 38.68,
        "duration": 32,
        "riskScore": 56.13
    },
    {
        "tripId": "66dd9343-d13a-4574-810f-14b2537e1fd2",
        "userId": "df647e30-8ed8-4b86-99d6-bff76900b70d",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-01-04T12:05:22.983676+00:00",
        "endTime": "2024-01-04T13:24:22.983676+00:00",
        "distance": 20.29,
        "duration": 79,
        "riskScore": 63.85
    },
    {
        "tripId": "05c0d3f2-14e8-420a-b44c-37baae638ae3",
        "userId": "df647e30-8ed8-4b86-99d6-bff76900b70d",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-02-23T15:49:05.116802+00:00",
        "endTime": "2024-02-23T17:34:05.116802+00:00",
        "distance": 42.11,
        "duration": 105,
        "riskScore": 43.02
    },
    {
        "tripId": "28f736ba-f210-465e-afff-653a277787ed",
        "userId": "df647e30-8ed8-4b86-99d6-bff76900b70d",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-06-12T19:34:47.593654+00:00",
        "endTime": "2024-06-12T20:01:47.593654+00:00",
        "distance": 12.45,
        "duration": 27,
        "riskScore": 40.05
    },
    {
        "tripId": "82011684-2988-4d6d-9ccc-765c4acd1278",
        "userId": "df647e30-8ed8-4b86-99d6-bff76900b70d",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-06-08T04:42:16.442387+00:00",
        "endTime": "2024-06-08T06:06:16.442387+00:00",
        "distance": 27.47,
        "duration": 84,
        "riskScore": 54.36
    },
    {
        "tripId": "6eeec4f9-85fa-4913-a6f2-6bb495dcfaf0",
        "userId": "df647e30-8ed8-4b86-99d6-bff76900b70d",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-02-15T11:24:00.398167+00:00",
        "endTime": "2024-02-15T12:05:00.398167+00:00",
        "distance": 7.42,
        "duration": 41,
        "riskScore": 68.81
    },
    {
        "tripId": "9ff0b9f3-e423-4aad-b8a7-da8945a4f8a5",
        "userId": "df647e30-8ed8-4b86-99d6-bff76900b70d",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-03-23T09:01:38.699566+00:00",
        "endTime": "2024-03-23T10:14:38.699566+00:00",
        "distance": 18.69,
        "duration": 73,
        "riskScore": 56.63
    },
    {
        "tripId": "2b21efe0-89da-4dc6-8713-5dc8944349a6",
        "userId": "df647e30-8ed8-4b86-99d6-bff76900b70d",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-03-19T03:44:10.870505+00:00",
        "endTime": "2024-03-19T05:39:10.870505+00:00",
        "distance": 47.13,
        "duration": 115,
        "riskScore": 55.42
    },
    {
        "tripId": "459846e8-3557-4642-bd1f-ce8ab04fe2b4",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-14T23:07:44.299136+00:00",
        "endTime": "2024-06-14T23:15:44.299136+00:00",
        "distance": 10.88,
        "duration": 8,
        "riskScore": 40.03
    },
    {
        "tripId": "ee882e41-8b46-4b2a-938a-87bea8f303a9",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-03-20T07:08:41.334061+00:00",
        "endTime": "2024-03-20T07:15:41.334061+00:00",
        "distance": 10.84,
        "duration": 7,
        "riskScore": 57.73
    },
    {
        "tripId": "42458cf5-554a-45c2-ae9c-e025b163bd4c",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-04-24T16:55:44.709705+00:00",
        "endTime": "2024-04-24T18:01:44.709705+00:00",
        "distance": 12.87,
        "duration": 66,
        "riskScore": 40.42
    },
    {
        "tripId": "289f956f-149c-472d-a5e7-2ce180f37c83",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-04-01T08:29:54.683414+00:00",
        "endTime": "2024-04-01T09:24:54.683414+00:00",
        "distance": 14.36,
        "duration": 55,
        "riskScore": 55.13
    },
    {
        "tripId": "20fae5f7-5060-4379-bc1d-14f270e3def9",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-05-27T23:46:18.894739+00:00",
        "endTime": "2024-05-28T00:33:18.894739+00:00",
        "distance": 23.68,
        "duration": 47,
        "riskScore": 60.32
    },
    {
        "tripId": "605ceed6-3a86-48d8-bc25-3cd65ab9d7d8",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-05-08T08:33:32.188862+00:00",
        "endTime": "2024-05-08T10:07:32.188862+00:00",
        "distance": 5.52,
        "duration": 94,
        "riskScore": 65.96
    },
    {
        "tripId": "b1b28afd-36ae-4e3d-bc31-68408c5a9e65",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-02-13T09:29:09.49315+00:00",
        "endTime": "2024-02-13T11:19:09.49315+00:00",
        "distance": 21.53,
        "duration": 110,
        "riskScore": 55.44
    },
    {
        "tripId": "ea8b27dc-4d50-43bc-ad93-8072cae441ea",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-05-07T09:39:07.303175+00:00",
        "endTime": "2024-05-07T11:31:07.303175+00:00",
        "distance": 15.47,
        "duration": 112,
        "riskScore": 48.76
    },
    {
        "tripId": "9eec4b9e-498b-411e-a3a9-78372179d4ae",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-01-25T00:07:01.565187+00:00",
        "endTime": "2024-01-25T00:59:01.565187+00:00",
        "distance": 6.07,
        "duration": 52,
        "riskScore": 44.26
    },
    {
        "tripId": "58c59047-7ca0-4616-8185-fac1ee700812",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-01-06T13:08:17.478573+00:00",
        "endTime": "2024-01-06T13:33:17.478573+00:00",
        "distance": 26.15,
        "duration": 25,
        "riskScore": 55.23
    },
    {
        "tripId": "13acb0f7-74cc-4c5b-b527-876e815636fe",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-02-16T11:09:39.58834+00:00",
        "endTime": "2024-02-16T12:14:39.58834+00:00",
        "distance": 30.7,
        "duration": 65,
        "riskScore": 40.15
    },
    {
        "tripId": "d91ffe88-a3a7-44a7-ae18-d76999d5fe73",
        "userId": "65a97f6e-db91-4d40-9900-4bbfdb1bfdeb",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-04-06T11:03:01.972774+00:00",
        "endTime": "2024-04-06T11:51:01.972774+00:00",
        "distance": 40.09,
        "duration": 48,
        "riskScore": 48.88
    },
    {
        "tripId": "75a6757d-a492-440f-86e5-578f97a8e658",
        "userId": "2df38d1a-28ed-4c06-a441-d8f592a54b99",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-01-01T11:08:07.224857+00:00",
        "endTime": "2024-01-01T11:42:07.224857+00:00",
        "distance": 21.28,
        "duration": 34,
        "riskScore": 51.54
    },
    {
        "tripId": "a3b76f24-9870-4b4a-b53c-0841c0187054",
        "userId": "2df38d1a-28ed-4c06-a441-d8f592a54b99",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-02-11T10:40:24.232288+00:00",
        "endTime": "2024-02-11T11:42:24.232288+00:00",
        "distance": 15.63,
        "duration": 62,
        "riskScore": 62.83
    },
    {
        "tripId": "74451c2a-114b-40c9-afea-6dd9b2b33238",
        "userId": "2df38d1a-28ed-4c06-a441-d8f592a54b99",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-02-19T21:41:53.672543+00:00",
        "endTime": "2024-02-19T23:40:53.672543+00:00",
        "distance": 18.19,
        "duration": 119,
        "riskScore": 44.19
    },
    {
        "tripId": "e5cf0496-84b0-46ac-99c3-45115e4d48df",
        "userId": "2df38d1a-28ed-4c06-a441-d8f592a54b99",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-06-09T09:01:04.498524+00:00",
        "endTime": "2024-06-09T10:20:04.498524+00:00",
        "distance": 24.9,
        "duration": 79,
        "riskScore": 56.69
    },
    {
        "tripId": "bed5c993-469b-4dc0-b7aa-bffe939a7d66",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-07-05T11:35:39.504072+00:00",
        "endTime": "2024-07-05T12:35:39.504072+00:00",
        "distance": 45.74,
        "duration": 60,
        "riskScore": 69.42
    },
    {
        "tripId": "2b38d054-0b0d-44c7-ba86-eb6b5f826b2a",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-25T09:13:04.149133+00:00",
        "endTime": "2024-01-25T09:21:04.149133+00:00",
        "distance": 32.35,
        "duration": 8,
        "riskScore": 65.28
    },
    {
        "tripId": "1e919d58-0ded-45a0-a971-e1528856c58f",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-03-12T01:33:40.831252+00:00",
        "endTime": "2024-03-12T02:05:40.831252+00:00",
        "distance": 36.69,
        "duration": 32,
        "riskScore": 45.97
    },
    {
        "tripId": "b21259ff-e3e4-4399-a605-36d85594d208",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-07-04T00:33:20.752893+00:00",
        "endTime": "2024-07-04T02:12:20.752893+00:00",
        "distance": 9.24,
        "duration": 99,
        "riskScore": 41.65
    },
    {
        "tripId": "73d8f7d3-87e9-4996-9e0d-931d7d57248f",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-06-09T02:07:27.435222+00:00",
        "endTime": "2024-06-09T02:54:27.435222+00:00",
        "distance": 42.44,
        "duration": 47,
        "riskScore": 66.48
    },
    {
        "tripId": "d3caa1f9-c3f0-4612-8f59-941ce1547b43",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-06-07T17:39:38.990282+00:00",
        "endTime": "2024-06-07T18:01:38.990282+00:00",
        "distance": 32.95,
        "duration": 22,
        "riskScore": 67.91
    },
    {
        "tripId": "1aa3c70b-25b1-440a-87f2-55c1501ed9cf",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-02-03T20:15:47.923493+00:00",
        "endTime": "2024-02-03T21:05:47.923493+00:00",
        "distance": 28.13,
        "duration": 50,
        "riskScore": 54.42
    },
    {
        "tripId": "53c3cc7a-2c2c-4b7f-aa29-0405fe712148",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-06-30T23:25:00.545707+00:00",
        "endTime": "2024-07-01T01:11:00.545707+00:00",
        "distance": 28,
        "duration": 106,
        "riskScore": 62.64
    },
    {
        "tripId": "22b2c34e-c38c-422e-91e3-e500ebd87422",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-03-27T08:32:30.021883+00:00",
        "endTime": "2024-03-27T09:18:30.021883+00:00",
        "distance": 17.48,
        "duration": 46,
        "riskScore": 47.42
    },
    {
        "tripId": "cf5936fa-c539-481a-b243-c8eae3be24aa",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-02-15T16:04:38.258872+00:00",
        "endTime": "2024-02-15T17:10:38.258872+00:00",
        "distance": 41.91,
        "duration": 66,
        "riskScore": 47.03
    },
    {
        "tripId": "08be2952-3359-4e85-989f-c2dece060351",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-03T09:46:34.798955+00:00",
        "endTime": "2024-06-03T10:21:34.798955+00:00",
        "distance": 10.33,
        "duration": 35,
        "riskScore": 68.65
    },
    {
        "tripId": "5893bd10-3de0-4c08-9f69-0cc46d9378d6",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-02-25T05:55:08.290785+00:00",
        "endTime": "2024-02-25T07:32:08.290785+00:00",
        "distance": 4.08,
        "duration": 97,
        "riskScore": 42.88
    },
    {
        "tripId": "1b7a70d6-8f7d-4240-bdde-7649f4548778",
        "userId": "67420621-c489-47b1-9322-426c6cf9eb0b",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-07-02T04:32:01.032289+00:00",
        "endTime": "2024-07-02T05:22:01.032289+00:00",
        "distance": 23.69,
        "duration": 50,
        "riskScore": 45.33
    },
    {
        "tripId": "e2ba4d55-e377-47b9-a4ce-7e632a8771c9",
        "userId": "3705830f-1bae-4021-831e-069cf3d0f640",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-03-25T00:36:08.074826+00:00",
        "endTime": "2024-03-25T01:54:08.074826+00:00",
        "distance": 33.39,
        "duration": 78,
        "riskScore": 40.02
    },
    {
        "tripId": "2c3b1b62-4902-44f5-bbd1-ea3e2d185f18",
        "userId": "3705830f-1bae-4021-831e-069cf3d0f640",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-02-07T01:25:57.735261+00:00",
        "endTime": "2024-02-07T02:38:57.735261+00:00",
        "distance": 25.18,
        "duration": 73,
        "riskScore": 40.93
    },
    {
        "tripId": "20aaa53b-e2fc-42e9-a7b7-517f82f59f2a",
        "userId": "3705830f-1bae-4021-831e-069cf3d0f640",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-06-19T12:20:58.65991+00:00",
        "endTime": "2024-06-19T14:13:58.65991+00:00",
        "distance": 17.87,
        "duration": 113,
        "riskScore": 69.43
    },
    {
        "tripId": "f28c764e-dbe7-431d-b78d-22f741525355",
        "userId": "3705830f-1bae-4021-831e-069cf3d0f640",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-02-29T23:37:34.786725+00:00",
        "endTime": "2024-03-01T00:40:34.786725+00:00",
        "distance": 25.95,
        "duration": 63,
        "riskScore": 44.92
    },
    {
        "tripId": "1c4f3256-4dc3-4d2c-8e06-a581c4cceacb",
        "userId": "3705830f-1bae-4021-831e-069cf3d0f640",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-04-17T13:09:25.324647+00:00",
        "endTime": "2024-04-17T13:16:25.324647+00:00",
        "distance": 41.25,
        "duration": 7,
        "riskScore": 44.67
    },
    {
        "tripId": "84094549-0c11-41bc-b35b-842f60a3b8b7",
        "userId": "3705830f-1bae-4021-831e-069cf3d0f640",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-02-12T08:30:51.26608+00:00",
        "endTime": "2024-02-12T10:29:51.26608+00:00",
        "distance": 27.48,
        "duration": 119,
        "riskScore": 43.51
    },
    {
        "tripId": "9f9aaaa7-8add-4efa-ae87-ba4f97f911db",
        "userId": "93ae18b5-a9ff-44f0-854e-a2caf146b6de",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-02T18:03:45.515154+00:00",
        "endTime": "2024-01-02T18:51:45.515154+00:00",
        "distance": 8.55,
        "duration": 48,
        "riskScore": 49.36
    },
    {
        "tripId": "1ac78865-c2ec-4b20-8444-606e810830a7",
        "userId": "93ae18b5-a9ff-44f0-854e-a2caf146b6de",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-03-03T05:08:06.447492+00:00",
        "endTime": "2024-03-03T06:48:06.447492+00:00",
        "distance": 31.94,
        "duration": 100,
        "riskScore": 69.68
    },
    {
        "tripId": "3934ce92-5063-4bdc-b7e6-f499c57028ce",
        "userId": "93ae18b5-a9ff-44f0-854e-a2caf146b6de",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-06-25T08:51:57.732859+00:00",
        "endTime": "2024-06-25T10:41:57.732859+00:00",
        "distance": 6.94,
        "duration": 110,
        "riskScore": 59.66
    },
    {
        "tripId": "f71fa060-ded0-4125-8fd2-f2625f55edc7",
        "userId": "93ae18b5-a9ff-44f0-854e-a2caf146b6de",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-12T20:26:12.126863+00:00",
        "endTime": "2024-06-12T21:23:12.126863+00:00",
        "distance": 47.56,
        "duration": 57,
        "riskScore": 67.11
    },
    {
        "tripId": "f7206bc2-13a1-43a9-905a-ac4718f26d9d",
        "userId": "93ae18b5-a9ff-44f0-854e-a2caf146b6de",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-02-17T12:45:43.118829+00:00",
        "endTime": "2024-02-17T13:40:43.118829+00:00",
        "distance": 14.15,
        "duration": 55,
        "riskScore": 54.12
    },
    {
        "tripId": "2dc3b423-6f8f-4bbf-98ec-ef16dd922fdf",
        "userId": "93ae18b5-a9ff-44f0-854e-a2caf146b6de",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-08T07:18:43.05212+00:00",
        "endTime": "2024-06-08T07:59:43.05212+00:00",
        "distance": 11.14,
        "duration": 41,
        "riskScore": 60.32
    },
    {
        "tripId": "b3533053-62cb-4259-98d6-01c642474c5b",
        "userId": "93ae18b5-a9ff-44f0-854e-a2caf146b6de",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-03-05T17:17:18.678026+00:00",
        "endTime": "2024-03-05T18:16:18.678026+00:00",
        "distance": 19.41,
        "duration": 59,
        "riskScore": 61.98
    },
    {
        "tripId": "1f8fc594-f2b2-4d14-a2e2-bcc635a7cbba",
        "userId": "d7507210-be2c-4b25-a8c3-c3f507921d75",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-01-03T06:58:26.370556+00:00",
        "endTime": "2024-01-03T07:52:26.370556+00:00",
        "distance": 25.17,
        "duration": 54,
        "riskScore": 54.84
    },
    {
        "tripId": "62a87856-43e1-459e-81d6-c9e88b31935b",
        "userId": "d7507210-be2c-4b25-a8c3-c3f507921d75",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-13T02:57:40.317607+00:00",
        "endTime": "2024-06-13T04:45:40.317607+00:00",
        "distance": 8.77,
        "duration": 108,
        "riskScore": 61.38
    },
    {
        "tripId": "64a05b33-2bb0-487e-bf8c-6247da4b446d",
        "userId": "d7507210-be2c-4b25-a8c3-c3f507921d75",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-01T20:07:51.9884+00:00",
        "endTime": "2024-06-01T21:50:51.9884+00:00",
        "distance": 6.88,
        "duration": 103,
        "riskScore": 54.17
    },
    {
        "tripId": "4f77a72b-87e8-4f54-ada3-46770bfa6569",
        "userId": "d7507210-be2c-4b25-a8c3-c3f507921d75",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-04-14T05:31:08.223307+00:00",
        "endTime": "2024-04-14T06:25:08.223307+00:00",
        "distance": 5.06,
        "duration": 54,
        "riskScore": 61.24
    },
    {
        "tripId": "876218c0-defd-4ff4-9d55-c492476fb0df",
        "userId": "5c20b954-5ec4-49c4-993c-456a73f43c36",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-02-10T12:51:55.089913+00:00",
        "endTime": "2024-02-10T14:16:55.089913+00:00",
        "distance": 42.79,
        "duration": 85,
        "riskScore": 53.87
    },
    {
        "tripId": "01cc69f3-643b-4dc9-bf0c-65ec3760f68e",
        "userId": "5c20b954-5ec4-49c4-993c-456a73f43c36",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-05-24T00:09:11.284266+00:00",
        "endTime": "2024-05-24T00:47:11.284266+00:00",
        "distance": 23.66,
        "duration": 38,
        "riskScore": 56.81
    },
    {
        "tripId": "c67d919b-8600-470d-9a9f-b6306e3e7970",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-06-04T18:20:45.267432+00:00",
        "endTime": "2024-06-04T18:56:45.267432+00:00",
        "distance": 8.55,
        "duration": 36,
        "riskScore": 67.79
    },
    {
        "tripId": "8fda433b-b3eb-4dd5-a723-f1c1a0afeb95",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-01-15T13:33:08.607583+00:00",
        "endTime": "2024-01-15T15:18:08.607583+00:00",
        "distance": 1.66,
        "duration": 105,
        "riskScore": 68.77
    },
    {
        "tripId": "80897a07-ad73-4df1-87df-ca8f50ef89d9",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-06-11T01:09:23.505601+00:00",
        "endTime": "2024-06-11T01:16:23.505601+00:00",
        "distance": 17.19,
        "duration": 7,
        "riskScore": 46.41
    },
    {
        "tripId": "e2065c21-c3b4-4ab7-9884-6c27d97ffd0c",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-23T09:18:12.629193+00:00",
        "endTime": "2024-01-23T10:32:12.629193+00:00",
        "distance": 30.92,
        "duration": 74,
        "riskScore": 41.64
    },
    {
        "tripId": "9784798f-5768-403a-beac-7b2214595a97",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-02-21T03:24:45.676264+00:00",
        "endTime": "2024-02-21T05:21:45.676264+00:00",
        "distance": 18.84,
        "duration": 117,
        "riskScore": 61.08
    },
    {
        "tripId": "5f7848ff-576e-496c-b63d-1228d7b666c2",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-01-03T04:15:16.495999+00:00",
        "endTime": "2024-01-03T04:22:16.495999+00:00",
        "distance": 38.88,
        "duration": 7,
        "riskScore": 45.14
    },
    {
        "tripId": "3672b17a-3a97-4b20-a35b-5f813198ceed",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-02-02T03:12:13.471996+00:00",
        "endTime": "2024-02-02T04:06:13.471996+00:00",
        "distance": 19.37,
        "duration": 54,
        "riskScore": 51.97
    },
    {
        "tripId": "0a471ded-09d3-4d66-b784-e9e31fe19a3d",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-05-17T21:52:10.491206+00:00",
        "endTime": "2024-05-17T23:34:10.491206+00:00",
        "distance": 42.22,
        "duration": 102,
        "riskScore": 57.08
    },
    {
        "tripId": "03401736-eaf1-45b2-88ff-202b4a5ad9a4",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-05-14T14:01:27.650161+00:00",
        "endTime": "2024-05-14T14:11:27.650161+00:00",
        "distance": 30.47,
        "duration": 10,
        "riskScore": 61.77
    },
    {
        "tripId": "ac62e8a9-f4e9-4cc9-bc7d-44e97184be37",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-02-01T10:05:19.641219+00:00",
        "endTime": "2024-02-01T11:58:19.641219+00:00",
        "distance": 30.12,
        "duration": 113,
        "riskScore": 60.68
    },
    {
        "tripId": "4efa0555-6358-4cc9-95ce-d8e7233d2760",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-05-03T10:12:19.981558+00:00",
        "endTime": "2024-05-03T10:36:19.981558+00:00",
        "distance": 22.67,
        "duration": 24,
        "riskScore": 53.41
    },
    {
        "tripId": "2fbadb54-6712-4698-84c4-5ce50dba4568",
        "userId": "77d335a6-3a5c-4185-83b4-0d4a897fdf78",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-05-09T14:46:31.61741+00:00",
        "endTime": "2024-05-09T14:59:31.61741+00:00",
        "distance": 13.55,
        "duration": 13,
        "riskScore": 50.9
    },
    {
        "tripId": "aeb773c7-0c13-49a2-bbd9-b3dd291b3341",
        "userId": "a5a53dd2-a4de-4655-9587-beee3e1a90e3",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-05-13T00:19:58.825344+00:00",
        "endTime": "2024-05-13T01:22:58.825344+00:00",
        "distance": 31.37,
        "duration": 63,
        "riskScore": 56.86
    },
    {
        "tripId": "b40494ff-c463-4a06-b596-b4276cc8596c",
        "userId": "a5a53dd2-a4de-4655-9587-beee3e1a90e3",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-05-15T05:33:34.924227+00:00",
        "endTime": "2024-05-15T06:24:34.924227+00:00",
        "distance": 44.87,
        "duration": 51,
        "riskScore": 63.31
    },
    {
        "tripId": "0fb444cc-be83-402e-804d-ebcf22e72c1f",
        "userId": "a5a53dd2-a4de-4655-9587-beee3e1a90e3",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-06-16T10:42:48.133055+00:00",
        "endTime": "2024-06-16T11:53:48.133055+00:00",
        "distance": 8.77,
        "duration": 71,
        "riskScore": 66.43
    },
    {
        "tripId": "a775cc71-edf9-46ac-bfe0-ad9e12fffdfc",
        "userId": "a5a53dd2-a4de-4655-9587-beee3e1a90e3",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-03-23T00:34:24.153838+00:00",
        "endTime": "2024-03-23T02:05:24.153838+00:00",
        "distance": 9.16,
        "duration": 91,
        "riskScore": 50.61
    },
    {
        "tripId": "5a9547b6-d1c8-4a8a-839e-26f05db38872",
        "userId": "a5a53dd2-a4de-4655-9587-beee3e1a90e3",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-08T02:49:45.5248+00:00",
        "endTime": "2024-06-08T03:41:45.5248+00:00",
        "distance": 33.68,
        "duration": 52,
        "riskScore": 55.37
    },
    {
        "tripId": "757823f2-7ef5-4508-ae7d-6d803f8efd54",
        "userId": "a5a53dd2-a4de-4655-9587-beee3e1a90e3",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-03-14T03:48:34.489848+00:00",
        "endTime": "2024-03-14T04:51:34.489848+00:00",
        "distance": 45.27,
        "duration": 63,
        "riskScore": 44.78
    },
    {
        "tripId": "0f9c9903-d9c8-45f5-bfc3-946c0ff0f656",
        "userId": "a5a53dd2-a4de-4655-9587-beee3e1a90e3",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-02-19T09:11:17.761505+00:00",
        "endTime": "2024-02-19T09:16:17.761505+00:00",
        "distance": 49.17,
        "duration": 5,
        "riskScore": 61.34
    },
    {
        "tripId": "d65c83e0-1355-4f2b-8acd-af917da2e0c8",
        "userId": "8f331419-2d22-43d6-b0fe-98262d6d51b2",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-05-09T22:52:10.822597+00:00",
        "endTime": "2024-05-10T00:24:10.822597+00:00",
        "distance": 5.8,
        "duration": 92,
        "riskScore": 55.51
    },
    {
        "tripId": "a6b9a308-06d9-4514-984e-6a2f9790dc26",
        "userId": "a5a53dd2-a4de-4655-9587-beee3e1a90e3",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-06-26T15:17:12.400371+00:00",
        "endTime": "2024-06-26T17:03:12.400371+00:00",
        "distance": 5.88,
        "duration": 106,
        "riskScore": 54.96
    },
    {
        "tripId": "4640fb51-efa1-4b62-b1d2-ccd3cc9b5cb8",
        "userId": "a5a53dd2-a4de-4655-9587-beee3e1a90e3",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-02-14T01:35:29.160559+00:00",
        "endTime": "2024-02-14T02:13:29.160559+00:00",
        "distance": 21.74,
        "duration": 38,
        "riskScore": 62.83
    },
    {
        "tripId": "44d77ecc-799f-4fdf-a39a-834c7d6dea03",
        "userId": "80504f10-b8ca-45bd-a4ab-d0fbcd0309f2",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-03-16T19:50:30.180081+00:00",
        "endTime": "2024-03-16T20:46:30.180081+00:00",
        "distance": 43.62,
        "duration": 56,
        "riskScore": 49.17
    },
    {
        "tripId": "8f9b451a-aa94-4e3f-9cb2-4198846791db",
        "userId": "80504f10-b8ca-45bd-a4ab-d0fbcd0309f2",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-05-07T04:19:07.477587+00:00",
        "endTime": "2024-05-07T05:13:07.477587+00:00",
        "distance": 20.62,
        "duration": 54,
        "riskScore": 58.83
    },
    {
        "tripId": "388dfcde-c0fc-402a-b14d-84228e3f418c",
        "userId": "80504f10-b8ca-45bd-a4ab-d0fbcd0309f2",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-02-20T15:06:25.376294+00:00",
        "endTime": "2024-02-20T16:33:25.376294+00:00",
        "distance": 19.16,
        "duration": 87,
        "riskScore": 47.77
    },
    {
        "tripId": "604c0840-43da-4580-ae1c-866ead874b97",
        "userId": "80504f10-b8ca-45bd-a4ab-d0fbcd0309f2",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-06-18T07:35:52.731125+00:00",
        "endTime": "2024-06-18T08:53:52.731125+00:00",
        "distance": 35.79,
        "duration": 78,
        "riskScore": 62.56
    },
    {
        "tripId": "ecb16fc4-fbfd-4db9-955c-cbb5a94d7e9b",
        "userId": "80504f10-b8ca-45bd-a4ab-d0fbcd0309f2",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-06-21T02:54:34.934591+00:00",
        "endTime": "2024-06-21T04:04:34.934591+00:00",
        "distance": 18.37,
        "duration": 70,
        "riskScore": 46.71
    },
    {
        "tripId": "64262fb9-92eb-40cc-9ed6-0eecb43dc06e",
        "userId": "80504f10-b8ca-45bd-a4ab-d0fbcd0309f2",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-04-08T22:09:27.642192+00:00",
        "endTime": "2024-04-08T23:48:27.642192+00:00",
        "distance": 24.19,
        "duration": 99,
        "riskScore": 61.15
    },
    {
        "tripId": "cace47ee-b5b8-455a-a0b0-bfa668cef73e",
        "userId": "e91651c8-e2d1-49df-bc29-eaab4266a36a",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-07-04T07:57:22.83731+00:00",
        "endTime": "2024-07-04T09:22:22.83731+00:00",
        "distance": 40.07,
        "duration": 85,
        "riskScore": 43.94
    },
    {
        "tripId": "e597e41d-9736-4da4-b2dd-6679519b5cd3",
        "userId": "e91651c8-e2d1-49df-bc29-eaab4266a36a",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-06-23T09:39:03.04345+00:00",
        "endTime": "2024-06-23T09:58:03.04345+00:00",
        "distance": 17.96,
        "duration": 19,
        "riskScore": 60.53
    },
    {
        "tripId": "29477daa-4588-4001-ac3a-1bb94f18cf94",
        "userId": "e91651c8-e2d1-49df-bc29-eaab4266a36a",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-02-11T01:31:24.399867+00:00",
        "endTime": "2024-02-11T02:29:24.399867+00:00",
        "distance": 23.03,
        "duration": 58,
        "riskScore": 46.93
    },
    {
        "tripId": "397b965c-c23b-4d6a-882e-7d6837d802e2",
        "userId": "e91651c8-e2d1-49df-bc29-eaab4266a36a",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-15T00:52:29.510058+00:00",
        "endTime": "2024-01-15T01:57:29.510058+00:00",
        "distance": 18.35,
        "duration": 65,
        "riskScore": 65.52
    },
    {
        "tripId": "29adb544-29e7-4bf3-8009-55faf412a66b",
        "userId": "8f331419-2d22-43d6-b0fe-98262d6d51b2",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-02-22T12:48:01.863449+00:00",
        "endTime": "2024-02-22T13:45:01.863449+00:00",
        "distance": 29.04,
        "duration": 57,
        "riskScore": 60.05
    },
    {
        "tripId": "4966d0b5-bb68-41fd-bf27-19c76518eee4",
        "userId": "8f331419-2d22-43d6-b0fe-98262d6d51b2",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-14T12:58:52.998612+00:00",
        "endTime": "2024-06-14T14:24:52.998612+00:00",
        "distance": 25.43,
        "duration": 86,
        "riskScore": 66.96
    },
    {
        "tripId": "357495cd-8b48-4b19-9bc0-44da04c2070e",
        "userId": "8f331419-2d22-43d6-b0fe-98262d6d51b2",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-01-22T20:06:47.52201+00:00",
        "endTime": "2024-01-22T20:24:47.52201+00:00",
        "distance": 42.32,
        "duration": 18,
        "riskScore": 40.88
    },
    {
        "tripId": "0df97123-eb22-4e26-a696-c567ff4eda8c",
        "userId": "8f331419-2d22-43d6-b0fe-98262d6d51b2",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-03-07T18:21:47.37331+00:00",
        "endTime": "2024-03-07T19:37:47.37331+00:00",
        "distance": 7.59,
        "duration": 76,
        "riskScore": 61.78
    },
    {
        "tripId": "1d2ebf65-f844-4113-87e0-e5e7a783305b",
        "userId": "8f331419-2d22-43d6-b0fe-98262d6d51b2",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-03-27T00:41:45.669295+00:00",
        "endTime": "2024-03-27T01:18:45.669295+00:00",
        "distance": 8,
        "duration": 37,
        "riskScore": 48.28
    },
    {
        "tripId": "ec95b629-1a02-4699-9b2d-8b43fd17ce4c",
        "userId": "0dce1675-c589-4c1e-a4b6-4fc6f0ba5091",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-05-01T00:51:17.599074+00:00",
        "endTime": "2024-05-01T02:16:17.599074+00:00",
        "distance": 18.04,
        "duration": 85,
        "riskScore": 46.86
    },
    {
        "tripId": "1f510308-1665-4ac0-95d7-95e686293286",
        "userId": "0dce1675-c589-4c1e-a4b6-4fc6f0ba5091",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-05-05T06:54:02.805066+00:00",
        "endTime": "2024-05-05T07:07:02.805066+00:00",
        "distance": 44.12,
        "duration": 13,
        "riskScore": 42.21
    },
    {
        "tripId": "e8f98bca-b60a-44a1-ba0d-372cccc62918",
        "userId": "0dce1675-c589-4c1e-a4b6-4fc6f0ba5091",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-05-06T02:26:25.301805+00:00",
        "endTime": "2024-05-06T03:57:25.301805+00:00",
        "distance": 33.91,
        "duration": 91,
        "riskScore": 53.72
    },
    {
        "tripId": "0754caca-dea5-48df-9957-13f7851bacc0",
        "userId": "0dce1675-c589-4c1e-a4b6-4fc6f0ba5091",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-02-12T21:17:29.819415+00:00",
        "endTime": "2024-02-12T22:29:29.819415+00:00",
        "distance": 11.01,
        "duration": 72,
        "riskScore": 41.14
    },
    {
        "tripId": "023c58c2-1ff7-4017-8b04-5fd600071b8d",
        "userId": "6979a93f-2eb8-43cd-87ed-a654f6a1c490",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-25T18:56:29.310009+00:00",
        "endTime": "2024-06-25T19:45:29.310009+00:00",
        "distance": 3.02,
        "duration": 49,
        "riskScore": 43.7
    },
    {
        "tripId": "64443ed7-7e5d-41d1-b131-60e27c616e5b",
        "userId": "6979a93f-2eb8-43cd-87ed-a654f6a1c490",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-06-21T20:04:58.226685+00:00",
        "endTime": "2024-06-21T21:36:58.226685+00:00",
        "distance": 19.08,
        "duration": 92,
        "riskScore": 47.6
    },
    {
        "tripId": "5b069e8b-d5ed-441b-b54a-c768db7c9350",
        "userId": "6979a93f-2eb8-43cd-87ed-a654f6a1c490",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-02-25T19:22:10.940872+00:00",
        "endTime": "2024-02-25T20:27:10.940872+00:00",
        "distance": 25.64,
        "duration": 65,
        "riskScore": 50.69
    },
    {
        "tripId": "6689929b-127c-45db-ae27-0e2bd0b2a6df",
        "userId": "6979a93f-2eb8-43cd-87ed-a654f6a1c490",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-03-11T06:35:57.462323+00:00",
        "endTime": "2024-03-11T06:46:57.462323+00:00",
        "distance": 5.78,
        "duration": 11,
        "riskScore": 45.26
    },
    {
        "tripId": "5c62ce82-1b18-421d-a461-b2cb0698d164",
        "userId": "6979a93f-2eb8-43cd-87ed-a654f6a1c490",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-06-02T15:00:17.842219+00:00",
        "endTime": "2024-06-02T15:11:17.842219+00:00",
        "distance": 44.37,
        "duration": 11,
        "riskScore": 41.25
    },
    {
        "tripId": "16de2374-32c9-4395-8628-fd6b73974207",
        "userId": "6979a93f-2eb8-43cd-87ed-a654f6a1c490",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-02-27T08:37:21.969919+00:00",
        "endTime": "2024-02-27T09:57:21.969919+00:00",
        "distance": 8.57,
        "duration": 80,
        "riskScore": 49.11
    },
    {
        "tripId": "bf880b69-8fc6-4fda-ae6e-bc7dc4ff548d",
        "userId": "6979a93f-2eb8-43cd-87ed-a654f6a1c490",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-03-26T21:09:46.74482+00:00",
        "endTime": "2024-03-26T21:46:46.74482+00:00",
        "distance": 29.18,
        "duration": 37,
        "riskScore": 52.88
    },
    {
        "tripId": "83164a88-778a-46a3-a5e6-2d6a34b06047",
        "userId": "6979a93f-2eb8-43cd-87ed-a654f6a1c490",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-03-26T22:40:43.586682+00:00",
        "endTime": "2024-03-26T23:45:43.586682+00:00",
        "distance": 4.48,
        "duration": 65,
        "riskScore": 50.78
    },
    {
        "tripId": "91bf7ec7-685e-4b3d-922c-18b61c49b714",
        "userId": "6979a93f-2eb8-43cd-87ed-a654f6a1c490",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-03-08T05:35:08.649724+00:00",
        "endTime": "2024-03-08T06:38:08.649724+00:00",
        "distance": 8.94,
        "duration": 63,
        "riskScore": 57.53
    },
    {
        "tripId": "c2218793-d684-4f35-9390-a8a0104a9714",
        "userId": "cfafd9c0-ec35-43d2-8c96-32515bd279d5",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-03-29T11:59:09.460998+00:00",
        "endTime": "2024-03-29T12:19:09.460998+00:00",
        "distance": 19.01,
        "duration": 20,
        "riskScore": 55.54
    },
    {
        "tripId": "3814ab9c-3d59-46dd-885b-01ee5cf93d15",
        "userId": "cfafd9c0-ec35-43d2-8c96-32515bd279d5",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-03T02:27:07.546697+00:00",
        "endTime": "2024-06-03T02:40:07.546697+00:00",
        "distance": 8.9,
        "duration": 13,
        "riskScore": 64.66
    },
    {
        "tripId": "77321101-71ac-4b03-b971-8b4e851d2bdb",
        "userId": "4f23bbe6-cb55-4981-9c41-07a4dabc54f7",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-04-09T18:40:18.935066+00:00",
        "endTime": "2024-04-09T19:14:18.935066+00:00",
        "distance": 19.87,
        "duration": 34,
        "riskScore": 53.9
    },
    {
        "tripId": "05499e32-0121-4434-a4a3-7abc73f4126d",
        "userId": "4f23bbe6-cb55-4981-9c41-07a4dabc54f7",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-03-21T21:25:34.25422+00:00",
        "endTime": "2024-03-21T22:39:34.25422+00:00",
        "distance": 24.98,
        "duration": 74,
        "riskScore": 50.96
    },
    {
        "tripId": "cb5c2718-5e71-4c03-8705-555ce58c880f",
        "userId": "4f23bbe6-cb55-4981-9c41-07a4dabc54f7",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-04-28T11:36:44.124199+00:00",
        "endTime": "2024-04-28T13:34:44.124199+00:00",
        "distance": 23.88,
        "duration": 118,
        "riskScore": 45.79
    },
    {
        "tripId": "8beacfbc-4710-40b1-be18-a71cfd87a956",
        "userId": "e188ec1c-ed06-4f55-891f-9c1dfe2522cd",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-01-09T19:17:59.933394+00:00",
        "endTime": "2024-01-09T19:57:59.933394+00:00",
        "distance": 14.44,
        "duration": 40,
        "riskScore": 43.41
    },
    {
        "tripId": "97ed6db1-b91f-4d70-b462-841fac419648",
        "userId": "e188ec1c-ed06-4f55-891f-9c1dfe2522cd",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-04-22T13:39:11.518809+00:00",
        "endTime": "2024-04-22T14:17:11.518809+00:00",
        "distance": 21.23,
        "duration": 38,
        "riskScore": 52.03
    },
    {
        "tripId": "c2610535-33c6-40d1-a8f5-14dfd8b61104",
        "userId": "e188ec1c-ed06-4f55-891f-9c1dfe2522cd",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-05-07T08:26:25.937957+00:00",
        "endTime": "2024-05-07T10:00:25.937957+00:00",
        "distance": 40.69,
        "duration": 94,
        "riskScore": 53.65
    },
    {
        "tripId": "da00ee03-7084-45c0-9d9b-fecaf6920001",
        "userId": "e188ec1c-ed06-4f55-891f-9c1dfe2522cd",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-06-24T00:11:33.778674+00:00",
        "endTime": "2024-06-24T00:59:33.778674+00:00",
        "distance": 45.07,
        "duration": 48,
        "riskScore": 67.46
    },
    {
        "tripId": "f1c4a54d-ee6d-4fb9-be0e-860a9a318a46",
        "userId": "e188ec1c-ed06-4f55-891f-9c1dfe2522cd",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-01-25T00:49:48.138402+00:00",
        "endTime": "2024-01-25T02:12:48.138402+00:00",
        "distance": 25.26,
        "duration": 83,
        "riskScore": 44.64
    },
    {
        "tripId": "f690179b-387b-4877-bc06-42075a6871a2",
        "userId": "e188ec1c-ed06-4f55-891f-9c1dfe2522cd",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-05-11T17:39:28.378284+00:00",
        "endTime": "2024-05-11T18:58:28.378284+00:00",
        "distance": 42.34,
        "duration": 79,
        "riskScore": 41.5
    },
    {
        "tripId": "fc62efc6-224b-41c0-9064-bd3b2c5aa3d6",
        "userId": "e188ec1c-ed06-4f55-891f-9c1dfe2522cd",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-05-30T10:07:17.480577+00:00",
        "endTime": "2024-05-30T11:52:17.480577+00:00",
        "distance": 26.56,
        "duration": 105,
        "riskScore": 42.42
    },
    {
        "tripId": "bc8bf5b3-4e0f-4e88-9ffb-19596395886d",
        "userId": "e188ec1c-ed06-4f55-891f-9c1dfe2522cd",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-02-05T19:33:24.105168+00:00",
        "endTime": "2024-02-05T21:12:24.105168+00:00",
        "distance": 11.37,
        "duration": 99,
        "riskScore": 55.46
    },
    {
        "tripId": "b816cc74-a5d4-4921-bc58-5d874fdbfeda",
        "userId": "e188ec1c-ed06-4f55-891f-9c1dfe2522cd",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-06-22T19:50:28.36182+00:00",
        "endTime": "2024-06-22T21:11:28.36182+00:00",
        "distance": 13.73,
        "duration": 81,
        "riskScore": 54.57
    },
    {
        "tripId": "53f5e66f-21fb-40f0-b4d7-38aea9305af2",
        "userId": "93dafc9c-f2ac-4d23-88ee-cfdf560e5403",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-01-21T19:59:31.504236+00:00",
        "endTime": "2024-01-21T21:18:31.504236+00:00",
        "distance": 44.33,
        "duration": 79,
        "riskScore": 51.14
    },
    {
        "tripId": "635e94bd-5f40-47dc-8f0f-202faf3aab4a",
        "userId": "93dafc9c-f2ac-4d23-88ee-cfdf560e5403",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-02-14T20:29:05.794468+00:00",
        "endTime": "2024-02-14T21:46:05.794468+00:00",
        "distance": 38.24,
        "duration": 77,
        "riskScore": 41.13
    },
    {
        "tripId": "3a59e074-d4b2-466e-bd2b-bd387e4388b6",
        "userId": "c8a6f342-b198-4bd1-81be-7ef56fef4510",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-04-14T19:50:50.782173+00:00",
        "endTime": "2024-04-14T21:15:50.782173+00:00",
        "distance": 4.11,
        "duration": 85,
        "riskScore": 52.18
    },
    {
        "tripId": "060e8c45-c992-4135-a3b3-c37dbc71087a",
        "userId": "c8a6f342-b198-4bd1-81be-7ef56fef4510",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-03-05T03:45:12.805828+00:00",
        "endTime": "2024-03-05T04:27:12.805828+00:00",
        "distance": 8.28,
        "duration": 42,
        "riskScore": 62.19
    },
    {
        "tripId": "78d9ad87-7a89-4ce0-9e72-f5fd5408946f",
        "userId": "c8a6f342-b198-4bd1-81be-7ef56fef4510",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-05-19T09:27:07.686983+00:00",
        "endTime": "2024-05-19T10:59:07.686983+00:00",
        "distance": 35.5,
        "duration": 92,
        "riskScore": 48.82
    },
    {
        "tripId": "59cd88a8-b8dd-4ca9-9916-c7688b9ca940",
        "userId": "c8a6f342-b198-4bd1-81be-7ef56fef4510",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-01-05T05:42:46.335507+00:00",
        "endTime": "2024-01-05T07:35:46.335507+00:00",
        "distance": 20.67,
        "duration": 113,
        "riskScore": 41.15
    },
    {
        "tripId": "da35f793-19d8-4c93-987b-25a238afb504",
        "userId": "c8a6f342-b198-4bd1-81be-7ef56fef4510",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-03-06T10:58:00.490796+00:00",
        "endTime": "2024-03-06T12:23:00.490796+00:00",
        "distance": 29.68,
        "duration": 85,
        "riskScore": 51.89
    },
    {
        "tripId": "21ae441a-4243-4e2d-b0f4-4c2477f738b8",
        "userId": "c8a6f342-b198-4bd1-81be-7ef56fef4510",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-04-06T11:11:29.4378+00:00",
        "endTime": "2024-04-06T11:20:29.4378+00:00",
        "distance": 24.73,
        "duration": 9,
        "riskScore": 53.51
    },
    {
        "tripId": "3a78e2b8-88f8-4fd3-9a1a-1c68c8e41e14",
        "userId": "c8a6f342-b198-4bd1-81be-7ef56fef4510",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-03-09T11:04:34.652062+00:00",
        "endTime": "2024-03-09T12:42:34.652062+00:00",
        "distance": 39.75,
        "duration": 98,
        "riskScore": 56.5
    },
    {
        "tripId": "8a4205e0-8cd2-4250-a44b-b44143dd0f03",
        "userId": "c8a6f342-b198-4bd1-81be-7ef56fef4510",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-06-10T17:41:32.2093+00:00",
        "endTime": "2024-06-10T18:32:32.2093+00:00",
        "distance": 26.66,
        "duration": 51,
        "riskScore": 61.41
    },
    {
        "tripId": "a5174760-0e05-49e5-8617-7eeb533dd947",
        "userId": "888708ec-954e-49c2-adfa-00ac2ee504cd",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-07-05T05:15:11.571271+00:00",
        "endTime": "2024-07-05T06:06:11.571271+00:00",
        "distance": 29.83,
        "duration": 51,
        "riskScore": 60.4
    },
    {
        "tripId": "76394c2a-e65e-4098-a7d4-bf8d66bd24e9",
        "userId": "888708ec-954e-49c2-adfa-00ac2ee504cd",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-03-04T01:37:43.446407+00:00",
        "endTime": "2024-03-04T03:11:43.446407+00:00",
        "distance": 47.97,
        "duration": 94,
        "riskScore": 57.9
    },
    {
        "tripId": "b91b6631-b8a2-47ae-aeee-e66bf130c996",
        "userId": "888708ec-954e-49c2-adfa-00ac2ee504cd",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-02-11T16:27:30.026994+00:00",
        "endTime": "2024-02-11T17:00:30.026994+00:00",
        "distance": 8.97,
        "duration": 33,
        "riskScore": 43.56
    },
    {
        "tripId": "817ae085-7075-414b-b4ed-90755268805e",
        "userId": "888708ec-954e-49c2-adfa-00ac2ee504cd",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-03-11T01:59:45.520814+00:00",
        "endTime": "2024-03-11T03:44:45.520814+00:00",
        "distance": 29.89,
        "duration": 105,
        "riskScore": 48.63
    },
    {
        "tripId": "8f5c8e8a-9cce-492c-81d8-d79c1a7dda86",
        "userId": "888708ec-954e-49c2-adfa-00ac2ee504cd",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-02-26T01:47:12.255907+00:00",
        "endTime": "2024-02-26T02:26:12.255907+00:00",
        "distance": 11.72,
        "duration": 39,
        "riskScore": 56.71
    },
    {
        "tripId": "249ecf02-6e11-410e-b972-4145e8d084fa",
        "userId": "888708ec-954e-49c2-adfa-00ac2ee504cd",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-03-28T18:31:58.794529+00:00",
        "endTime": "2024-03-28T20:14:58.794529+00:00",
        "distance": 37.35,
        "duration": 103,
        "riskScore": 61.44
    },
    {
        "tripId": "87a2954a-7966-43e1-b82e-af71db8e6610",
        "userId": "888708ec-954e-49c2-adfa-00ac2ee504cd",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-05-28T16:38:57.529595+00:00",
        "endTime": "2024-05-28T18:03:57.529595+00:00",
        "distance": 48.17,
        "duration": 85,
        "riskScore": 41.51
    },
    {
        "tripId": "0f261331-b26b-4949-873f-bd59e2eba6bd",
        "userId": "888708ec-954e-49c2-adfa-00ac2ee504cd",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-01-16T06:38:24.966794+00:00",
        "endTime": "2024-01-16T07:04:24.966794+00:00",
        "distance": 5.7,
        "duration": 26,
        "riskScore": 44.58
    },
    {
        "tripId": "b7b1c4e5-a082-4a51-aab8-443955d810a2",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-07-02T16:30:53.051706+00:00",
        "endTime": "2024-07-02T17:43:53.051706+00:00",
        "distance": 41.39,
        "duration": 73,
        "riskScore": 59.72
    },
    {
        "tripId": "3c5eaeb5-629f-421c-94f2-31779248b69a",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-06-27T14:05:40.193787+00:00",
        "endTime": "2024-06-27T16:05:40.193787+00:00",
        "distance": 18.23,
        "duration": 120,
        "riskScore": 60.29
    },
    {
        "tripId": "99a33355-ecb0-4bce-8fd0-af78399f7b2e",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-07-06T03:57:39.023715+00:00",
        "endTime": "2024-07-06T05:53:39.023715+00:00",
        "distance": 15.23,
        "duration": 116,
        "riskScore": 60.59
    },
    {
        "tripId": "7a526c2b-5360-44be-a61f-2302d981956a",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-17T02:01:30.118135+00:00",
        "endTime": "2024-06-17T02:31:30.118135+00:00",
        "distance": 16.71,
        "duration": 30,
        "riskScore": 68.71
    },
    {
        "tripId": "51c9f67e-6f37-426f-8f99-47530430b028",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-06-17T07:11:42.29476+00:00",
        "endTime": "2024-06-17T07:23:42.29476+00:00",
        "distance": 30.9,
        "duration": 12,
        "riskScore": 55.19
    },
    {
        "tripId": "71d0c178-c372-4872-912e-f9dbd5b9980f",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-02-01T09:48:54.336605+00:00",
        "endTime": "2024-02-01T10:32:54.336605+00:00",
        "distance": 20.33,
        "duration": 44,
        "riskScore": 69.67
    },
    {
        "tripId": "d2a4dda7-32ea-41fd-9efe-9cc3b2659e68",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-03-12T16:00:15.974668+00:00",
        "endTime": "2024-03-12T17:50:15.974668+00:00",
        "distance": 2.58,
        "duration": 110,
        "riskScore": 63.53
    },
    {
        "tripId": "9056d59d-cb45-445a-bc97-22f74fc8065f",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-07-02T19:57:44.075327+00:00",
        "endTime": "2024-07-02T20:53:44.075327+00:00",
        "distance": 37.38,
        "duration": 56,
        "riskScore": 53.38
    },
    {
        "tripId": "1f4a7b52-50d4-46b7-a6e7-9630fbe2161f",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-04-15T06:42:08.629177+00:00",
        "endTime": "2024-04-15T07:57:08.629177+00:00",
        "distance": 32.08,
        "duration": 75,
        "riskScore": 51.29
    },
    {
        "tripId": "5ae4a2b1-12ce-4cd9-b859-9808cc01cec1",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-02-26T20:41:06.090766+00:00",
        "endTime": "2024-02-26T22:08:06.090766+00:00",
        "distance": 49.9,
        "duration": 87,
        "riskScore": 41.27
    },
    {
        "tripId": "f6ac2f95-9805-4f69-be56-f112e1dcdd91",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-04-07T10:17:13.018406+00:00",
        "endTime": "2024-04-07T11:43:13.018406+00:00",
        "distance": 12.05,
        "duration": 86,
        "riskScore": 42.45
    },
    {
        "tripId": "6b0eb07e-d65f-42d9-932c-587af23c2b91",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-04-24T06:43:38.614742+00:00",
        "endTime": "2024-04-24T06:56:38.614742+00:00",
        "distance": 7.28,
        "duration": 13,
        "riskScore": 49.54
    },
    {
        "tripId": "d63fa02a-357f-41db-b845-67ab57037d6a",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-06-18T02:14:47.489838+00:00",
        "endTime": "2024-06-18T02:47:47.489838+00:00",
        "distance": 16.8,
        "duration": 33,
        "riskScore": 60.08
    },
    {
        "tripId": "af998630-a5ae-4b5c-9863-595c2077ecd6",
        "userId": "40db692b-08b7-4558-808f-441467fbba4c",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-02-04T03:02:25.755164+00:00",
        "endTime": "2024-02-04T03:42:25.755164+00:00",
        "distance": 5.75,
        "duration": 40,
        "riskScore": 46.59
    },
    {
        "tripId": "508f6bed-81b3-4921-87a5-16c3e092b9bf",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-03-11T07:53:00.947431+00:00",
        "endTime": "2024-03-11T09:23:00.947431+00:00",
        "distance": 18.74,
        "duration": 90,
        "riskScore": 40.99
    },
    {
        "tripId": "e55b4232-1608-4acf-87a3-b91dbcd073a1",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-01-03T02:20:21.675829+00:00",
        "endTime": "2024-01-03T02:47:21.675829+00:00",
        "distance": 17.18,
        "duration": 27,
        "riskScore": 54.5
    },
    {
        "tripId": "57cb2ca2-7097-4e7d-b08d-5801c0df5ca3",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-03-21T15:17:56.550186+00:00",
        "endTime": "2024-03-21T15:55:56.550186+00:00",
        "distance": 43.84,
        "duration": 38,
        "riskScore": 60.51
    },
    {
        "tripId": "50568642-2e45-42f4-849d-603f5b5f20ac",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-01-20T03:21:38.332789+00:00",
        "endTime": "2024-01-20T05:08:38.332789+00:00",
        "distance": 32.07,
        "duration": 107,
        "riskScore": 55.13
    },
    {
        "tripId": "abd56bbc-835d-4ffc-8ff4-639923c75b0c",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-02-01T19:59:55.174524+00:00",
        "endTime": "2024-02-01T20:29:55.174524+00:00",
        "distance": 35.08,
        "duration": 30,
        "riskScore": 62.83
    },
    {
        "tripId": "f099ed18-726a-4559-9eb1-fd9202a4704b",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-06-30T18:26:17.551836+00:00",
        "endTime": "2024-06-30T19:48:17.551836+00:00",
        "distance": 24.77,
        "duration": 82,
        "riskScore": 58.33
    },
    {
        "tripId": "14f8858b-d5d1-467a-a581-58b382df65be",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-02-10T13:05:23.406655+00:00",
        "endTime": "2024-02-10T14:01:23.406655+00:00",
        "distance": 36.27,
        "duration": 56,
        "riskScore": 47.38
    },
    {
        "tripId": "4617a6ba-9d0c-4818-a5b7-f12ce3edeb5b",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-02-09T21:26:19.460444+00:00",
        "endTime": "2024-02-09T22:47:19.460444+00:00",
        "distance": 46.3,
        "duration": 81,
        "riskScore": 56.72
    },
    {
        "tripId": "38acfa51-299e-466a-b232-5886a43ed3d3",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-04-24T05:15:41.45485+00:00",
        "endTime": "2024-04-24T05:43:41.45485+00:00",
        "distance": 33.8,
        "duration": 28,
        "riskScore": 63.01
    },
    {
        "tripId": "539af327-8159-4228-a507-7bf135c33c8c",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-01-05T23:35:55.662718+00:00",
        "endTime": "2024-01-06T00:40:55.662718+00:00",
        "distance": 16.48,
        "duration": 65,
        "riskScore": 60.34
    },
    {
        "tripId": "b91a7064-b4f1-4fde-a747-cbfcdbfe551f",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-01-08T13:25:14.414679+00:00",
        "endTime": "2024-01-08T14:45:14.414679+00:00",
        "distance": 20.23,
        "duration": 80,
        "riskScore": 54.92
    },
    {
        "tripId": "f402e750-03d8-46a2-9ef7-b2fe4825ecda",
        "userId": "0f331b62-5a25-47a1-a95a-7df2dce13fbd",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-01-09T04:03:02.40121+00:00",
        "endTime": "2024-01-09T05:01:02.40121+00:00",
        "distance": 26.06,
        "duration": 58,
        "riskScore": 59.28
    },
    {
        "tripId": "83255c25-9553-47d7-a682-3c44cfc05d84",
        "userId": "f8981be0-ba21-4d1c-a480-910a724d48fd",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-01-24T10:38:39.041998+00:00",
        "endTime": "2024-01-24T11:46:39.041998+00:00",
        "distance": 2.7,
        "duration": 68,
        "riskScore": 64.99
    },
    {
        "tripId": "5958b723-d19c-424c-bc8c-85fa8fe53292",
        "userId": "f8981be0-ba21-4d1c-a480-910a724d48fd",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-03-05T23:54:37.865468+00:00",
        "endTime": "2024-03-06T00:33:37.865468+00:00",
        "distance": 32.22,
        "duration": 39,
        "riskScore": 51.56
    },
    {
        "tripId": "a1f57661-88f7-4531-9bb9-17b1e240c8a8",
        "userId": "f8981be0-ba21-4d1c-a480-910a724d48fd",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-07-02T05:16:22.113623+00:00",
        "endTime": "2024-07-02T06:23:22.113623+00:00",
        "distance": 47.13,
        "duration": 67,
        "riskScore": 68.41
    },
    {
        "tripId": "a3497f77-282a-4aa4-aed0-a24ba1d3a780",
        "userId": "f8981be0-ba21-4d1c-a480-910a724d48fd",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-25T03:41:34.214342+00:00",
        "endTime": "2024-06-25T04:41:34.214342+00:00",
        "distance": 38.35,
        "duration": 60,
        "riskScore": 60.03
    },
    {
        "tripId": "b775c8ce-8fd8-4a30-af3a-a92b351a959b",
        "userId": "bed9e7c8-dec3-4a2a-8220-cf8d5ea21ffd",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-07-06T16:25:51.752815+00:00",
        "endTime": "2024-07-06T17:26:51.752815+00:00",
        "distance": 5.17,
        "duration": 61,
        "riskScore": 47.39
    },
    {
        "tripId": "86f24ad1-125d-4077-813b-e3388422965d",
        "userId": "bed9e7c8-dec3-4a2a-8220-cf8d5ea21ffd",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-03-29T02:11:29.68315+00:00",
        "endTime": "2024-03-29T03:11:29.68315+00:00",
        "distance": 13.28,
        "duration": 60,
        "riskScore": 66.98
    },
    {
        "tripId": "7b47b844-2beb-431b-a133-2323af6c6da1",
        "userId": "bed9e7c8-dec3-4a2a-8220-cf8d5ea21ffd",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-06-13T09:45:34.736527+00:00",
        "endTime": "2024-06-13T10:06:34.736527+00:00",
        "distance": 30.26,
        "duration": 21,
        "riskScore": 67.1
    },
    {
        "tripId": "11fa34e6-aada-44ea-9bbe-805534457e5b",
        "userId": "bed9e7c8-dec3-4a2a-8220-cf8d5ea21ffd",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-02-14T02:25:08.911019+00:00",
        "endTime": "2024-02-14T02:47:08.911019+00:00",
        "distance": 45.08,
        "duration": 22,
        "riskScore": 58.54
    },
    {
        "tripId": "1f866496-1cee-49ef-b60c-3bf78316f32c",
        "userId": "27760b16-dd1a-4653-9c83-be59d2e1b20a",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-05-28T22:47:24.972997+00:00",
        "endTime": "2024-05-29T00:10:24.972997+00:00",
        "distance": 11.18,
        "duration": 83,
        "riskScore": 64.72
    },
    {
        "tripId": "a5450517-8745-475f-b1b2-176751355674",
        "userId": "27760b16-dd1a-4653-9c83-be59d2e1b20a",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-03-22T12:46:11.391773+00:00",
        "endTime": "2024-03-22T14:39:11.391773+00:00",
        "distance": 39.14,
        "duration": 113,
        "riskScore": 68.35
    },
    {
        "tripId": "ed3efb40-f4fe-473c-ae29-c1f50db6b480",
        "userId": "27760b16-dd1a-4653-9c83-be59d2e1b20a",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-02-13T13:52:03.720336+00:00",
        "endTime": "2024-02-13T14:00:03.720336+00:00",
        "distance": 15.63,
        "duration": 8,
        "riskScore": 42.56
    },
    {
        "tripId": "0d1079c5-c307-47f5-b15d-0cdc64ce356a",
        "userId": "27760b16-dd1a-4653-9c83-be59d2e1b20a",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-04-23T14:44:24.910696+00:00",
        "endTime": "2024-04-23T15:34:24.910696+00:00",
        "distance": 39.25,
        "duration": 50,
        "riskScore": 44.13
    },
    {
        "tripId": "e00f8b61-4178-48bf-bf2e-0d2105e29cba",
        "userId": "27760b16-dd1a-4653-9c83-be59d2e1b20a",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-05-01T18:35:39.334669+00:00",
        "endTime": "2024-05-01T19:34:39.334669+00:00",
        "distance": 13.16,
        "duration": 59,
        "riskScore": 66.43
    },
    {
        "tripId": "d3804f8c-0ca9-41d0-840e-9d6e6ebae8ab",
        "userId": "1c62e6a5-12a7-4028-8ba4-560c565d9052",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-02-05T19:02:38.327796+00:00",
        "endTime": "2024-02-05T19:07:38.327796+00:00",
        "distance": 3.26,
        "duration": 5,
        "riskScore": 68.78
    },
    {
        "tripId": "a7fd3a3c-73c4-413f-8870-8e9fcfe6f2da",
        "userId": "1c62e6a5-12a7-4028-8ba4-560c565d9052",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-01-10T14:40:57.827635+00:00",
        "endTime": "2024-01-10T15:26:57.827635+00:00",
        "distance": 48.01,
        "duration": 46,
        "riskScore": 61.96
    },
    {
        "tripId": "8f2099bf-3eef-495e-ab4f-877a1013dbcf",
        "userId": "1c62e6a5-12a7-4028-8ba4-560c565d9052",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-01-29T19:17:18.271405+00:00",
        "endTime": "2024-01-29T19:26:18.271405+00:00",
        "distance": 6.28,
        "duration": 9,
        "riskScore": 45.11
    },
    {
        "tripId": "276407ee-6304-432e-ace4-bea9602ca859",
        "userId": "1c62e6a5-12a7-4028-8ba4-560c565d9052",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-05-17T19:49:55.852966+00:00",
        "endTime": "2024-05-17T20:19:55.852966+00:00",
        "distance": 4.43,
        "duration": 30,
        "riskScore": 57.16
    },
    {
        "tripId": "68274155-267d-4145-966c-acb2962644b9",
        "userId": "1c62e6a5-12a7-4028-8ba4-560c565d9052",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-06-20T07:23:32.876439+00:00",
        "endTime": "2024-06-20T08:53:32.876439+00:00",
        "distance": 10.83,
        "duration": 90,
        "riskScore": 63.42
    },
    {
        "tripId": "ef1956f1-9de7-4897-894d-67ac7a5ca5d9",
        "userId": "1c62e6a5-12a7-4028-8ba4-560c565d9052",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-07-05T00:56:11.422678+00:00",
        "endTime": "2024-07-05T02:16:11.422678+00:00",
        "distance": 21.02,
        "duration": 80,
        "riskScore": 67.84
    },
    {
        "tripId": "ba431b57-2960-4bb5-8aa1-057c6ccfc6f5",
        "userId": "1c62e6a5-12a7-4028-8ba4-560c565d9052",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-05-16T02:46:28.860955+00:00",
        "endTime": "2024-05-16T04:36:28.860955+00:00",
        "distance": 12.04,
        "duration": 110,
        "riskScore": 46.29
    },
    {
        "tripId": "925ec483-263e-4d4b-b415-205af5fa0b73",
        "userId": "1c62e6a5-12a7-4028-8ba4-560c565d9052",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-01-14T19:02:53.515781+00:00",
        "endTime": "2024-01-14T20:08:53.515781+00:00",
        "distance": 36.39,
        "duration": 66,
        "riskScore": 60.4
    },
    {
        "tripId": "14739328-6e4a-406a-84ca-4ff08f578eb5",
        "userId": "1c62e6a5-12a7-4028-8ba4-560c565d9052",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-01-18T23:44:40.706077+00:00",
        "endTime": "2024-01-19T00:36:40.706077+00:00",
        "distance": 42.04,
        "duration": 52,
        "riskScore": 61.67
    },
    {
        "tripId": "c505d345-4260-466f-b2d9-2c5a44414a52",
        "userId": "1c62e6a5-12a7-4028-8ba4-560c565d9052",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-04-13T15:23:54.232268+00:00",
        "endTime": "2024-04-13T16:06:54.232268+00:00",
        "distance": 16.62,
        "duration": 43,
        "riskScore": 65.55
    },
    {
        "tripId": "dfc9c8f0-c708-43ce-8604-27f0cabf335f",
        "userId": "37e808bb-8f47-4a64-bb96-84a3df7b4550",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-06-29T21:26:25.73169+00:00",
        "endTime": "2024-06-29T22:22:25.73169+00:00",
        "distance": 23.7,
        "duration": 56,
        "riskScore": 42.03
    },
    {
        "tripId": "1f1bf132-e32d-4925-92a2-f4103ae8216d",
        "userId": "37e808bb-8f47-4a64-bb96-84a3df7b4550",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-05-13T13:06:42.811247+00:00",
        "endTime": "2024-05-13T14:03:42.811247+00:00",
        "distance": 6.98,
        "duration": 57,
        "riskScore": 61.53
    },
    {
        "tripId": "d407df0a-b719-4cc9-b022-de9efe8648c9",
        "userId": "37e808bb-8f47-4a64-bb96-84a3df7b4550",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-06-29T07:25:13.9788+00:00",
        "endTime": "2024-06-29T08:15:13.9788+00:00",
        "distance": 28.26,
        "duration": 50,
        "riskScore": 44.79
    },
    {
        "tripId": "101c069b-1618-4bf3-98a6-8e7544e032c0",
        "userId": "37e808bb-8f47-4a64-bb96-84a3df7b4550",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-04-26T01:33:01.572704+00:00",
        "endTime": "2024-04-26T02:26:01.572704+00:00",
        "distance": 31.66,
        "duration": 53,
        "riskScore": 57.36
    },
    {
        "tripId": "1abff405-ea89-41d8-b810-b1204077f375",
        "userId": "37e808bb-8f47-4a64-bb96-84a3df7b4550",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-01-18T22:51:16.691587+00:00",
        "endTime": "2024-01-19T00:27:16.691587+00:00",
        "distance": 16.87,
        "duration": 96,
        "riskScore": 56.91
    },
    {
        "tripId": "4b1af839-8aeb-4df5-a68c-090ed3bafa7f",
        "userId": "37e808bb-8f47-4a64-bb96-84a3df7b4550",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-03-25T10:26:47.345787+00:00",
        "endTime": "2024-03-25T11:33:47.345787+00:00",
        "distance": 22.7,
        "duration": 67,
        "riskScore": 48.97
    },
    {
        "tripId": "93e4843c-d484-40d7-8671-7eca15955ea7",
        "userId": "37e808bb-8f47-4a64-bb96-84a3df7b4550",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-05-11T08:31:22.895483+00:00",
        "endTime": "2024-05-11T08:36:22.895483+00:00",
        "distance": 35.76,
        "duration": 5,
        "riskScore": 42.67
    },
    {
        "tripId": "0d85eb9f-eb6e-4df8-aca0-48f8bacd6f1f",
        "userId": "37e808bb-8f47-4a64-bb96-84a3df7b4550",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-03-25T20:43:08.910002+00:00",
        "endTime": "2024-03-25T21:03:08.910002+00:00",
        "distance": 19.37,
        "duration": 20,
        "riskScore": 44.9
    },
    {
        "tripId": "c8631174-e950-4ace-983b-6087b1540017",
        "userId": "37e808bb-8f47-4a64-bb96-84a3df7b4550",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-02-27T02:51:50.468508+00:00",
        "endTime": "2024-02-27T02:56:50.468508+00:00",
        "distance": 44.1,
        "duration": 5,
        "riskScore": 49.79
    },
    {
        "tripId": "4c5f3751-9ab1-4f33-913a-41be8266d513",
        "userId": "37e808bb-8f47-4a64-bb96-84a3df7b4550",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-03-30T21:54:06.421754+00:00",
        "endTime": "2024-03-30T23:08:06.421754+00:00",
        "distance": 42.15,
        "duration": 74,
        "riskScore": 58.05
    },
    {
        "tripId": "c3ffa503-e7a2-4fc8-8c2d-ab936f60b35f",
        "userId": "c9864a17-ffa9-444f-ab2b-811da8ac6f83",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-02-09T20:08:22.226856+00:00",
        "endTime": "2024-02-09T20:17:22.226856+00:00",
        "distance": 23.21,
        "duration": 9,
        "riskScore": 44.56
    },
    {
        "tripId": "36e12da0-f10b-4a42-85f9-5a60806532f9",
        "userId": "c9864a17-ffa9-444f-ab2b-811da8ac6f83",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-05-02T03:42:26.980155+00:00",
        "endTime": "2024-05-02T05:14:26.980155+00:00",
        "distance": 17.66,
        "duration": 92,
        "riskScore": 64.77
    },
    {
        "tripId": "a810c006-0758-489f-ae9a-9a81c5f30aca",
        "userId": "c9864a17-ffa9-444f-ab2b-811da8ac6f83",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-20T19:09:20.912701+00:00",
        "endTime": "2024-06-20T19:19:20.912701+00:00",
        "distance": 17.42,
        "duration": 10,
        "riskScore": 62.07
    },
    {
        "tripId": "a888b45d-7248-4e4d-b003-a4da66af879c",
        "userId": "c9864a17-ffa9-444f-ab2b-811da8ac6f83",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-05-07T16:18:59.598794+00:00",
        "endTime": "2024-05-07T17:13:59.598794+00:00",
        "distance": 23.82,
        "duration": 55,
        "riskScore": 55.33
    },
    {
        "tripId": "177c3b01-6c1c-4d58-9d14-7d06a4255db8",
        "userId": "c9864a17-ffa9-444f-ab2b-811da8ac6f83",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-06-17T16:39:05.143951+00:00",
        "endTime": "2024-06-17T17:17:05.143951+00:00",
        "distance": 8.91,
        "duration": 38,
        "riskScore": 60.38
    },
    {
        "tripId": "2b14b2d1-208c-49ab-bcc1-0d6535d5e7fa",
        "userId": "c9864a17-ffa9-444f-ab2b-811da8ac6f83",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-04-11T15:44:17.409503+00:00",
        "endTime": "2024-04-11T17:33:17.409503+00:00",
        "distance": 31.67,
        "duration": 109,
        "riskScore": 52.59
    },
    {
        "tripId": "d42b33da-7c9a-4c97-91ea-59e74bed721a",
        "userId": "c9864a17-ffa9-444f-ab2b-811da8ac6f83",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-05-31T09:39:27.914311+00:00",
        "endTime": "2024-05-31T11:06:27.914311+00:00",
        "distance": 32.05,
        "duration": 87,
        "riskScore": 53.37
    },
    {
        "tripId": "945183ff-98a3-4e3e-b449-e29759e22894",
        "userId": "c9864a17-ffa9-444f-ab2b-811da8ac6f83",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-06-15T10:46:03.597711+00:00",
        "endTime": "2024-06-15T12:16:03.597711+00:00",
        "distance": 41.43,
        "duration": 90,
        "riskScore": 46.39
    },
    {
        "tripId": "03118328-a263-45ef-b4c5-94e44e4d8b91",
        "userId": "c9864a17-ffa9-444f-ab2b-811da8ac6f83",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-01-19T09:27:41.536239+00:00",
        "endTime": "2024-01-19T10:24:41.536239+00:00",
        "distance": 2.47,
        "duration": 57,
        "riskScore": 68.05
    },
    {
        "tripId": "15727d46-3fa9-47f3-aee8-d12aecb0368d",
        "userId": "c9864a17-ffa9-444f-ab2b-811da8ac6f83",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-01-04T04:24:34.707059+00:00",
        "endTime": "2024-01-04T06:07:34.707059+00:00",
        "distance": 41.26,
        "duration": 103,
        "riskScore": 49.58
    },
    {
        "tripId": "15530f19-8fdb-477d-ab30-7231bf001cf4",
        "userId": "38a9d17b-8ffc-4c56-a5dc-095275184bed",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-02-11T10:48:58.732164+00:00",
        "endTime": "2024-02-11T11:28:58.732164+00:00",
        "distance": 28.84,
        "duration": 40,
        "riskScore": 56.43
    },
    {
        "tripId": "351c1c66-2bcf-455e-a0bd-cfa386ec14dd",
        "userId": "38a9d17b-8ffc-4c56-a5dc-095275184bed",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-04-12T14:51:53.159947+00:00",
        "endTime": "2024-04-12T15:34:53.159947+00:00",
        "distance": 13.82,
        "duration": 43,
        "riskScore": 46.38
    },
    {
        "tripId": "66ff6c73-54a4-4496-a7c3-50ac59e20818",
        "userId": "38a9d17b-8ffc-4c56-a5dc-095275184bed",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-14T21:34:13.366365+00:00",
        "endTime": "2024-01-14T22:09:13.366365+00:00",
        "distance": 39.37,
        "duration": 35,
        "riskScore": 61.17
    },
    {
        "tripId": "09093b26-0185-41bc-8759-21d56c580adf",
        "userId": "38a9d17b-8ffc-4c56-a5dc-095275184bed",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-02-07T14:18:33.106251+00:00",
        "endTime": "2024-02-07T14:40:33.106251+00:00",
        "distance": 46.26,
        "duration": 22,
        "riskScore": 46.25
    },
    {
        "tripId": "10468213-aa74-4f8a-9650-731542d31665",
        "userId": "38a9d17b-8ffc-4c56-a5dc-095275184bed",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-06-25T11:55:07.656438+00:00",
        "endTime": "2024-06-25T12:11:07.656438+00:00",
        "distance": 16.29,
        "duration": 16,
        "riskScore": 62.16
    },
    {
        "tripId": "76445900-b848-44fe-a911-ca3507a2842a",
        "userId": "38a9d17b-8ffc-4c56-a5dc-095275184bed",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-01-28T22:34:22.620051+00:00",
        "endTime": "2024-01-28T23:15:22.620051+00:00",
        "distance": 32.51,
        "duration": 41,
        "riskScore": 52.45
    },
    {
        "tripId": "cb01b86c-3b6a-41ff-a1eb-d05d1b0533a2",
        "userId": "38a9d17b-8ffc-4c56-a5dc-095275184bed",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-22T06:36:46.258513+00:00",
        "endTime": "2024-01-22T07:13:46.258513+00:00",
        "distance": 35.93,
        "duration": 37,
        "riskScore": 55.97
    },
    {
        "tripId": "d8719b86-dbdd-449e-8da0-a90f106ecd2f",
        "userId": "38a9d17b-8ffc-4c56-a5dc-095275184bed",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-05-01T10:06:39.016128+00:00",
        "endTime": "2024-05-01T11:42:39.016128+00:00",
        "distance": 30.69,
        "duration": 96,
        "riskScore": 40.68
    },
    {
        "tripId": "5e9ba2f7-088f-4895-adb4-5ffddd436c38",
        "userId": "38a9d17b-8ffc-4c56-a5dc-095275184bed",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-02-07T09:41:39.596693+00:00",
        "endTime": "2024-02-07T10:36:39.596693+00:00",
        "distance": 3.17,
        "duration": 55,
        "riskScore": 62.88
    },
    {
        "tripId": "06d89b5e-9036-4a98-a6ea-642728a072d0",
        "userId": "38a9d17b-8ffc-4c56-a5dc-095275184bed",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-04-11T04:35:44.017916+00:00",
        "endTime": "2024-04-11T04:49:44.017916+00:00",
        "distance": 18.43,
        "duration": 14,
        "riskScore": 65.6
    },
    {
        "tripId": "a896e74e-a159-4cae-8246-fe174bf8d60c",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-01-07T13:23:49.73108+00:00",
        "endTime": "2024-01-07T14:22:49.73108+00:00",
        "distance": 40.53,
        "duration": 59,
        "riskScore": 58.05
    },
    {
        "tripId": "d0c9f8aa-c3dc-4688-9689-1dda74e37be8",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-05-18T06:43:00.516794+00:00",
        "endTime": "2024-05-18T07:12:00.516794+00:00",
        "distance": 9.85,
        "duration": 29,
        "riskScore": 40.93
    },
    {
        "tripId": "be8f6414-fafe-4062-b1e7-e7acfe187753",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-05-29T01:35:46.850835+00:00",
        "endTime": "2024-05-29T02:10:46.850835+00:00",
        "distance": 46.19,
        "duration": 35,
        "riskScore": 54.37
    },
    {
        "tripId": "a34e5f12-0bc3-4ec7-825f-e9f27d7b54ac",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-03-01T10:14:33.696885+00:00",
        "endTime": "2024-03-01T11:16:33.696885+00:00",
        "distance": 48.67,
        "duration": 62,
        "riskScore": 45.75
    },
    {
        "tripId": "e5bb80c1-531b-4668-85b5-7e85a906fa10",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-03-15T22:58:14.039524+00:00",
        "endTime": "2024-03-15T23:09:14.039524+00:00",
        "distance": 23.1,
        "duration": 11,
        "riskScore": 46.82
    },
    {
        "tripId": "27cf1675-2b26-4c30-a3c5-b82a98fb2585",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-04-07T06:51:38.746853+00:00",
        "endTime": "2024-04-07T08:29:38.746853+00:00",
        "distance": 39.84,
        "duration": 98,
        "riskScore": 53.21
    },
    {
        "tripId": "bca80d50-70dd-4cb2-a04e-1bd859e2ccf0",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-05-28T11:06:23.820744+00:00",
        "endTime": "2024-05-28T11:41:23.820744+00:00",
        "distance": 11.9,
        "duration": 35,
        "riskScore": 40.21
    },
    {
        "tripId": "c41ddbeb-96db-454a-ae0c-0122620a35d6",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-01-06T17:06:29.197449+00:00",
        "endTime": "2024-01-06T17:43:29.197449+00:00",
        "distance": 28.7,
        "duration": 37,
        "riskScore": 55.82
    },
    {
        "tripId": "4db32cd2-1bb7-498a-aa5e-4e7cdb79d871",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-06-28T03:57:34.65718+00:00",
        "endTime": "2024-06-28T04:11:34.65718+00:00",
        "distance": 40.33,
        "duration": 14,
        "riskScore": 47.47
    },
    {
        "tripId": "6ea271be-1142-4a71-9136-e5618f48a023",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-03-25T23:32:19.192311+00:00",
        "endTime": "2024-03-26T01:02:19.192311+00:00",
        "distance": 14.95,
        "duration": 90,
        "riskScore": 41.66
    },
    {
        "tripId": "59c37604-ebb4-46f0-b120-fad4ddd8e85b",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-01-23T03:12:31.378372+00:00",
        "endTime": "2024-01-23T03:35:31.378372+00:00",
        "distance": 33.18,
        "duration": 23,
        "riskScore": 52.91
    },
    {
        "tripId": "5c890531-e76c-4fc3-8c50-f16cb1f03d59",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-07-01T20:47:00.085729+00:00",
        "endTime": "2024-07-01T21:56:00.085729+00:00",
        "distance": 42.14,
        "duration": 69,
        "riskScore": 45.4
    },
    {
        "tripId": "e102f462-24ee-4e4c-a3f7-1c6a56c04d87",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-04-29T03:48:30.610687+00:00",
        "endTime": "2024-04-29T05:39:30.610687+00:00",
        "distance": 29.15,
        "duration": 111,
        "riskScore": 49.01
    },
    {
        "tripId": "83d70c17-fcaa-4ab9-a0ef-365675586898",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-30T19:52:28.224876+00:00",
        "endTime": "2024-06-30T20:22:28.224876+00:00",
        "distance": 31.49,
        "duration": 30,
        "riskScore": 42.07
    },
    {
        "tripId": "6b86fb39-b7db-4c62-aede-4308c9bf6716",
        "userId": "cf6a7819-0bc0-427e-8132-29cf2ec86f32",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-04-10T12:24:08.168699+00:00",
        "endTime": "2024-04-10T13:05:08.168699+00:00",
        "distance": 45.78,
        "duration": 41,
        "riskScore": 48.79
    },
    {
        "tripId": "1ec67bd3-30d7-44a6-927c-d65afac7e722",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-05-14T01:54:26.122412+00:00",
        "endTime": "2024-05-14T03:35:26.122412+00:00",
        "distance": 33.42,
        "duration": 101,
        "riskScore": 58.3
    },
    {
        "tripId": "b9fb4b56-9b88-4e91-bb6c-bb7b4246472a",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-02-28T01:47:35.615924+00:00",
        "endTime": "2024-02-28T02:18:35.615924+00:00",
        "distance": 45.69,
        "duration": 31,
        "riskScore": 61.07
    },
    {
        "tripId": "b27ebb92-8ed9-4a26-89ff-ef5750d1ca95",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-06-25T03:14:08.995515+00:00",
        "endTime": "2024-06-25T04:48:08.995515+00:00",
        "distance": 34.7,
        "duration": 94,
        "riskScore": 63.87
    },
    {
        "tripId": "f9cf0537-6524-4697-9a63-97b268fa5f0a",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-03-23T16:22:59.123874+00:00",
        "endTime": "2024-03-23T18:03:59.123874+00:00",
        "distance": 22.95,
        "duration": 101,
        "riskScore": 65.92
    },
    {
        "tripId": "d095442b-b055-4f8c-8519-e3fb3ae21553",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-06-04T15:55:40.451292+00:00",
        "endTime": "2024-06-04T17:41:40.451292+00:00",
        "distance": 19.6,
        "duration": 106,
        "riskScore": 62.35
    },
    {
        "tripId": "ea5a19cf-3acb-4b6d-bd81-6273c3d6069f",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-03-02T08:08:36.946754+00:00",
        "endTime": "2024-03-02T09:34:36.946754+00:00",
        "distance": 7.04,
        "duration": 86,
        "riskScore": 51.2
    },
    {
        "tripId": "341092a0-d3e0-4bb3-b556-a91162eb5860",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-06-03T18:36:43.021841+00:00",
        "endTime": "2024-06-03T19:37:43.021841+00:00",
        "distance": 42.22,
        "duration": 61,
        "riskScore": 51.9
    },
    {
        "tripId": "c267a702-dd86-4bb3-bb06-936a7f037790",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-01-18T07:49:54.411078+00:00",
        "endTime": "2024-01-18T09:48:54.411078+00:00",
        "distance": 16.5,
        "duration": 119,
        "riskScore": 60.71
    },
    {
        "tripId": "1913c88f-5e2e-410b-97e5-2c10f1dccaf7",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-02-13T14:30:09.592299+00:00",
        "endTime": "2024-02-13T16:16:09.592299+00:00",
        "distance": 2.59,
        "duration": 106,
        "riskScore": 46.95
    },
    {
        "tripId": "1c096a51-ede0-490e-9b70-41e970067b76",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-03-22T03:51:38.285941+00:00",
        "endTime": "2024-03-22T04:21:38.285941+00:00",
        "distance": 5.14,
        "duration": 30,
        "riskScore": 54.07
    },
    {
        "tripId": "a2cd5e9b-63b0-4bf0-bbef-5327278ed0c3",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-02-20T23:18:42.861132+00:00",
        "endTime": "2024-02-21T01:05:42.861132+00:00",
        "distance": 30.95,
        "duration": 107,
        "riskScore": 49.42
    },
    {
        "tripId": "c6e94cb6-323a-448a-a2c7-709c503ef0a9",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-06-04T02:42:09.313561+00:00",
        "endTime": "2024-06-04T03:37:09.313561+00:00",
        "distance": 41.99,
        "duration": 55,
        "riskScore": 65.57
    },
    {
        "tripId": "a39fb16d-8b8d-45b6-a3e1-5359e349dfdd",
        "userId": "50f74535-1286-4ae5-8a71-7595b0b58796",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-05-08T16:12:17.403295+00:00",
        "endTime": "2024-05-08T16:21:17.403295+00:00",
        "distance": 3.12,
        "duration": 9,
        "riskScore": 56.23
    },
    {
        "tripId": "55f54f5d-9e22-45a2-a363-23778c134dee",
        "userId": "2ebb4a64-4af8-47de-9d5c-8b0e95461457",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-05-12T21:53:47.971102+00:00",
        "endTime": "2024-05-12T22:12:47.971102+00:00",
        "distance": 5.99,
        "duration": 19,
        "riskScore": 55.8
    },
    {
        "tripId": "6372de14-f22f-4352-88f5-1e26bd9c0caa",
        "userId": "2ebb4a64-4af8-47de-9d5c-8b0e95461457",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-06-09T15:54:59.887291+00:00",
        "endTime": "2024-06-09T17:46:59.887291+00:00",
        "distance": 10.53,
        "duration": 112,
        "riskScore": 44.65
    },
    {
        "tripId": "cf353870-b576-4372-ad78-f626906ec17b",
        "userId": "2ebb4a64-4af8-47de-9d5c-8b0e95461457",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-03-15T22:35:29.528617+00:00",
        "endTime": "2024-03-15T22:52:29.528617+00:00",
        "distance": 24.97,
        "duration": 17,
        "riskScore": 50.4
    },
    {
        "tripId": "ee988b5c-cd3e-4c35-9fed-0c157a237c94",
        "userId": "2ebb4a64-4af8-47de-9d5c-8b0e95461457",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-02-06T21:21:57.636424+00:00",
        "endTime": "2024-02-06T22:49:57.636424+00:00",
        "distance": 23.42,
        "duration": 88,
        "riskScore": 64.94
    },
    {
        "tripId": "27928f7f-46c7-445e-a267-95c35c969b2b",
        "userId": "2ebb4a64-4af8-47de-9d5c-8b0e95461457",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-02-17T10:21:53.8769+00:00",
        "endTime": "2024-02-17T11:58:53.8769+00:00",
        "distance": 20.5,
        "duration": 97,
        "riskScore": 48.08
    },
    {
        "tripId": "bd122433-1160-40a1-be8e-4015250851b9",
        "userId": "2ebb4a64-4af8-47de-9d5c-8b0e95461457",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-01-29T16:05:05.377941+00:00",
        "endTime": "2024-01-29T16:14:05.377941+00:00",
        "distance": 20,
        "duration": 9,
        "riskScore": 51.58
    },
    {
        "tripId": "3905bd58-fe67-4286-9034-827de3c4f890",
        "userId": "2ebb4a64-4af8-47de-9d5c-8b0e95461457",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-06-12T06:20:07.507092+00:00",
        "endTime": "2024-06-12T06:28:07.507092+00:00",
        "distance": 5.6,
        "duration": 8,
        "riskScore": 53
    },
    {
        "tripId": "d38ec3e9-3fd1-43ff-a3fb-d0a33ce3f313",
        "userId": "8e2f7343-2b80-4dc7-ac78-c6ec00d11e9b",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-06-22T03:32:59.515122+00:00",
        "endTime": "2024-06-22T05:19:59.515122+00:00",
        "distance": 30.76,
        "duration": 107,
        "riskScore": 47.54
    },
    {
        "tripId": "506756a5-1e23-4e33-858e-83e0ad7c8883",
        "userId": "8e2f7343-2b80-4dc7-ac78-c6ec00d11e9b",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-05-07T23:27:02.898146+00:00",
        "endTime": "2024-05-07T23:37:02.898146+00:00",
        "distance": 34.23,
        "duration": 10,
        "riskScore": 40.56
    },
    {
        "tripId": "a402f609-d764-449c-9f41-a0c8beb28d69",
        "userId": "8e2f7343-2b80-4dc7-ac78-c6ec00d11e9b",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-05-20T13:23:50.146974+00:00",
        "endTime": "2024-05-20T14:23:50.146974+00:00",
        "distance": 26.77,
        "duration": 60,
        "riskScore": 42.1
    },
    {
        "tripId": "d8d32fd9-30b8-4f96-a744-65b03db36885",
        "userId": "8e2f7343-2b80-4dc7-ac78-c6ec00d11e9b",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-06-01T08:10:54.07353+00:00",
        "endTime": "2024-06-01T10:04:54.07353+00:00",
        "distance": 15.96,
        "duration": 114,
        "riskScore": 66.72
    },
    {
        "tripId": "2789584d-6bfb-4611-8539-3f1a0159b5f4",
        "userId": "8e2f7343-2b80-4dc7-ac78-c6ec00d11e9b",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-03-27T03:34:35.808333+00:00",
        "endTime": "2024-03-27T04:53:35.808333+00:00",
        "distance": 29.7,
        "duration": 79,
        "riskScore": 44.55
    },
    {
        "tripId": "b6054722-cd3f-4cce-b93f-090feacfa6a2",
        "userId": "c1b40588-1749-48e4-886a-82e126311f13",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-22T18:36:47.343686+00:00",
        "endTime": "2024-01-22T20:26:47.343686+00:00",
        "distance": 15.43,
        "duration": 110,
        "riskScore": 47.17
    },
    {
        "tripId": "ade748f5-56d1-4c53-bc62-621e1bb59cbf",
        "userId": "c1b40588-1749-48e4-886a-82e126311f13",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-25T05:47:56.232549+00:00",
        "endTime": "2024-01-25T05:53:56.232549+00:00",
        "distance": 37.05,
        "duration": 6,
        "riskScore": 45.66
    },
    {
        "tripId": "d5118547-fe92-42e8-aa78-bdb1b9d28043",
        "userId": "c1b40588-1749-48e4-886a-82e126311f13",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-03-26T16:19:21.623206+00:00",
        "endTime": "2024-03-26T17:00:21.623206+00:00",
        "distance": 11.69,
        "duration": 41,
        "riskScore": 51.03
    },
    {
        "tripId": "61c49fca-0569-4739-9716-5e3f95a3d0ff",
        "userId": "c1b40588-1749-48e4-886a-82e126311f13",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-09T12:55:51.042391+00:00",
        "endTime": "2024-06-09T13:39:51.042391+00:00",
        "distance": 23.79,
        "duration": 44,
        "riskScore": 54.01
    },
    {
        "tripId": "23a32002-8d6f-43e5-9105-0d47531f8bc0",
        "userId": "c1b40588-1749-48e4-886a-82e126311f13",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-06-14T13:05:56.491744+00:00",
        "endTime": "2024-06-14T13:21:56.491744+00:00",
        "distance": 13.05,
        "duration": 16,
        "riskScore": 68.26
    },
    {
        "tripId": "d4faa5bb-6a7f-4c57-80cb-c60de812bf09",
        "userId": "c1b40588-1749-48e4-886a-82e126311f13",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-03-05T10:17:15.266856+00:00",
        "endTime": "2024-03-05T11:26:15.266856+00:00",
        "distance": 48.84,
        "duration": 69,
        "riskScore": 69.16
    },
    {
        "tripId": "2fe8fd90-d460-4b74-9c32-dbfc1a63d862",
        "userId": "c1b40588-1749-48e4-886a-82e126311f13",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-01-12T09:10:54.547133+00:00",
        "endTime": "2024-01-12T09:22:54.547133+00:00",
        "distance": 23.41,
        "duration": 12,
        "riskScore": 62.51
    },
    {
        "tripId": "4003f210-5a1c-4def-96ce-144b6b25c133",
        "userId": "c1b40588-1749-48e4-886a-82e126311f13",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-07-06T09:08:02.574373+00:00",
        "endTime": "2024-07-06T10:25:02.574373+00:00",
        "distance": 39.74,
        "duration": 77,
        "riskScore": 60.97
    },
    {
        "tripId": "e772a1da-f9aa-4c61-9c59-da5393cdef81",
        "userId": "c1b40588-1749-48e4-886a-82e126311f13",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-04-30T09:48:46.975556+00:00",
        "endTime": "2024-04-30T11:14:46.975556+00:00",
        "distance": 46.95,
        "duration": 86,
        "riskScore": 46.82
    },
    {
        "tripId": "bb7d2a28-5fe7-4c05-8233-c02f1cf062e2",
        "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-06-03T17:55:57.412042+00:00",
        "endTime": "2024-06-03T18:51:57.412042+00:00",
        "distance": 23.89,
        "duration": 56,
        "riskScore": 62.68
    },
    {
        "tripId": "e24721f8-2c8d-47b6-8661-d2255e6e23c1",
        "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-02-16T13:09:55.166298+00:00",
        "endTime": "2024-02-16T14:14:55.166298+00:00",
        "distance": 25.88,
        "duration": 65,
        "riskScore": 67.44
    },
    {
        "tripId": "b08eed76-bf65-4f7e-a9f1-4e9a86f28c4a",
        "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-03-30T15:34:53.156885+00:00",
        "endTime": "2024-03-30T16:55:53.156885+00:00",
        "distance": 39.25,
        "duration": 81,
        "riskScore": 68.68
    },
    {
        "tripId": "b661d4bc-c4cc-4ac0-85fa-7f2cabd0aa6f",
        "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-20T22:22:04.194724+00:00",
        "endTime": "2024-06-20T22:39:04.194724+00:00",
        "distance": 43.25,
        "duration": 17,
        "riskScore": 61.29
    },
    {
        "tripId": "5647cd21-4d0c-494a-9464-e6aaf19ba653",
        "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-03-31T08:34:37.53304+00:00",
        "endTime": "2024-03-31T10:25:37.53304+00:00",
        "distance": 37.85,
        "duration": 111,
        "riskScore": 54.88
    },
    {
        "tripId": "564be3c8-887c-49a8-9ded-34a4b8022ba4",
        "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-03-13T23:02:27.508034+00:00",
        "endTime": "2024-03-14T00:25:27.508034+00:00",
        "distance": 18.1,
        "duration": 83,
        "riskScore": 47.47
    },
    {
        "tripId": "0a57c7aa-b066-49f7-87fb-3c84d017daa9",
        "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-03-21T11:40:34.708892+00:00",
        "endTime": "2024-03-21T12:52:34.708892+00:00",
        "distance": 23.66,
        "duration": 72,
        "riskScore": 51.47
    },
    {
        "tripId": "776d59b6-eedd-48ef-9b55-297e3637376c",
        "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-03-24T16:02:58.528163+00:00",
        "endTime": "2024-03-24T16:51:58.528163+00:00",
        "distance": 21.5,
        "duration": 49,
        "riskScore": 40.03
    },
    {
        "tripId": "362e9317-5917-43be-a9ef-ad8cf4739c8f",
        "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-03-12T04:09:48.201088+00:00",
        "endTime": "2024-03-12T04:59:48.201088+00:00",
        "distance": 3.19,
        "duration": 50,
        "riskScore": 58.14
    },
    {
        "tripId": "f799e84f-dc64-4e73-950b-bb294f7c7411",
        "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-05-12T05:43:52.725167+00:00",
        "endTime": "2024-05-12T06:03:52.725167+00:00",
        "distance": 13.26,
        "duration": 20,
        "riskScore": 60.05
    },
    {
        "tripId": "5171be0a-2dbc-4a63-ba33-19ed3d5ee838",
        "userId": "c38a22a5-2bc8-45a9-afe6-0f465c44ac1d",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-04-05T18:59:08.64851+00:00",
        "endTime": "2024-04-05T20:36:08.64851+00:00",
        "distance": 19.23,
        "duration": 97,
        "riskScore": 65.19
    },
    {
        "tripId": "52de9ce4-3a1b-4680-a8e2-2f722181a881",
        "userId": "3608b5e9-7436-459f-83ae-21c345741c7c",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-06-26T22:06:17.591326+00:00",
        "endTime": "2024-06-26T23:58:17.591326+00:00",
        "distance": 30.97,
        "duration": 112,
        "riskScore": 60.73
    },
    {
        "tripId": "b4ec37ab-fe2a-423f-ab5d-c5589a7e69c6",
        "userId": "3608b5e9-7436-459f-83ae-21c345741c7c",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-05-17T19:10:09.309103+00:00",
        "endTime": "2024-05-17T20:40:09.309103+00:00",
        "distance": 6.99,
        "duration": 90,
        "riskScore": 44.96
    },
    {
        "tripId": "3d496d38-afe1-46cc-b212-4ea06628e016",
        "userId": "3608b5e9-7436-459f-83ae-21c345741c7c",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-02-23T10:04:43.219304+00:00",
        "endTime": "2024-02-23T10:29:43.219304+00:00",
        "distance": 9.25,
        "duration": 25,
        "riskScore": 68.52
    },
    {
        "tripId": "5a11eab3-a097-4d4d-a1c9-a27a1599d371",
        "userId": "3608b5e9-7436-459f-83ae-21c345741c7c",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-02-11T23:31:51.466326+00:00",
        "endTime": "2024-02-12T00:05:51.466326+00:00",
        "distance": 47.09,
        "duration": 34,
        "riskScore": 55
    },
    {
        "tripId": "b5d151b1-da2b-44f3-807c-41893897996c",
        "userId": "3608b5e9-7436-459f-83ae-21c345741c7c",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-04-27T23:37:16.416847+00:00",
        "endTime": "2024-04-28T01:16:16.416847+00:00",
        "distance": 18.83,
        "duration": 99,
        "riskScore": 63.48
    },
    {
        "tripId": "ebae97cc-a322-4476-a93c-708400292a6a",
        "userId": "3608b5e9-7436-459f-83ae-21c345741c7c",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-05-28T23:50:01.104753+00:00",
        "endTime": "2024-05-29T00:16:01.104753+00:00",
        "distance": 29.38,
        "duration": 26,
        "riskScore": 58.39
    },
    {
        "tripId": "2470adc2-1331-401e-a070-3fb548f3c113",
        "userId": "3608b5e9-7436-459f-83ae-21c345741c7c",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-01-17T06:42:51.814579+00:00",
        "endTime": "2024-01-17T07:49:51.814579+00:00",
        "distance": 49.97,
        "duration": 67,
        "riskScore": 57.8
    },
    {
        "tripId": "b2479515-b93c-4fa7-89af-87d6584dc1b7",
        "userId": "3608b5e9-7436-459f-83ae-21c345741c7c",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-05-10T08:59:25.544373+00:00",
        "endTime": "2024-05-10T10:00:25.544373+00:00",
        "distance": 15.99,
        "duration": 61,
        "riskScore": 56.83
    },
    {
        "tripId": "2976aefa-06ec-47fd-bc01-3705addad36a",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-05-05T23:12:35.910633+00:00",
        "endTime": "2024-05-06T00:49:35.910633+00:00",
        "distance": 21.94,
        "duration": 97,
        "riskScore": 66.49
    },
    {
        "tripId": "59c37ab5-2581-499b-b168-b3b4220d107f",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-01-20T17:53:28.910499+00:00",
        "endTime": "2024-01-20T18:56:28.910499+00:00",
        "distance": 22.45,
        "duration": 63,
        "riskScore": 41.08
    },
    {
        "tripId": "06b101be-b8ff-44af-a739-1362b67ee514",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-12T13:22:09.974748+00:00",
        "endTime": "2024-06-12T15:09:09.974748+00:00",
        "distance": 25.38,
        "duration": 107,
        "riskScore": 57.29
    },
    {
        "tripId": "1eb03b9d-ed81-490d-81a8-43fb4b532342",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "startTime": "2024-05-07T10:29:45.357637+00:00",
        "endTime": "2024-05-07T11:52:45.357637+00:00",
        "distance": 40.58,
        "duration": 83,
        "riskScore": 64.77
    },
    {
        "tripId": "266696d3-b4c4-4df6-88f7-20e1e5799e74",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-06-27T01:57:02.304162+00:00",
        "endTime": "2024-06-27T03:15:02.304162+00:00",
        "distance": 5.25,
        "duration": 78,
        "riskScore": 66
    },
    {
        "tripId": "a1450227-9e55-4324-ac9a-acd8979685e9",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-02-17T00:51:52.548472+00:00",
        "endTime": "2024-02-17T01:17:52.548472+00:00",
        "distance": 33.49,
        "duration": 26,
        "riskScore": 64.51
    },
    {
        "tripId": "460bd78a-1644-4caf-a529-bc98c1099119",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-01-26T19:34:45.110734+00:00",
        "endTime": "2024-01-26T20:28:45.110734+00:00",
        "distance": 8.2,
        "duration": 54,
        "riskScore": 56.87
    },
    {
        "tripId": "272a29e7-87e4-462d-8368-22d20e2f8e33",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-01-25T18:25:02.213675+00:00",
        "endTime": "2024-01-25T18:38:02.213675+00:00",
        "distance": 45.08,
        "duration": 13,
        "riskScore": 51.32
    },
    {
        "tripId": "4e54c76f-e010-49fd-a905-de6206ea5bf6",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-05-27T11:02:41.527172+00:00",
        "endTime": "2024-05-27T11:40:41.527172+00:00",
        "distance": 37.65,
        "duration": 38,
        "riskScore": 45.45
    },
    {
        "tripId": "0580084e-22e8-403f-af6a-005486dfe090",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-01-13T22:39:01.964987+00:00",
        "endTime": "2024-01-13T22:47:01.964987+00:00",
        "distance": 11.89,
        "duration": 8,
        "riskScore": 50.16
    },
    {
        "tripId": "91b04ba9-12fb-4a6d-8c54-ca3dbc546662",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-03-17T19:49:59.277431+00:00",
        "endTime": "2024-03-17T21:22:59.277431+00:00",
        "distance": 26.04,
        "duration": 93,
        "riskScore": 43.25
    },
    {
        "tripId": "388dd2b3-3438-42d0-ab7a-02cc3b65b0af",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-02-16T06:11:34.86993+00:00",
        "endTime": "2024-02-16T06:20:34.86993+00:00",
        "distance": 17.98,
        "duration": 9,
        "riskScore": 53.28
    },
    {
        "tripId": "0eb1412c-52d8-4e19-9fcf-e72e30a9bf9c",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-06-03T09:24:19.304348+00:00",
        "endTime": "2024-06-03T10:55:19.304348+00:00",
        "distance": 43.15,
        "duration": 91,
        "riskScore": 41.17
    },
    {
        "tripId": "d75cbec2-3db2-403a-a669-f0142bfb127f",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-02-10T19:40:38.630635+00:00",
        "endTime": "2024-02-10T21:21:38.630635+00:00",
        "distance": 43.09,
        "duration": 101,
        "riskScore": 62.49
    },
    {
        "tripId": "a3edd19a-1a31-4748-adc8-9d8226d30daf",
        "userId": "6c04f758-2dbc-473c-9fc4-d50bf6e4dc67",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "startTime": "2024-06-03T12:52:40.794163+00:00",
        "endTime": "2024-06-03T13:36:40.794163+00:00",
        "distance": 13.79,
        "duration": 44,
        "riskScore": 46.13
    },
    {
        "tripId": "c994876b-ca91-4bbe-935c-6ea79d392980",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-03-15T06:08:14.955309+00:00",
        "endTime": "2024-03-15T07:14:14.955309+00:00",
        "distance": 14.37,
        "duration": 66,
        "riskScore": 58.59
    },
    {
        "tripId": "a7c78781-b218-4d71-ab91-cbcf3c7ef267",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-05-20T19:25:48.533295+00:00",
        "endTime": "2024-05-20T19:50:48.533295+00:00",
        "distance": 32.61,
        "duration": 25,
        "riskScore": 61.48
    },
    {
        "tripId": "7189d886-081d-49bf-9af8-6f9615ce08ad",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-17T10:50:39.372293+00:00",
        "endTime": "2024-06-17T10:55:39.372293+00:00",
        "distance": 35.19,
        "duration": 5,
        "riskScore": 47.96
    },
    {
        "tripId": "98404efd-557c-4a25-abf7-b303504b9bb5",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-04-26T09:10:32.557587+00:00",
        "endTime": "2024-04-26T09:43:32.557587+00:00",
        "distance": 31.48,
        "duration": 33,
        "riskScore": 40.63
    },
    {
        "tripId": "736eadd4-5569-434e-b506-baa5f1b7a7bf",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-03-21T14:01:21.296337+00:00",
        "endTime": "2024-03-21T14:23:21.296337+00:00",
        "distance": 20.16,
        "duration": 22,
        "riskScore": 48.93
    },
    {
        "tripId": "59b20e93-e4d2-4ac3-bf4b-e54925636704",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-18T06:55:49.538858+00:00",
        "endTime": "2024-06-18T07:50:49.538858+00:00",
        "distance": 25.61,
        "duration": 55,
        "riskScore": 41.34
    },
    {
        "tripId": "2b771022-ee83-4207-8096-2210cd0a8e7f",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-29T20:43:12.399412+00:00",
        "endTime": "2024-06-29T20:48:12.399412+00:00",
        "distance": 33.4,
        "duration": 5,
        "riskScore": 40.26
    },
    {
        "tripId": "2e2c8245-3bad-49ee-bbda-8e3974f375b8",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-03-08T19:39:18.835536+00:00",
        "endTime": "2024-03-08T20:33:18.835536+00:00",
        "distance": 42.8,
        "duration": 54,
        "riskScore": 47.98
    },
    {
        "tripId": "7e0663e8-c8c4-4f87-b878-f97e9830c939",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-04-15T18:14:57.714677+00:00",
        "endTime": "2024-04-15T19:25:57.714677+00:00",
        "distance": 45.89,
        "duration": 71,
        "riskScore": 58.35
    },
    {
        "tripId": "81080181-c599-468a-b0d1-eaba9fe05a0d",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-04-20T16:12:56.113459+00:00",
        "endTime": "2024-04-20T17:48:56.113459+00:00",
        "distance": 48.92,
        "duration": 96,
        "riskScore": 43.63
    },
    {
        "tripId": "bfa57a09-0119-4404-a8c2-8849ab7770b2",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-05-13T22:33:53.416422+00:00",
        "endTime": "2024-05-13T22:58:53.416422+00:00",
        "distance": 27.45,
        "duration": 25,
        "riskScore": 67.8
    },
    {
        "tripId": "25fb29c0-01a2-4667-be07-a5d268840dda",
        "userId": "b865437a-fc9e-4308-91b0-df19cb08369c",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-03-20T05:36:52.364539+00:00",
        "endTime": "2024-03-20T06:32:52.364539+00:00",
        "distance": 41.62,
        "duration": 56,
        "riskScore": 51.01
    },
    {
        "tripId": "ef1b0120-1526-43f8-9a60-ca429d4fa341",
        "userId": "fc03d54c-c125-4f57-8719-b14b7743d4df",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-01-08T14:28:00.031903+00:00",
        "endTime": "2024-01-08T15:56:00.031903+00:00",
        "distance": 21.88,
        "duration": 88,
        "riskScore": 45.17
    },
    {
        "tripId": "bf024ca8-7124-40da-8360-98c2094994d0",
        "userId": "fc03d54c-c125-4f57-8719-b14b7743d4df",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-02-23T20:39:31.253006+00:00",
        "endTime": "2024-02-23T21:10:31.253006+00:00",
        "distance": 47.57,
        "duration": 31,
        "riskScore": 64.05
    },
    {
        "tripId": "04a43897-fda3-4398-b9fa-7dc5047999c6",
        "userId": "fc03d54c-c125-4f57-8719-b14b7743d4df",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-02-14T18:11:51.806853+00:00",
        "endTime": "2024-02-14T19:59:51.806853+00:00",
        "distance": 24.21,
        "duration": 108,
        "riskScore": 65.94
    },
    {
        "tripId": "039ff490-58e0-42b9-9100-167f25a3ce4b",
        "userId": "fc03d54c-c125-4f57-8719-b14b7743d4df",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-03-29T09:49:42.591505+00:00",
        "endTime": "2024-03-29T10:26:42.591505+00:00",
        "distance": 34.99,
        "duration": 37,
        "riskScore": 47.82
    },
    {
        "tripId": "af22b65e-677e-41e3-8e47-e8b475f0aeaa",
        "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-01-12T19:35:02.106878+00:00",
        "endTime": "2024-01-12T20:20:02.106878+00:00",
        "distance": 38.62,
        "duration": 45,
        "riskScore": 61.4
    },
    {
        "tripId": "bf3682be-1886-4c68-8896-30a9c8394209",
        "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-07-04T04:56:47.108274+00:00",
        "endTime": "2024-07-04T05:52:47.108274+00:00",
        "distance": 47.48,
        "duration": 56,
        "riskScore": 68.22
    },
    {
        "tripId": "5f9753eb-999e-453b-b20e-924c14d1d3d2",
        "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
        "startLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-03-28T10:11:20.392605+00:00",
        "endTime": "2024-03-28T10:39:20.392605+00:00",
        "distance": 40.57,
        "duration": 28,
        "riskScore": 40.25
    },
    {
        "tripId": "bb88b657-b5af-41f9-84b2-7110e2ae5913",
        "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-04-04T10:25:25.322989+00:00",
        "endTime": "2024-04-04T11:29:25.322989+00:00",
        "distance": 27.89,
        "duration": 64,
        "riskScore": 65.85
    },
    {
        "tripId": "5f62607a-7fe6-4389-9f0b-2959b8c3fe1c",
        "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
        "startLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-04-05T10:40:37.119725+00:00",
        "endTime": "2024-04-05T11:30:37.119725+00:00",
        "distance": 33.43,
        "duration": 50,
        "riskScore": 66.2
    },
    {
        "tripId": "73d7aa7a-a8e8-4b3d-b4eb-bada9c7e2286",
        "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-06-11T07:06:43.457087+00:00",
        "endTime": "2024-06-11T08:40:43.457087+00:00",
        "distance": 27.19,
        "duration": 94,
        "riskScore": 41.21
    },
    {
        "tripId": "4da742d0-1261-45af-908d-92dd49f5b1c8",
        "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-05-21T17:10:19.416893+00:00",
        "endTime": "2024-05-21T18:59:19.416893+00:00",
        "distance": 25.31,
        "duration": 109,
        "riskScore": 49.92
    },
    {
        "tripId": "3a88c7eb-1a3d-4469-a66a-4f82dcd2d62a",
        "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-01-12T00:09:24.063049+00:00",
        "endTime": "2024-01-12T00:22:24.063049+00:00",
        "distance": 17.32,
        "duration": 13,
        "riskScore": 67.72
    },
    {
        "tripId": "40a06cc3-4526-4d66-bcd3-d259af18e8e5",
        "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-02-15T22:39:55.225037+00:00",
        "endTime": "2024-02-16T00:19:55.225037+00:00",
        "distance": 38.85,
        "duration": 100,
        "riskScore": 42.26
    },
    {
        "tripId": "a44b0f66-fd9e-4ea0-a492-46e43c30a96c",
        "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-01-03T22:21:35.235535+00:00",
        "endTime": "2024-01-03T22:37:35.235535+00:00",
        "distance": 5.43,
        "duration": 16,
        "riskScore": 61.58
    },
    {
        "tripId": "62aa1e2b-ad3e-43d8-b2ed-d0374a73711f",
        "userId": "8cc8704b-d59f-422e-a4c9-861368b25d27",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "startTime": "2024-01-22T03:47:47.276373+00:00",
        "endTime": "2024-01-22T04:59:47.276373+00:00",
        "distance": 3.33,
        "duration": 72,
        "riskScore": 65.4
    },
    {
        "tripId": "7a95401e-4339-46f5-b08e-0acdb3c0a939",
        "userId": "d4c938b6-b4ff-47cc-ad41-0ba38e99bbc3",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-01-30T22:58:47.813505+00:00",
        "endTime": "2024-01-30T23:14:47.813505+00:00",
        "distance": 26.3,
        "duration": 16,
        "riskScore": 40.07
    },
    {
        "tripId": "dc894355-d205-4fb7-a52e-01c74f9ddafa",
        "userId": "d4c938b6-b4ff-47cc-ad41-0ba38e99bbc3",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-04-05T16:44:48.102342+00:00",
        "endTime": "2024-04-05T18:12:48.102342+00:00",
        "distance": 32.49,
        "duration": 88,
        "riskScore": 42.29
    },
    {
        "tripId": "1cad8ee0-a485-4050-aa95-6cd1e4bd13d8",
        "userId": "d4c938b6-b4ff-47cc-ad41-0ba38e99bbc3",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-06-27T22:21:58.909516+00:00",
        "endTime": "2024-06-27T22:45:58.909516+00:00",
        "distance": 43.08,
        "duration": 24,
        "riskScore": 42.33
    },
    {
        "tripId": "fb00107b-0460-4f39-8765-958dde40825c",
        "userId": "d4c938b6-b4ff-47cc-ad41-0ba38e99bbc3",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-02-07T18:27:37.370373+00:00",
        "endTime": "2024-02-07T19:09:37.370373+00:00",
        "distance": 21.08,
        "duration": 42,
        "riskScore": 68.52
    },
    {
        "tripId": "83512edc-938c-4a2d-89ea-67bfb6bd9b22",
        "userId": "d4c938b6-b4ff-47cc-ad41-0ba38e99bbc3",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-27T05:15:51.771755+00:00",
        "endTime": "2024-06-27T05:38:51.771755+00:00",
        "distance": 49.09,
        "duration": 23,
        "riskScore": 50.06
    },
    {
        "tripId": "eba27e90-00b9-4714-b904-7364dc5505a0",
        "userId": "d4c938b6-b4ff-47cc-ad41-0ba38e99bbc3",
        "startLocation": "{'latitude': -33.9086313, 'longitude': 18.4162905, 'name': 'One&Only Cape Town', 'address': 'One&Only Cape Town, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-02-10T19:33:53.53235+00:00",
        "endTime": "2024-02-10T20:59:53.53235+00:00",
        "distance": 27.48,
        "duration": 86,
        "riskScore": 60.1
    },
    {
        "tripId": "2d54e288-dd3b-4e8e-a5b4-f44318a8f963",
        "userId": "d4c938b6-b4ff-47cc-ad41-0ba38e99bbc3",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-04-01T12:37:34.99885+00:00",
        "endTime": "2024-04-01T13:03:34.99885+00:00",
        "distance": 23.58,
        "duration": 26,
        "riskScore": 53.34
    },
    {
        "tripId": "e71232ab-c878-402d-81a9-c1b89c2b0e1f",
        "userId": "d4c938b6-b4ff-47cc-ad41-0ba38e99bbc3",
        "startLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-15T01:29:06.027311+00:00",
        "endTime": "2024-06-15T01:50:06.027311+00:00",
        "distance": 4.82,
        "duration": 21,
        "riskScore": 61.91
    },
    {
        "tripId": "034be8ea-602a-413f-82fb-530c1f9d9cf5",
        "userId": "d4c938b6-b4ff-47cc-ad41-0ba38e99bbc3",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-03-05T02:24:39.960885+00:00",
        "endTime": "2024-03-05T02:38:39.960885+00:00",
        "distance": 32.12,
        "duration": 14,
        "riskScore": 51.69
    },
    {
        "tripId": "9db0763b-cb06-40a6-8bdf-8f48bdb57a69",
        "userId": "d4c938b6-b4ff-47cc-ad41-0ba38e99bbc3",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-03-28T04:18:14.4128+00:00",
        "endTime": "2024-03-28T05:57:14.4128+00:00",
        "distance": 31.12,
        "duration": 99,
        "riskScore": 60.49
    },
    {
        "tripId": "bc2c6940-8856-402f-9785-de6d4a2f6de3",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-01-17T09:25:13.777716+00:00",
        "endTime": "2024-01-17T10:47:13.777716+00:00",
        "distance": 9.48,
        "duration": 82,
        "riskScore": 68.51
    },
    {
        "tripId": "fc07a515-5f60-4f6b-8cc8-52e49b0921b4",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-01-10T05:34:36.383631+00:00",
        "endTime": "2024-01-10T06:45:36.383631+00:00",
        "distance": 10.24,
        "duration": 71,
        "riskScore": 40.66
    },
    {
        "tripId": "8086df81-2f24-4a6d-bb7d-c8f09834e131",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-02-14T19:39:36.600754+00:00",
        "endTime": "2024-02-14T21:39:36.600754+00:00",
        "distance": 11.21,
        "duration": 120,
        "riskScore": 43.57
    },
    {
        "tripId": "ceff8558-973c-4339-beb2-b335d7b03cce",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-01-16T02:00:24.792198+00:00",
        "endTime": "2024-01-16T02:55:24.792198+00:00",
        "distance": 15.37,
        "duration": 55,
        "riskScore": 40.37
    },
    {
        "tripId": "8f0521fb-25a9-4aec-a0c5-ad9816d34d8c",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-02-27T09:41:00.22527+00:00",
        "endTime": "2024-02-27T10:58:00.22527+00:00",
        "distance": 33.87,
        "duration": 77,
        "riskScore": 69.73
    },
    {
        "tripId": "8adaba1f-c871-4926-afb2-d4832a2d7397",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-02-07T05:28:12.315687+00:00",
        "endTime": "2024-02-07T06:40:12.315687+00:00",
        "distance": 22.46,
        "duration": 72,
        "riskScore": 55.45
    },
    {
        "tripId": "4c4b37b0-7e23-43b2-996b-9a3f964b231b",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "startTime": "2024-06-21T11:38:35.302358+00:00",
        "endTime": "2024-06-21T12:58:35.302358+00:00",
        "distance": 7.54,
        "duration": 80,
        "riskScore": 46.23
    },
    {
        "tripId": "9e12e247-0852-44e4-95b6-f44a779376db",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "endLocation": "{'latitude': -33.9132305, 'longitude': 18.4258898, 'name': 'aha Harbour Bridge Hotel & Suites', 'address': 'Dockrail Road, Foreshore, Cape Town'}",
        "startTime": "2024-05-16T16:34:22.410429+00:00",
        "endTime": "2024-05-16T18:30:22.410429+00:00",
        "distance": 15.76,
        "duration": 116,
        "riskScore": 55.33
    },
    {
        "tripId": "2d1f06c0-3dc0-476f-8b61-7c5414370c4e",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-03-13T18:19:47.100646+00:00",
        "endTime": "2024-03-13T18:53:47.100646+00:00",
        "distance": 43.19,
        "duration": 34,
        "riskScore": 50.9
    },
    {
        "tripId": "782c9fdc-e88f-4169-9021-6b3db5bf0bd5",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-02-16T08:28:12.403687+00:00",
        "endTime": "2024-02-16T10:09:12.403687+00:00",
        "distance": 5.71,
        "duration": 101,
        "riskScore": 55.14
    },
    {
        "tripId": "9f7d73a8-bf8b-4134-953c-c811adbbb2e2",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-01-29T08:15:45.8222+00:00",
        "endTime": "2024-01-29T10:12:45.8222+00:00",
        "distance": 5.51,
        "duration": 117,
        "riskScore": 47.78
    },
    {
        "tripId": "e699ea84-1618-4458-85f0-ae1153a34321",
        "userId": "de9ddf40-dd7e-4a77-9214-ce3f7eae4048",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-01-23T02:51:52.268889+00:00",
        "endTime": "2024-01-23T04:18:52.268889+00:00",
        "distance": 49.01,
        "duration": 87,
        "riskScore": 50.77
    },
    {
        "tripId": "c59c30ec-109a-4518-81aa-c93ec3bc8331",
        "userId": "da1e5574-6b5f-4bfd-84fe-eb45971fd267",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-02-07T16:40:55.360112+00:00",
        "endTime": "2024-02-07T17:50:55.360112+00:00",
        "distance": 2.61,
        "duration": 70,
        "riskScore": 66.39
    },
    {
        "tripId": "62063fb2-8f02-414f-b3da-e9e1eaacc4e5",
        "userId": "da1e5574-6b5f-4bfd-84fe-eb45971fd267",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-02-13T16:14:26.313027+00:00",
        "endTime": "2024-02-13T17:57:26.313027+00:00",
        "distance": 17.12,
        "duration": 103,
        "riskScore": 63.64
    },
    {
        "tripId": "058623e2-022f-4c2b-8987-67a9e50c64d4",
        "userId": "da1e5574-6b5f-4bfd-84fe-eb45971fd267",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-05-27T07:42:26.573067+00:00",
        "endTime": "2024-05-27T08:49:26.573067+00:00",
        "distance": 20.05,
        "duration": 67,
        "riskScore": 45.69
    },
    {
        "tripId": "288f2276-84fe-40dd-9200-4f030f31b852",
        "userId": "da1e5574-6b5f-4bfd-84fe-eb45971fd267",
        "startLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9214218, 'longitude': 18.4220856, 'name': 'Southern Sun Cape Sun', 'address': '23 Strand Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-04-18T05:04:42.80402+00:00",
        "endTime": "2024-04-18T05:33:42.80402+00:00",
        "distance": 49.45,
        "duration": 29,
        "riskScore": 68.91
    },
    {
        "tripId": "9e645669-00ea-4cdc-9530-ff396fb57638",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-06-20T19:29:14.134686+00:00",
        "endTime": "2024-06-20T20:45:14.134686+00:00",
        "distance": 46.58,
        "duration": 76,
        "riskScore": 68.78
    },
    {
        "tripId": "60f901cd-26b7-41bb-be7d-2d4918333ca6",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-03-07T01:48:25.166701+00:00",
        "endTime": "2024-03-07T02:53:25.166701+00:00",
        "distance": 47.1,
        "duration": 65,
        "riskScore": 45.38
    },
    {
        "tripId": "a79f62be-4ea8-4be1-b20a-ab616fcf294a",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.9243915, 'longitude': 18.4210207, 'name': 'Adderley Hotel', 'address': '31 Adderley Street, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-05-23T13:34:02.553808+00:00",
        "endTime": "2024-05-23T15:05:02.553808+00:00",
        "distance": 46.23,
        "duration": 91,
        "riskScore": 69.66
    },
    {
        "tripId": "332aa032-21bb-4a47-b2ba-8917fd80c464",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.9113555, 'longitude': 18.4153048, 'name': 'Sugar Hotel', 'address': '1 Main Road, Green Point, Cape Town'}",
        "endLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "startTime": "2024-05-16T00:41:22.221038+00:00",
        "endTime": "2024-05-16T01:51:22.221038+00:00",
        "distance": 26.06,
        "duration": 70,
        "riskScore": 41.38
    },
    {
        "tripId": "a698cca2-2a93-4884-b1ec-7d8ab71c531a",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.9028648, 'longitude': 18.4221961, 'name': 'The Table Bay hotel', 'address': 'Quay, 6 West Quay Road, Victoria & Alfred Waterfront, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-06-30T08:30:13.965358+00:00",
        "endTime": "2024-06-30T09:52:13.965358+00:00",
        "distance": 32.26,
        "duration": 82,
        "riskScore": 55.15
    },
    {
        "tripId": "1fdbfa49-c103-4589-9b11-e377261f3787",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-05-23T17:18:37.058903+00:00",
        "endTime": "2024-05-23T18:51:37.058903+00:00",
        "distance": 19.94,
        "duration": 93,
        "riskScore": 57.61
    },
    {
        "tripId": "1dcae27c-ac18-43ab-80e5-57e95e28086d",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "endLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "startTime": "2024-04-29T23:04:13.411439+00:00",
        "endTime": "2024-04-30T00:11:13.411439+00:00",
        "distance": 7.06,
        "duration": 67,
        "riskScore": 54.12
    },
    {
        "tripId": "dd29c3ae-ba94-4d6f-a4cf-d319bf4eed3b",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.92645580000001, 'longitude': 18.41203269999999, 'name': 'Protea Hotel Fire & Ice! Cape Town', 'address': '64 New Church Street, Tamboerskloof, Cape Town'}",
        "endLocation": "{'latitude': -33.9200908, 'longitude': 18.38586459999999, 'name': 'Atlantic Affair Boutique Hotel', 'address': '9 Clarens Road, Sea Point, Cape Town'}",
        "startTime": "2024-05-02T07:50:35.273931+00:00",
        "endTime": "2024-05-02T09:42:35.273931+00:00",
        "distance": 11.42,
        "duration": 112,
        "riskScore": 48.75
    },
    {
        "tripId": "b9244c36-b302-4d57-8e49-adc051fa0bd9",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "endLocation": "{'latitude': -33.9228284, 'longitude': 18.3799718, 'name': 'The Bantry Bay Aparthotel by Totalstay', 'address': '8001, 8 Alexander Road, Bantry Bay, Cape Town'}",
        "startTime": "2024-01-16T03:32:02.790173+00:00",
        "endTime": "2024-01-16T04:42:02.790173+00:00",
        "distance": 45.55,
        "duration": 70,
        "riskScore": 69.78
    },
    {
        "tripId": "43b24d03-98fd-4393-bfb8-f9cce410b77b",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.9283689, 'longitude': 18.413819, 'name': 'The Capital 15 On Orange Hotel & Spa', 'address': \"Shop 3, Corner Of Orange Street & Grey's Pass, 15 Orange Street, Gardens, Cape Town\"}",
        "endLocation": "{'latitude': -33.93793999999999, 'longitude': 18.46531, 'name': 'Green Elephant Backpackers', 'address': '57 Milton Road, Observatory, Cape Town'}",
        "startTime": "2024-03-03T02:03:27.748486+00:00",
        "endTime": "2024-03-03T03:23:27.748486+00:00",
        "distance": 48.28,
        "duration": 80,
        "riskScore": 41.88
    },
    {
        "tripId": "85036266-f04a-43c9-9e92-bbef1080ae78",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.91025860000001, 'longitude': 18.3976431, 'name': 'Blackheath Lodge', 'address': '6 Blackheath Road, Three Anchor Bay, Cape Town'}",
        "endLocation": "{'latitude': -33.92109, 'longitude': 18.42043, 'name': 'The Grand Daddy Boutique Hotel', 'address': '38 Long Street, Cape Town'}",
        "startTime": "2024-05-25T06:22:44.318775+00:00",
        "endTime": "2024-05-25T07:01:44.318775+00:00",
        "distance": 1.65,
        "duration": 39,
        "riskScore": 56.1
    },
    {
        "tripId": "e995ad56-e994-4f8a-83ed-ac65e0081059",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.89933289999999, 'longitude': 18.4124666, 'name': 'Radisson Blu Hotel Waterfront, Cape Town', 'address': '100 Beach Road, Granger Bay Boulevard, Cape Town'}",
        "endLocation": "{'latitude': -33.9062191, 'longitude': 18.4201757, 'name': 'Victoria & Alfred Hotel Cape Town', 'address': 'PierHead, V&A Complex, Dock Road, Victoria & Alfred Waterfront, Cape Town'}",
        "startTime": "2024-05-29T11:17:16.946838+00:00",
        "endTime": "2024-05-29T11:51:16.946838+00:00",
        "distance": 3.49,
        "duration": 34,
        "riskScore": 60.39
    },
    {
        "tripId": "a42f9e88-1d8c-4a58-ad95-f7d9b9a319ea",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.9167236, 'longitude': 18.3914761, 'name': 'The Glen Boutique Hotel & Spa', 'address': '3 The Glen, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9157633, 'longitude': 18.4234956, 'name': 'Southern Sun Waterfront Cape Town', 'address': '1 Lower Buitengracht, Cape Town City Centre, Cape Town'}",
        "startTime": "2024-04-17T05:50:43.520498+00:00",
        "endTime": "2024-04-17T06:39:43.520498+00:00",
        "distance": 29.85,
        "duration": 49,
        "riskScore": 44.4
    },
    {
        "tripId": "eb0fe5c6-fd59-4b32-87e9-d3d7a673a1e3",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9079845, 'longitude': 18.4039757, 'name': 'A Sunflower Stop Backpackers Hostel', 'address': '179 Main Road, Green Point, Cape Town'}",
        "startTime": "2024-04-15T07:02:33.141045+00:00",
        "endTime": "2024-04-15T07:49:33.141045+00:00",
        "distance": 15.66,
        "duration": 47,
        "riskScore": 44.71
    },
    {
        "tripId": "738b8961-8c16-4b02-872d-4b3f467b4aae",
        "userId": "f47b581b-6482-4b40-8f73-2960b8233325",
        "startLocation": "{'latitude': -33.9093547, 'longitude': 18.3969374, 'name': 'The Ritz Hotel, Sea Point', 'address': 'Corner Main & Camberwell Roads Sea Point, Sea Point, Cape Town'}",
        "endLocation": "{'latitude': -33.9165559, 'longitude': 18.4240374, 'name': 'Protea Hotel Cape Town North Wharf', 'address': '1 Lower, Bree Street, Foreshore, Cape Town'}",
        "startTime": "2024-03-14T21:10:45.316208+00:00",
        "endTime": "2024-03-14T22:26:45.316208+00:00",
        "distance": 17.24,
        "duration": 76,
        "riskScore": 54.77
    }
]


export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "userId",

    header: "User ID",
    cell: ({ row }) => (
      <div>{row.getValue("userId").slice(0, 6)}</div>
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
      return <div className="text-center font-medium">{((Math.random() * (150 - 30) + 30)).toFixed(2)}</div>
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
      return <div className="text-center font-medium">{(((Math.random() * (100 - 30) + 30)/10).toFixed(2))}</div>
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
      return <div className="text-center font-medium">{(Math.random() * (100 - 30) + 30).toFixed(2)}</div>
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
                        make: user.carMake,
                        model: user.carModel,
                        year: user.carYear,
                    }
                } />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <UserTripDialog user={user}/>
            </DropdownMenuItem>
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
  /*
  const [data, setData] = React.useState<User[]>([])
  const [trips, setTrips] = React.useState<Trip[]>([])

  useEffect(() => {
    async function fetchData() {
      setData(await fetchUsers())
      setTrips(await fetchAllTrips())
    }
    fetchData()
  }, [])

  console.log(trips)
  */

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




