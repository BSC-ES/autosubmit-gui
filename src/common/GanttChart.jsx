const DATA = [
  {
    id: 1,
    name: "Task 1",
    start: "2025-04-07T12:00:00Z",
    end: "2025-04-07T13:00:00Z",
  },
  {
    id: 2,
    name: "Task 2",
    start: "2025-04-07T13:00:00Z",
    end: "2025-04-07T14:00:00Z",
  },
  {
    id: 3,
    name: "Task 3",
    start: "2025-04-07T14:00:00Z",
    end: "2025-04-07T15:00:00Z",
  },
  {
    id: 4,
    name: "Task 4 very long name that should be truncated long name. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    start: "2025-04-07T15:00:00Z",
    end: "2025-04-07T16:00:00Z",
  },
];

/**
 * GanttChart component
 */
const GanttChart = ({ data }) => {
  data = data || DATA;

  // endDate is now or the max end date of the tasks
  let endDate = new Date();
  data.forEach((task) => {
    const taskEndDate = new Date(task.end);
    if (taskEndDate > endDate) {
      endDate = taskEndDate;
    }
  });

  // startDate is now minus 1 day
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  data.forEach((task) => {
    const taskStartDate = new Date(task.start);
    if (taskStartDate < startDate) {
      startDate = taskStartDate;
    }
  });

  // Get the number of hours between startDate and endDate
  const hours = Math.abs(endDate - startDate) / 36e5;

  // Gantt chart with a floating sidebar and a scrollable chart
  return (
    <div className="flex flex-row">
      {/* Sidebar with task names */}
      <div className="w-1/4">
        <div className="h-[3rem] box-border border-b border-r"></div>
        {data.map((task) => (
          <div
            key={task.id}
            className="max-w-full h-[3rem] px-2 flex items-center box-border border-b border-l border-r"
          >
            <span className="truncate text-sm">{task.name}</span>
          </div>
        ))}
      </div>

      {/* Gantt chart */}
      <div
        className="w-3/4 overflow-x-scroll custom-scrollbar"
        ref={(el) => {
          if (el) {
            el.scrollLeft = el.scrollWidth;
          }
        }}
      >
        <div className="flex flex-col" style={{ width: `${hours * 100}px` }}>
          <div className="h-[3rem] border-b flex">
            {[...Array(hours).keys()].map((i) => (
              <div
                key={i}
                className="w-[100px] h-full box-border border-r flex items-center justify-center"
              >
                {new Date(startDate.getTime() + i * 36e5).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </div>
            ))}
          </div>

          {data.map((task) => (
            <div
              className="h-[3rem] box-border border-b flex items-center py-1"
              key={task.id}
            >
              <div
                className="bg-blue-700 text-white w-full max-w-full h-full flex items-center truncate rounded-sm"
                style={{
                  width: `${
                    ((new Date(task.end) - new Date(task.start)) / 36e5) * 100
                  }px`,
                  marginLeft: `${
                    ((new Date(task.start) - startDate) / 36e5) * 90
                  }px`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
