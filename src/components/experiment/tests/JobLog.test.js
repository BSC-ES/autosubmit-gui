import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
import JobLog from "../JobLog";
import ExperimentContext from "../../context/experiment/experimentContext";

let container = null;
const experiment = {branch: "master", description: "Test", owner:"wuruchi", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0"};

const joblog = {
  "error": false,
  "error_message": "",
  "found": true,
  "lastModified": "2021-01-22 05:29:53",
  "logcontent": [
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 0
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.248",
          "index": 1
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822251%",
          "index": 2
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 3
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.203",
          "index": 4
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822065%",
          "index": 5
      },
      {
          "content": "-> -> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 6
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.214",
          "index": 7
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822111%",
          "index": 8
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 9
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.188",
          "index": 10
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822001%",
          "index": 11
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 12
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.23",
          "index": 13
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822176%",
          "index": 14
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 15
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.24",
          "index": 16
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822218%",
          "index": 17
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 18
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.223",
          "index": 19
      },
      {
          "content": "-> report : Performance report : Ratio : 0.82215%",
          "index": 20
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 21
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.214",
          "index": 22
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822108%",
          "index": 23
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 24
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.212",
          "index": 25
      },
      {
          "content": "-> report : Performance report : Ratio : 0.8221%",
          "index": 26
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : -> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 27
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 23623.9",
          "index": 28
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.203",
          "index": 29
      },
      {
          "content": "-> report : Performance report : Ratio : 194.212",
          "index": 30
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822101%",
          "index": 31
      },
      {
          "content": "0.822065%",
          "index": 32
      },
      {
          "content": "report : Performance report : Time spent for XIOS : 23623.9",
          "index": 33
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.223",
          "index": 34
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822148%",
          "index": 35
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 36
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.21",
          "index": 37
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822091%",
          "index": 38
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 39
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.386",
          "index": 40
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822839%",
          "index": 41
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 42
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.253",
          "index": 43
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822274%",
          "index": 44
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 45
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.275",
          "index": 46
      },
      {
          "content": "-> report : Performance report : Ratio : 0.82237%",
          "index": 47
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 48
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.248",
          "index": 49
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822253%",
          "index": 50
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 51
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.308",
          "index": 52
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822509%",
          "index": 53
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 54
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.296",
          "index": 55
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822457%",
          "index": 56
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 57
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.241",
          "index": 58
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822223%",
          "index": 59
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 60
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.261",
          "index": 61
      },
      {
          "content": "-> report : Performance report : Ratio : 0.82231%",
          "index": 62
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 63
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.233",
          "index": 64
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822192%",
          "index": 65
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 66
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.254",
          "index": 67
      },
      {
          "content": "-> report : Performance report : Ratio : 0.82228%",
          "index": 68
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 69
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.261",
          "index": 70
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822309%",
          "index": 71
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 72
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.299",
          "index": 73
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822467%",
          "index": 74
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 75
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.24",
          "index": 76
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822219%",
          "index": 77
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 78
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.258",
          "index": 79
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822296%",
          "index": 80
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 81
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.242",
          "index": 82
      },
      {
          "content": "-> report : Performance report : Ratio : 0.82223%",
          "index": 83
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 84
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.274",
          "index": 85
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822362%",
          "index": 86
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 87
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.257",
          "index": 88
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822291%",
          "index": 89
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 90
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.284",
          "index": 91
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822408%",
          "index": 92
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 93
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.248",
          "index": 94
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822255%",
          "index": 95
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 96
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.254",
          "index": 97
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822277%",
          "index": 98
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 99
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.255",
          "index": 100
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822282%",
          "index": 101
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 102
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.288",
          "index": 103
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822424%",
          "index": 104
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 105
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.236",
          "index": 106
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822205%",
          "index": 107
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 108
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.206",
          "index": 109
      },
      {
          "content": "-> report : Performance report : Ratio : 0.822075%",
          "index": 110
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 111
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.228",
          "index": 112
      },
      {
          "content": "-> report : Performance report : Ratio : 0.82217%",
          "index": 113
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 114
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.181",
          "index": 115
      },
      {
          "content": "-> report : Performance report : Ratio : 0.821968%",
          "index": 116
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 117
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.297",
          "index": 118
      },
      {
          "content": "-> report : Performance report : Ratio : 0.82246%",
          "index": 119
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 120
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.439",
          "index": 121
      },
      {
          "content": "-> report : Performance report : Ratio : 0.823063%",
          "index": 122
      },
      {
          "content": "-> report : Performance report : Time spent for XIOS : 23623.9",
          "index": 123
      },
      {
          "content": "-> report : Performance report : Time spent in processing events : 194.451",
          "index": 124
      },
      {
          "content": "-> report : Performance report : Ratio : 0.823111%",
          "index": 125
      },
      {
          "content": "*II* Leg successfully completed according to IFS log file 'ifs.stat'.",
          "index": 126
      },
      {
          "content": "*II* Leg successfully completed according to NEMO log file 'ocean.output'.",
          "index": 127
      },
      {
          "content": "total 6",
          "index": 128
      },
      {
          "content": "-rw-r--r-- 1 bsc32252 bsc32 361 Jan 21 23:53 ppt0000000000",
          "index": 129
      },
      {
          "content": "-rw-r--r-- 1 bsc32252 bsc32 343 Jan 21 23:53 pptdddddd0600",
          "index": 130
      },
      {
          "content": "lrwxrwxrwx 1 bsc32252 bsc32  13 Jan 21 23:53 pptdddddd0000 -> pptdddddd0600",
          "index": 131
      },
      {
          "content": "lrwxrwxrwx 1 bsc32252 bsc32  13 Jan 21 23:53 pptdddddd1200 -> pptdddddd0600",
          "index": 132
      },
      {
          "content": "lrwxrwxrwx 1 bsc32252 bsc32  13 Jan 21 23:53 pptdddddd1800 -> pptdddddd0600",
          "index": 133
      },
      {
          "content": "-rw-r--r-- 1 bsc32252 bsc32 568 Jan 21 23:54 pptdddddd0000_save_ic",
          "index": 134
      },
      {
          "content": "lrwxrwxrwx 1 bsc32252 bsc32  21 Jan 21 23:54 ppt0003650000 -> pptdddddd0000_save_ic",
          "index": 135
      },
      {
          "content": "total 5",
          "index": 136
      },
      {
          "content": "-rw-r--r-- 1 bsc32252 bsc32 361 Jan 21 23:53 ppt0000000000",
          "index": 137
      },
      {
          "content": "-rw-r--r-- 1 bsc32252 bsc32 343 Jan 21 23:53 pptdddddd0600",
          "index": 138
      },
      {
          "content": "lrwxrwxrwx 1 bsc32252 bsc32  13 Jan 21 23:53 pptdddddd0000 -> pptdddddd0600",
          "index": 139
      },
      {
          "content": "lrwxrwxrwx 1 bsc32252 bsc32  13 Jan 21 23:53 pptdddddd1200 -> pptdddddd0600",
          "index": 140
      },
      {
          "content": "lrwxrwxrwx 1 bsc32252 bsc32  13 Jan 21 23:53 pptdddddd1800 -> pptdddddd0600",
          "index": 141
      },
      {
          "content": "-rw-r--r-- 1 bsc32252 bsc32 568 Jan 21 23:54 pptdddddd0000_save_ic",
          "index": 142
      },
      {
          "content": "save_ic_ifs_out2init ended successfully, results are in save_ic/19941101/ifs",
          "index": 143
      },
      {
          "content": "#",
          "index": 144
      },
      {
          "content": "# Finished leg at 2021-01-22 06:29:45 after 06:34:16 (hh:mm:ss)",
          "index": 145
      },
      {
          "content": "# CPMIP performance: 3.65 SYPD   15764 CHPSY",
          "index": 146
      },
      {
          "content": "leg_number=1",
          "index": 147
      },
      {
          "content": "leg_start_date=\"Mon, 01 Nov 1993 00:00:00 +0000\"",
          "index": 148
      },
      {
          "content": "leg_end_date=\"Tue, 01 Nov 1994 00:00:00 +0000\"",
          "index": 149
      }
  ],
  "logfile": "/esarchive/autosubmit/a34n/tmp/LOG_a34n/a34n_19931101_fc0_1_SIM.20210121182125.out",
  "timeStamp": 1611293393
}

const loglines = [];
joblog.logcontent.map(item => loglines.push(item.content));

beforeEach(() => {
  // setup DOM element as render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("ExperimentItem renders with content", () => {
  
  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, getJobLog: () => null, joblog: joblog }}>
            <JobLog />      
      </ExperimentContext.Provider></Router>, container);
  });
  //console.log(container.innerHTML);
  // Contains all the requested runs.
  loglines.forEach(item => expect(container.textContent).toContain(item));
  
  //expect(container.innerHTML).toContain("Refresh");
});