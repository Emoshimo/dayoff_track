import React from 'react'

interface ChartSelectorProps {
    topX: number,
    setTopX: (value: number) => void,
    timePeriod: string,
    setTimePeriod: (value: string) => void,
    chartType: string,
    setChartType: (value: string) => void
}

const ChartSelector: React.FC<ChartSelectorProps> = ({ topX, setTopX, timePeriod, setTimePeriod, chartType, setChartType }) => {
    return (
        <div className="flex flex-row p-4 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Select Top X</label>
                <select
                    value={topX}
                    onChange={(e) => setTopX(Number(e.target.value))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-primary focus:outline-none sm:text-sm rounded-md"
                >
                    <option value={3}>Top 3</option>
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={15}>Top 15</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Select Time Period</label>
                <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-primary focus:outline-none sm:text-sm rounded-md"
                >
                    <option value="2weeks">Last 2 Weeks</option>
                    <option value="month">Last Month</option>
                    <option value="3months">Last 3 Months</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Select Chart Type</label>
                <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-primary focus:outline-none sm:text-sm rounded-md"
                >
                    <option value="PieChart">Pie Chart</option>
                    <option value="BarChart">Bar Chart</option>

                </select>
            </div>
        </div>
    );
}


export default ChartSelector