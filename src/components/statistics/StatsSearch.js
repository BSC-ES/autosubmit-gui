import React, { useState, useContext } from 'react';
import StatsContext from '../context/statistics/statsContext';
import ExperimentContext from '../context/experiment/experimentContext';
import Chart from 'react-google-charts';
import Spinner from '../layout/Spinner';

const StatsSearch = () => {
    const statsContext = useContext(StatsContext); 
    const experimentContext = useContext(ExperimentContext);
    
    const { getExperimentStats, 
            statdata, 
            loading, 
            clearStats, 
            isError, 
            errorMessage } = statsContext;
    const { experiment } = experimentContext;

    // const data = [
    //     ["Year", "Visitations", "Crashes", { role: "style" }],
    //     ["2010", 10, 30, "color: gray"],
    //     ["2020", 14, 25, "color: #76A7FA"],
    //     ["2030", 16, 24, "color: blue"],
    //     ["2040", 22, 32, "stroke-color: #703593; stroke-width: 4; fill-color: #C5A5CF"],
    //     [
    //       "2050",
    //       28,
    //       23,
    //       "stroke-color: #871B47; stroke-opacity: 0.6; stroke-width: 8; fill-color: #BC5679; fill-opacity: 0.2"
    //     ]
    // ];

    const options = {   
        chartArea: { width: '90%'},
        hAxis: {
            title: 'Jobs',
        },
        vAxis: {
            title: 'Hours',
        }, 
    }
    
    
    
    const onSubmitStats = e => {
        e.preventDefault();    
        console.log(experiment.expid);
        console.log("Hours : " + hour);
        console.log("Type : " + section);
        getExperimentStats(experiment.expid, hour, section)
    }

    const onSubmitClear = e => {
        e.preventDefault();
        setHour('');
        setSection('');
        clearStats();

    }
    
    const [hour, setHour] = useState('');
    const [section, setSection] = useState('');
    const onChangeHour = e => setHour(e.target.value);
    const onChangeSection = e => setSection(e.target.value);

    return (
        <div className='row'>
            <div className='col-md-4 offset-md-4 text-center'>
                {!statdata && 
                    <form onSubmit={onSubmitStats} className='form'>
                        <div className="input-group input-group-sm">                      
                            <input
                                className="form-control"
                                type='text'
                                name='section'
                                placeholder='Section'                          
                                onChange={onChangeSection}
                            />
                            <input
                                className="form-control"
                                type='text'
                                name='hours'
                                placeholder='Hours'                          
                                onChange={onChangeHour}
                            />                    
                            <div className="input-group-append">
                                <input          
                                type='submit'
                                value='Get Statistics'
                                className='btn btn-info'
                                />
                            </div>                    
                        </div>
                    </form>
                }                
                {statdata &&
                    <form onSubmit={onSubmitClear} className='form'> 
                        <div className="">
                            <input          
                            type='submit'
                            value='Clear Statistics'
                            className='btn btn-dark btn-sm'
                            />
                        </div>        
                    </form>
                }   
            </div>
            <div className="col-md-12">
                {loading && <Spinner />}
                {statdata && !isError &&
                    <Chart
                    chartType="ColumnChart"
                    width={'100%'}
                    height={'500px'}
                    data={statdata}
                    options={options}
                    /> 
                }
                {statdata && isError &&
                    <div className="col-md-12 text-center p-3">
                        {errorMessage}
                    </div>
                }
            </div>
        </div>
        
    )
}

export default StatsSearch;
