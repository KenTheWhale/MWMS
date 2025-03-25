import {Container, Grid2, Paper, Typography} from "@mui/material";
import {BarChart, PieChart} from "@mui/x-charts";
import {useEffect, useState} from "react";
import {getDashboardData} from "../../services/ManagerService.jsx";

/* eslint-disable react/prop-types */
function RenderChartGrid({content, size, children}) {
    return (<Grid2 size={size} sx={{height: "100%"}}>
        <Paper elevation={24} square={false} sx={{height: "100%"}}>
            <Typography
                variant={"h5"}
                color={"textPrimary"}
                sx={{paddingLeft: "1vw", paddingTop: "2vh", marginBottom: "5vh", fontWeight: "bold"}}
            >
                {content}
            </Typography>
            {children}
        </Paper>
    </Grid2>)
}

function RenderChartArea({data}) {

    const pieDataSet = data.chart.equipment.map(item => ({
        value: item.qty,
        label: item.name
    }))

    const barDataSet = data.chart.request.map(item => ({
        month: item.month,
        qty: item.qty
    }))

    return (<Container maxWidth="xl">
        <Grid2 container spacing={2} direction={"row"} sx={{height: "60vh", marginBottom: "5vh"}} columns={1}>
            <RenderChartGrid content={"Imported equipment (batches)"} size={1}>
                <PieChart
                    series={[{
                        data: pieDataSet,
                        highlightScope: {fade: 'global', highlight: 'item'},
                        faded: {innerRadius: 30, additionalRadius: -10, color: 'gray'},
                    }]}
                    height={300}
                />
            </RenderChartGrid>
        </Grid2>

        <Grid2 container spacing={2} direction={"row"} sx={{height: "60vh", marginBottom: "5vh"}} columns={1}>
            <RenderChartGrid content={"Completed request by month"} size={1}>
                <BarChart
                    dataset={barDataSet}
                    xAxis={[{scaleType: 'band', dataKey: 'month'}]}
                    series={[{dataKey: "qty", label: "Imported request amount"}]}
                    height={300}
                />
            </RenderChartGrid>
        </Grid2>
    </Container>)
}

function RenderNumberGrid({content, size, data}) {
    return (<Grid2 size={size} sx={{height: "100%"}}>
        <Paper elevation={24} square={false} sx={{height: "100%"}}>
            <Typography
                variant={"body1"}
                color={"textPrimary"}
                sx={{paddingLeft: "1vw", paddingTop: "2vh", fontWeight: "bold"}}
            >
                {content}
            </Typography>
            <Typography
                variant={"body1"}
                color={"textPrimary"}
                sx={{paddingLeft: "1vw", fontWeight: "bold", fontSize: "3rem"}}
            >
                {data}
            </Typography>
        </Paper>
    </Grid2>)
}

function RenderSummaryArea({data}) {
    return (<Container maxWidth="xl">
        <Grid2 container spacing={2} direction={"row"} sx={{height: "20vh"}} columns={2}>
            <RenderNumberGrid content={"Batches"} size={1} data={data.number.batch}/>
            <RenderNumberGrid content={"Completed tasks"} size={1} data={data.number.task}/>
        </Grid2>
        <Grid2 container spacing={2} direction={"row"} sx={{height: "15vh", marginTop: "2vh"}} columns={4}>
            <RenderNumberGrid content={"Requests (Pending)"} size={1} data={data.number.peRequest}/>
            <RenderNumberGrid content={"Requests (Accepted)"} size={1} data={data.number.acRequest}/>
            <RenderNumberGrid content={"Requests (Assigned)"} size={1} data={data.number.prRequest}/>
            <RenderNumberGrid content={"Requests (Stored)"} size={1} data={data.number.stRequest}/>
        </Grid2>
        <Grid2 container spacing={2} direction={"row"} sx={{height: "15vh", marginTop: "2vh"}} columns={2}>
            <RenderNumberGrid content={"Requests (Rejected)"} size={1} data={data.number.reRequest}/>
            <RenderNumberGrid content={"Requests (Cancelled)"} size={1} data={data.number.caRequest}/>
        </Grid2>
    </Container>)
}

function RenderDashboard({data}) {
    return (<>
        <div className={'d-flex flex-column justify-content-center align-items-start'}>
            <Typography variant={"h4"} color={"textPrimary"} sx={{marginBottom: "2vh", marginLeft: "2%"}}>
                {`Figures per month (${new Date().toLocaleString('en-US', {month: 'long'})})`}
            </Typography>
            <RenderSummaryArea data={data}/>

            <Typography variant={"h4"} color={"textPrimary"}
                        sx={{marginBottom: "2vh", marginLeft: "2%", marginTop: "2%"}}>
                Chart data
            </Typography>
            <RenderChartArea data={data}/>
        </div>
    </>)
}

export function Dashboard() {
    const [dasData, setDasData] = useState(null)

    useEffect(() => {
        async function fetchData() {
            return await getDashboardData()
        }

        fetchData().then(res => setDasData(res.data))
    }, []);

    return (
        <>
            {
                dasData && <RenderDashboard data={dasData}/>
            }
        </>
    )
}