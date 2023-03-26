import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { FormGroup, Input, Label, Form } from 'reactstrap';

function WeeklyView() {
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata');
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    const now = moment().tz(selectedTimezone);
    const weekNumber = now.week();
    const dayName = now.format('MMM DD YYYY hh:mm:ss: A');

    setCurrentWeek(weekNumber);
    setCurrentDay(dayName);
  }, [selectedTimezone]);

  useEffect(() => {
    setSelectedWeek(currentWeek);
  }, [currentWeek]);

  // Array of weekdays
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Array of times with a time difference of 30 minutes
  const times = [];
  let startHour = 8;
  let startMinute = 0;
  let endHour = 23;
  let endMinute = 30;
  while (startHour < endHour || (startHour === endHour && startMinute <= endMinute)) {
    let suffix = 'AM';
    let hour = startHour;
    if (startHour === 0) {
      hour = 12;
    } else if (startHour === 12) {
      suffix = 'PM';
    } else if (startHour > 12) {
      hour = startHour - 12;
      suffix = 'PM';
    }
    let time = `${hour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')} ${suffix}`;
    times.push(time);
    if (startMinute === 30) {
      startHour++;
      startMinute = 0;
    } else {
      startMinute = 30;
    }
  }

  const handleTimezoneChange = (event) => {
    setSelectedTimezone(event.target.value);
  };

  const handleWeekChange = (weekIndex) => {
    weekIndex >= 0 && setSelectedWeek(weekIndex);
  };

  const renderCheckbox = (dayIndex, timeIndex, weekIndex) => {
    return (
      <>
        {/* {moment.isBefore(moment.day(dayIndex).week(weekIndex))} */}
        {dayIndex == 0 || dayIndex == 6 ? (
          ''
        ) : (
          <div className="checkbox-container d-flex gap-2" key={`${dayIndex}-${timeIndex}`}>
            <input type="checkbox" id={`${dayIndex}-${timeIndex}`} />
            <label htmlFor={`${dayIndex}-${timeIndex}`}>{`${times[timeIndex]}`}</label>
          </div>
        )}
      </>
    );
  };

  const renderWeek = (weekIndex) => {
    const checkboxes = weekdays.map((weekday, dayIndex) => {
      const timeCheckboxes = times.map((time, timeIndex) => {
        return renderCheckbox(dayIndex, timeIndex, weekIndex);
      });
      return (
        <div className="day-container d-flex gap-2 mb-5 " key={dayIndex}>
          <div className="day-label" style={{ minWidth: '100px' }}>
            {weekday}
            <p>{moment().day(dayIndex).week(weekIndex).format('DD/MM')}</p>
          </div>
          <div className="time-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {timeCheckboxes}
          </div>
        </div>
      );
    });

    return (
      <div className="week-container " key={weekIndex}>
        <div className="week-label p-3">{`Week ${weekIndex}`}</div>
        <div className="week-checkboxes-container">{checkboxes}</div>
      </div>
    );
  };

  const renderWeeks = () => {
    const weeks = [];
    for (let i = 0; i < 52; i++) {
      weeks.push(renderWeek(i));
    }
    return weeks[selectedWeek];
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <div className="week-nav-container d-flex justify-content-between">
          <button className="  btn btn-light" disabled={selectedWeek == 0} onClick={() => handleWeekChange(selectedWeek - 1)}>
            Previous
          </button>

          {currentDay}

          <button className=" btn btn-light " onClick={() => handleWeekChange(selectedWeek + 1)}>
            Next
          </button>
        </div>

        <div className="timezone-container p-3 input-group mt-3">
          <Form className="w-100 ">
            <FormGroup>
              <Label for="exampleSelect" className="float-left">
                TimeZone:
              </Label>
              <Input type="select" name="select" id="exampleSelect" value={selectedTimezone} onChange={handleTimezoneChange}>
                <option value="Etc/GMT">UTC+0 (Etc/GMT)</option>
                <option value="America/Denver">UTC-7 (America/Denver) </option>
                <option value="Asia/Kolkata">UTC+5:30 (Asia/Kolkata) </option>
              </Input>
            </FormGroup>
          </Form>
        </div>
      </div>
      <div className="weeks-container">{renderWeeks()}</div>
    </div>
  );
}

export default WeeklyView;
