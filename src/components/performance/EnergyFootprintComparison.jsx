import React from "react";
import BarPlot from "./BarPlot";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../common/Table";

const references = [
    { name: "1 km diesel car journey", name_ref: "km of diesel car journey", energy: 2.5 * 1e6, footprint: 150 },
    { name: "1 hour train journey", name_ref: "hours of train journey", energy: 10 * 1e6, footprint: 4 * 1e3 },
    { name: "1 day household electricity", name_ref: "days of household electricity", energy: 21.6 * 1e6, footprint: 1.5 * 1e3 },
    { name: "1 hour of air conditioning", name_ref: "hours of air conditioning", energy: 4 * 1e6, footprint: 2 * 1e3 },
    { name: "Clothes dryer (full cycle)", name_ref: "loads of clothes", energy: 8* 1e6, footprint: 2.5 * 1e3 },
    { name: "Charging in fast mode a smartphone (33W)", name_ref: "smartphone charges", energy: 178.2 * 1e3, footprint: 11.53},
];

const ReferenceTable = ({ mode, experimentValue }) => {
    return (
        <Table>
            <TableHead>
                <TableRow className="bg-primary-200 font-bold">
                    <TableHeader className="py-1 text-center">Equivalence SIM jobs </TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {references.map((ref, idx) => {
                    const refValue = mode === "energy" ? ref.energy : ref.footprint;
                    const proportion =
                        refValue && refValue !== 0
                            ? (experimentValue / refValue).toFixed(2)
                            : "-";
                    return (
                        <TableRow key={idx}>
                            <TableCell className="py-1 text-center">
                                {refValue ? (
                                    <strong className="rounded px-1 bg-light">
                                       {parseFloat(proportion)}
                                    </strong>
                                ) : (
                                    <strong>-</strong>
                                )}{" "}
                                {ref.name_ref}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};


const Comparison = ({ metric, title, field, emptyDescription }) => {
    if (metric === 0) {
        return (
            <div className="flex flex-col justify-center items-center w-full h-full py-12 gap-4">
                <i className="fa-solid fa-triangle-exclamation text-danger text-6xl"></i>
                <span className="font-bold text-center">
                    {emptyDescription}
                </span>
            </div>
        );
    }
    const barData = [
        { label: "SIM jobs", value: metric, color: "#82ca9d" },
        ...references
            .filter((ref) => ref[field] > 0)
            .map((ref) => ({
                label: ref.name,
                value: ref[field],
                color: "#8884d8",
            })),
    ];
    return (
        <div className="flex flex-col md:flex-row justify-start items-center w-full gap-4">
            <div className="md:w-3/4">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <BarPlot data={barData} width={900} height={280} margin={{ top: 0, right: 55, bottom: 60, left: 110 }} maxWridthTextAxisY={100}/>
            </div>
            <div className="flex items-center justify-center">
                <div>
                    <ReferenceTable mode={field} experimentValue={metric} />
                </div>
            </div>
        </div>
    );
};

const EnergyComparison = ({ energy }) => (
    <Comparison 
        metric={energy} 
        title="Energy(J)" 
        field="energy" 
        emptyDescription="The total energy is 0 therefore, the comparative will not be showed" 
    />
);

const FootprintComparison = ({ footprint }) => (
    <Comparison 
        metric={footprint} 
        title="Carbon Footprint (gCO2)" 
        field="footprint" 
        emptyDescription="The total footprint is 0 therefore, the comparative will not be showed" 
    />
);

const EnergyFootprintComparison = ({ energy, footprint }) => {
    return (
        <div className="space-y-8">
            <EnergyComparison energy={energy} />
            <FootprintComparison footprint={footprint} />
        </div>
    );
};

export default EnergyFootprintComparison;