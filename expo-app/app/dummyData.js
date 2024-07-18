const dummyData = [
    {
        source: [18.423300, -33.918861],
        destination: [18.431000, -33.925840],
        travelType: "drive",
        polyline: "dld~Cs`riDuFzAlAtGr@lDz@dCv@|AHLl@rAFJ|@CvCIrCKxAzF?bCFnCLlG@LHhD@t@DzBBbABlABnAFtB@TDlAFt@?JLpGHxB",
        waypoints: [
            [18.423400, -33.919000],
            [18.425000, -33.920000]
        ],
        distance: 2000,
        google_deeplink: "https://www.google.com/maps/dir/?api=1&origin=-26.077702,27.950062&destination=-26.081334,27.935728&travelmode=driving&dir_action=navigate&waypoints=-26.078272,27.9503404|-26.077044,27.949879|-26.0774291,27.9484875|-26.0776842,27.9476175|-26.0779835,27.9469462|-26.0782675,27.9464777|-26.0783179,27.946403|-26.0785502,27.945978|-26.0785919,27.9459182|-26.078903,27.9459353|-26.079665,27.9459858|-26.0804048,27.9460486|-26.080858,27.9447845|-26.0808613,27.9441295|-26.0808997,27.9434084|-26.0809714,27.9420545|-26.0809797,27.9419819|-26.0810322,27.9411319|-26.0810459,27.9408591|-26.0810793,27.940238|-26.0810968,27.9398979|-26.081116,27.9395122|-26.081136,27.9391121|-26.0811714,27.9385221|-26.0811786,27.9384108|-26.0812106,27.9380225|-26.0812554,27.9377479|-26.0812581,27.9376866|-26.0813244,27.93632|-26.0813752,27.9357127",
        legs: [
            {
                osmId: 1234,
                source: [18.423300, -33.918861],
                destination: [18.425000, -33.920000],
                total_crimes: 5,
                power_outage: false,
                distance: 1000,
                incidents: [
                    {
                        type: "theft"
                    }
                ]
            },
            {
                osmId: 5678,
                source: [18.425000, -33.920000],
                destination: [18.431000, -33.925840],
                total_crimes: 5,
                power_outage: true,
                distance: 1000,
                incidents: [
                    {
                        type: "robbery"
                    }
                ]
            }
        ],
        trip_summary: {
            total_crimes: 10,
            power_outage_in_route: true,
            distance: 2000,
            risk_score: 7
        }
    },
]