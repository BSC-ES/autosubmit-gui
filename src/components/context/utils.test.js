import { timeStampToDate, secondsToDelta, commandGenerator } from "./utils";

test('1604334422 is converted to [2/11]17:27:02', () => {
  const offsetBSC = -3600;
  var date = new Date();
  const offset = (date.getTimezoneOffset() * 60) - offsetBSC;
  // The timedelta returned by the function is on the user's browser timezone.
  // Adds offset so the test is accurate in any time zone.  
  const testValue = 1604334422 + offset;
  expect(timeStampToDate(testValue)).toBe("[2/11] 17:27:02");
});

test('1600 seconds to delta 00:26:40', () => {
  expect(secondsToDelta(1600)).toBe("00:26:40");
});

test("a2h6, ['job_name_1, job_name2], COMPLETED to 'autosubmit setstatus a2h6 -fl \'job_name_1 job_name_2\' -t COMPLETED -s -nt -np'", () => {
  expect(commandGenerator('a2h6', [{name:'job_name_1'}, {name:'job_name_2'}], 'COMPLETED')).toBe('autosubmit setstatus a2h6 -fl "job_name_1 job_name_2" -t COMPLETED -s -nt -np');
});